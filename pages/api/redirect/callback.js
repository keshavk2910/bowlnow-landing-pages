import { exchangeCodeForTokens, getLocation, getPipelines } from '../../../lib/gohighlevel'
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
    
    // Update site with GHL credentials
    await updateSite(site.id, {
      ghl_location_id: location_id,
      ghl_access_token: tokenData.access_token,
      ghl_refresh_token: tokenData.refresh_token,
      settings: {
        ...site.settings,
        ghl_location_name: location.name,
        ghl_connected_at: new Date().toISOString()
      }
    })

    // Redirect to admin panel with success message
    res.redirect(`/admin/sites/${siteSlug}/ghl/success?location=${encodeURIComponent(location.name)}`)

  } catch (error) {
    console.error('Error in GHL callback:', error)
    const errorMessage = encodeURIComponent(error.message || 'Failed to connect to GoHighLevel')
    res.redirect(`/admin/sites/ghl/error?error=${errorMessage}`)
  }
}