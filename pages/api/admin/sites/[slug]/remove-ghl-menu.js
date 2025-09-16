import { deleteCustomMenu } from '../../../../../lib/gohighlevel'
import { createRouteHandlerClient } from '../../../../../lib/supabase'
import { requireAuth } from '../../../../../lib/auth-middleware'

export default requireAuth(async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { slug } = req.query
    const supabase = createRouteHandlerClient()

    // Get site with GHL credentials and menu info
    const { data: site, error: siteError } = await supabase
      .from('sites')
      .select('*')
      .eq('slug', slug)
      .single()

    if (siteError || !site) {
      return res.status(404).json({ error: 'Site not found' })
    }

    if (!site.ghl_menu_id) {
      return res.status(400).json({ error: 'No menu item to remove' })
    }

    // Delete the menu item from GHL using agency token
    try {
      await deleteCustomMenu(site.ghl_menu_id)
    } catch (ghlError) {
      console.error('Error deleting menu from GHL:', ghlError)
      // Continue to remove from database even if GHL deletion fails
    }

    // Remove menu info from database
    const { error: updateError } = await supabase
      .from('sites')
      .update({
        ghl_menu_id: null,
        ghl_menu_data: null,
        settings: {
          ...site.settings,
          ghl_menu_created: false,
          ghl_menu_removed_at: new Date().toISOString()
        }
      })
      .eq('id', site.id)

    if (updateError) {
      console.error('Error updating site with removed menu info:', updateError)
      return res.status(500).json({ error: 'Failed to update menu information' })
    }

    res.status(200).json({
      success: true,
      message: 'Client portal menu item removed successfully'
    })

  } catch (error) {
    console.error('Error removing GHL menu item:', error)
    res.status(500).json({ 
      error: 'Failed to remove menu item',
      details: error.message
    })
  }
})