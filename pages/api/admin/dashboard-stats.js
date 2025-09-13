import { createRouteHandlerClient } from '../../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const supabase = createRouteHandlerClient()

    // Get basic stats
    const [
      sitesResult,
      activeSitesResult,
      leadsResult,
      ordersResult,
      monthlyOrdersResult
    ] = await Promise.all([
      // Total sites
      supabase.from('sites').select('id', { count: 'exact' }),
      
      // Active sites
      supabase.from('sites').select('id', { count: 'exact' }).eq('status', 'active'),
      
      // Total leads (customers)
      supabase.from('customers').select('id', { count: 'exact' }),
      
      // All completed orders
      supabase.from('orders').select('amount').eq('status', 'completed'),
      
      // Monthly orders (current month)
      supabase
        .from('orders')
        .select('amount')
        .eq('status', 'completed')
        .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
    ])

    // Calculate revenue
    const totalRevenue = ordersResult.data?.reduce((sum, order) => sum + parseFloat(order.amount), 0) || 0
    const monthlyRevenue = monthlyOrdersResult.data?.reduce((sum, order) => sum + parseFloat(order.amount), 0) || 0

    // Get recent sites
    const { data: recentSites } = await supabase
      .from('sites')
      .select('id, client_name, slug, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5)

    // Get recent orders with customer and site info
    const { data: recentOrders } = await supabase
      .from('orders')
      .select(`
        id,
        amount,
        status,
        created_at,
        customers (name, email),
        sites (client_name)
      `)
      .order('created_at', { ascending: false })
      .limit(5)

    const stats = {
      totalSites: sitesResult.count || 0,
      activeSites: activeSitesResult.count || 0,
      totalLeads: leadsResult.count || 0,
      totalRevenue: totalRevenue,
      monthlyRevenue: monthlyRevenue,
      conversions: ordersResult.data?.length || 0
    }

    res.status(200).json({
      success: true,
      stats,
      recentSites: recentSites || [],
      recentOrders: recentOrders || []
    })

  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    res.status(500).json({ 
      error: 'Failed to fetch dashboard stats',
      details: error.message
    })
  }
}