import { createRouteHandlerClient } from '../../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { range = '30d' } = req.query
    const supabase = createRouteHandlerClient()

    // Calculate date range
    const now = new Date()
    let startDate = new Date()
    
    switch (range) {
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case '90d':
        startDate.setDate(now.getDate() - 90)
        break
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        startDate.setDate(now.getDate() - 30)
    }

    // Get total revenue
    const { data: orders } = await supabase
      .from('orders')
      .select('amount, site_id, created_at')
      .eq('status', 'completed')
      .gte('created_at', startDate.toISOString())

    // Get total leads
    const { data: leads, count: totalLeads } = await supabase
      .from('customers')
      .select('id, site_id, created_at', { count: 'exact' })
      .gte('created_at', startDate.toISOString())

    // Calculate stats
    const totalRevenue = orders?.reduce((sum, order) => sum + parseFloat(order.amount), 0) || 0
    const totalOrders = orders?.length || 0
    const conversionRate = totalLeads > 0 ? ((totalOrders / totalLeads) * 100).toFixed(1) : 0

    // Get top performing sites
    const siteRevenue = {}
    const siteLeads = {}
    
    orders?.forEach(order => {
      siteRevenue[order.site_id] = (siteRevenue[order.site_id] || 0) + parseFloat(order.amount)
    })
    
    leads?.forEach(lead => {
      siteLeads[lead.site_id] = (siteLeads[lead.site_id] || 0) + 1
    })

    // Get site names for top performers
    const { data: sites } = await supabase
      .from('sites')
      .select('id, client_name, slug')

    const topSites = Object.entries(siteRevenue)
      .map(([siteId, revenue]) => {
        const site = sites?.find(s => s.id === siteId)
        return {
          id: siteId,
          client_name: site?.client_name || 'Unknown',
          slug: site?.slug || '',
          revenue,
          leads: siteLeads[siteId] || 0
        }
      })
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)

    // Get recent activity
    const { data: recentOrders } = await supabase
      .from('orders')
      .select(`
        id,
        amount,
        created_at,
        customers (name, email),
        sites (client_name)
      `)
      .order('created_at', { ascending: false })
      .limit(10)

    const { data: recentLeads } = await supabase
      .from('customers')
      .select(`
        id,
        name,
        email,
        created_at,
        sites (client_name)
      `)
      .order('created_at', { ascending: false })
      .limit(10)

    // Combine and sort recent activity
    const recentActivity = [
      ...(recentOrders?.map(order => ({
        type: 'order',
        description: `New order: $${order.amount} from ${order.customers?.name || order.customers?.email}`,
        site_name: order.sites?.client_name,
        time_ago: getTimeAgo(order.created_at)
      })) || []),
      ...(recentLeads?.map(lead => ({
        type: 'lead',
        description: `New lead: ${lead.name || lead.email}`,
        site_name: lead.sites?.client_name,
        time_ago: getTimeAgo(lead.created_at)
      })) || [])
    ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 10)

    const stats = {
      totalRevenue,
      totalLeads,
      totalOrders,
      conversionRate: parseFloat(conversionRate),
      topSites,
      recentActivity
    }

    res.status(200).json({
      success: true,
      stats
    })

  } catch (error) {
    console.error('Error fetching analytics:', error)
    res.status(500).json({ 
      error: 'Failed to fetch analytics',
      details: error.message
    })
  }
}

function getTimeAgo(dateString) {
  const now = new Date()
  const date = new Date(dateString)
  const diffInMinutes = Math.floor((now - date) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h ago`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays}d ago`
  
  return date.toLocaleDateString()
}