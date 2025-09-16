import { exchangeCodeForTokens, getLocation, getPipelines, createCustomMenu } from '../../../lib/gohighlevel'
import { getSiteBySlug, updateSite } from '../../../lib/database'

export default async function handler(req, res) {
  try {
    const { code, state, location_id } = req.query

    if (!code || !state || !location_id) {
      return res.status(400).json({ error: 'Missing required parameters' })
    }

    // Decode state parameter
    const stateData = JSON.parse(Buffer.from(state, 'base64').toString())
    const { siteSlug } = stateData

    // Get the site
    const site = await getSiteBySlug(siteSlug)
    if (!site) {
      return res.status(404).json({ error: 'Site not found' })
    }

    // Exchange code for tokens
    const tokenData = await exchangeCodeForTokens(code, process.env.GHL_REDIRECT_URI)
    
    // Get location details to verify access
    const location = await getLocation(location_id, tokenData.access_token)
    
    // Create client portal menu item in GHL
    let menuInfo = null
    try {
      const menuData = {
        name: `${site.client_name || 'Client'} Portal`,
        type: 'app',
        app_url: `${process.env.NEXTAUTH_URL}/portal/ghl-iframe?siteSlug=${siteSlug}&locationId=${location_id}`,
        icon_url: `${process.env.NEXTAUTH_URL}/favicon.ico`,
        status: 'active',
        position: 1
      }

      const menuResult = await createCustomMenu(location_id, menuData, tokenData.access_token)
      menuInfo = {
        menuId: menuResult.customMenu?.id,
        menuName: menuData.name,
        createdAt: new Date().toISOString()
      }
      
      console.log('Created GHL menu item:', menuInfo)
    } catch (menuError) {
      console.error('Error creating GHL menu item:', menuError)
      // Don't fail the entire setup if menu creation fails
    }

    // Update site with GHL credentials and menu info
    await updateSite(site.id, {
      ghl_location_id: location_id,
      ghl_access_token: tokenData.access_token,
      ghl_refresh_token: tokenData.refresh_token,
      ghl_menu_id: menuInfo?.menuId,
      ghl_menu_data: menuInfo,
      settings: {
        ...site.settings,
        ghl_location_name: location.name,
        ghl_connected_at: new Date().toISOString(),
        ghl_menu_created: !!menuInfo
      }
    })

    // Redirect to admin panel with success message
    const successUrl = `/admin/sites/${siteSlug}/ghl/success?location=${encodeURIComponent(location.name)}`
    const menuParam = menuInfo ? `&menu=created` : `&menu=failed`
    res.redirect(successUrl + menuParam)

  } catch (error) {
    console.error('Error in GHL callback:', error)
    const errorMessage = encodeURIComponent(error.message || 'Failed to connect to GoHighLevel')
    res.redirect(`/admin/sites/ghl/error?error=${errorMessage}`)
  }
}