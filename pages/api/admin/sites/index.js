import { createSite, getAllSites } from '../../../../lib/database'
import { createRouteHandlerClient } from '../../../../lib/supabase'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return handleGetSites(req, res)
  } else if (req.method === 'POST') {
    return handleCreateSite(req, res)
  } else {
    return res.status(405).json({ error: 'Method not allowed' })
  }
}

async function handleGetSites(req, res) {
  try {
    const supabase = createRouteHandlerClient()
    
    // Get sites first
    const { data: sites, error } = await supabase
      .from('sites')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    // Get aggregated data for each site
    const sitesWithStats = await Promise.all(
      sites.map(async (site) => {
        const [pagesRes, customersRes, ordersRes] = await Promise.all([
          supabase.from('site_pages').select('id', { count: 'exact' }).eq('site_id', site.id),
          supabase.from('customers').select('id', { count: 'exact' }).eq('site_id', site.id),
          supabase.from('orders').select('amount').eq('site_id', site.id).eq('status', 'completed')
        ])

        const totalRevenue = ordersRes.data?.reduce((sum, order) => sum + parseFloat(order.amount || 0), 0) || 0

        return {
          ...site,
          pageCount: pagesRes.count || 0,
          customerCount: customersRes.count || 0,
          orderCount: ordersRes.data?.length || 0,
          totalRevenue
        }
      })
    )

    res.status(200).json({
      success: true,
      sites: sitesWithStats || []
    })

  } catch (error) {
    console.error('Error fetching sites:', error)
    res.status(500).json({ 
      error: 'Failed to fetch sites',
      details: error.message
    })
  }
}

async function handleCreateSite(req, res) {
  try {
    const {
      client_name,
      slug,
      template_type = 'landing',
      tracking_pixels = {},
      settings = {}
    } = req.body

    // Validate required fields
    if (!client_name || !slug) {
      return res.status(400).json({ error: 'Client name and slug are required' })
    }

    // Validate slug format
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return res.status(400).json({ error: 'Slug can only contain lowercase letters, numbers, and hyphens' })
    }

    // Check if slug already exists
    const supabase = createRouteHandlerClient()
    const { data: existingSite } = await supabase
      .from('sites')
      .select('id')
      .eq('slug', slug)
      .single()

    if (existingSite) {
      return res.status(400).json({ error: 'Site with this slug already exists' })
    }

    // Create the site
    const siteData = {
      client_name,
      slug,
      tracking_pixels,
      settings: {
        ...settings,
        template_type
      },
      status: 'active'
    }

    const site = await createSite(siteData)

    // Create default funnel for the site
    const { data: funnel, error: funnelError } = await supabase
      .from('funnels')
      .insert([{
        site_id: site.id,
        name: 'Home',
        slug: 'home',
        template_type,
        status: 'published'
      }])
      .select()
      .single()

    if (funnelError) {
      console.error('Error creating default funnel:', funnelError)
      // Don't fail the site creation, just log the error
    }

    // Get default template for this type
    const { data: template } = await supabase
      .from('templates')
      .select('*')
      .eq('type', template_type)
      .eq('is_active', true)
      .single()

    if (funnel && template) {
      // Create default home page
      const { error: pageError } = await supabase
        .from('funnel_pages')
        .insert([{
          funnel_id: funnel.id,
          template_id: template.id,
          page_order: 1,
          slug: 'home',
          content: {
            title: `${client_name} - Home`,
            hero_title: `Welcome to ${client_name}`,
            hero_subtitle: 'Experience the best in entertainment'
          },
          is_published: true
        }])

      if (pageError) {
        console.error('Error creating default page:', pageError)
      }
    }

    res.status(201).json({
      success: true,
      message: 'Site created successfully',
      site
    })

  } catch (error) {
    console.error('Error creating site:', error)
    res.status(500).json({ 
      error: 'Failed to create site',
      details: error.message
    })
  }
}