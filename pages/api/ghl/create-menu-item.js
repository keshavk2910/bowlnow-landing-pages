import { createCustomMenu } from '../../../lib/gohighlevel'
import { createRouteHandlerClient } from '../../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { locationId, accessToken, siteSlug } = req.body

    if (!locationId || !accessToken || !siteSlug) {
      return res.status(400).json({ error: 'Missing required parameters' })
    }

    // Get site info to customize menu
    const supabase = createRouteHandlerClient()
    const { data: site, error: siteError } = await supabase
      .from('sites')
      .select('id, client_name, slug')
      .eq('slug', siteSlug)
      .single()

    if (siteError || !site) {
      return res.status(404).json({ error: 'Site not found' })
    }

    // Create menu item data
    const menuData = {
      name: `${site.client_name} Portal`,
      type: 'app',
      app_url: `${process.env.NEXTAUTH_URL}/portal/ghl-iframe?siteSlug=${siteSlug}&locationId=${locationId}`,
      icon_url: `${process.env.NEXTAUTH_URL}/favicon.ico`,
      status: 'active',
      position: 1
    }

    // Create the custom menu in GHL
    const menuResult = await createCustomMenu(locationId, menuData, accessToken)

    // Store menu info in database for future reference
    const { error: updateError } = await supabase
      .from('sites')
      .update({
        ghl_menu_id: menuResult.customMenu?.id,
        ghl_menu_data: {
          menuId: menuResult.customMenu?.id,
          locationId: locationId,
          createdAt: new Date().toISOString()
        }
      })
      .eq('id', site.id)

    if (updateError) {
      console.error('Error storing menu info:', updateError)
    }

    res.status(200).json({
      success: true,
      menu: menuResult.customMenu,
      message: 'Client portal menu item created successfully'
    })

  } catch (error) {
    console.error('Error creating GHL menu item:', error)
    res.status(500).json({ 
      error: 'Failed to create menu item',
      details: error.message
    })
  }
}