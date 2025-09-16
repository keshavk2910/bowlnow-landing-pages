import { createCustomMenu } from '../../../../../lib/gohighlevel';
import { createRouteHandlerClient } from '../../../../../lib/supabase';
import { requireAuth } from '../../../../../lib/auth-middleware';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check if GHL_AGENCY_TOKEN is available
  if (!process.env.GHL_AGENCY_TOKEN) {
    console.error('ERROR: GHL_AGENCY_TOKEN environment variable is not set');
    return res.status(500).json({
      error: 'Server configuration error: GHL_AGENCY_TOKEN not configured',
    });
  }

  try {
    const { slug } = req.query;
    const supabase = createRouteHandlerClient();

    // Get site with GHL credentials
    const { data: site, error: siteError } = await supabase
      .from('sites')
      .select('*')
      .eq('slug', slug)
      .single();

    if (siteError || !site) {
      return res.status(404).json({ error: 'Site not found' });
    }

    if (!site.ghl_location_id) {
      return res
        .status(400)
        .json({ error: 'Site is not connected to GoHighLevel' });
    }

    if (site.ghl_menu_id) {
      return res
        .status(400)
        .json({ error: 'Menu item already exists for this site' });
    }

    // Create menu item data
    const menuData = {
      title: `${site.client_name || 'Client'} Portal`,
      type: 'app',
      url: `${process.env.NEXTAUTH_URL}/portal/ghl-iframe?siteSlug=${slug}&locationId=${site.ghl_location_id}`,
      showOnLocation: true,
      openMode: 'iframe',
      locations: [site.ghl_location_id],
      userRole: 'admin',
      icon: {
        name: 'yin-ang',
        fontFamily: 'fas',
      },
    };

    console.log('DEBUG: About to create custom menu with data:', menuData);
    console.log(
      'DEBUG: GHL_AGENCY_TOKEN available:',
      !!process.env.GHL_AGENCY_TOKEN
    );

    // Create the custom menu in GHL using agency token
    const menuResult = await createCustomMenu(site.ghl_location_id, menuData);

    // Update site with menu info
    const menuInfo = {
      menuId: menuResult.customMenu?.id || menuResult.id,
      menuName: menuData.title,
      createdAt: new Date().toISOString(),
    };

    const { error: updateError } = await supabase
      .from('sites')
      .update({
        ghl_menu_id: menuInfo.menuId,
        ghl_menu_data: menuInfo,
        settings: {
          ...site.settings,
          ghl_menu_created: true,
          ghl_menu_created_at: new Date().toISOString(),
        },
      })
      .eq('id', site.id);

    if (updateError) {
      console.error('Error updating site with menu info:', updateError);
      return res.status(500).json({ error: 'Failed to save menu information' });
    }

    res.status(200).json({
      success: true,
      menu: menuResult.customMenu,
      message: 'Client portal menu item created successfully',
    });
  } catch (error) {
    console.error('Error creating GHL menu item:', error);
    res.status(500).json({
      error: 'Failed to create menu item',
      details: error.message,
    });
  }
}
