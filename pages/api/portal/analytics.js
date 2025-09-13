import jwt from 'jsonwebtoken'
import { createRouteHandlerClient } from '../../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Verify JWT token
    const token = req.headers.authorization?.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({ error: 'No authentication token provided' })
    }

    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET)
    
    if (decoded.type !== 'client') {
      return res.status(403).json({ error: 'Invalid token type' })
    }

    const siteId = decoded.siteId
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
      default:
        startDate.setDate(now.getDate() - 30)
    }

    // Get leads for the site
    const { data: leads, count: totalLeads } = await supabase
      .from('customers')
      .select('id, attribution_data, created_at', { count: 'exact' })
      .eq('site_id', siteId)
      .gte('created_at', startDate.toISOString())

    // Get orders for the site
    const { data: orders } = await supabase
      .from('orders')
      .select('amount, status, attribution_data, created_at')
      .eq('site_id', siteId)
      .gte('created_at', startDate.toISOString())

    // Get form submissions (page views proxy)
    const { data: submissions } = await supabase
      .from('form_submissions')
      .select('id, utm_data, created_at')
      .eq('site_id', siteId)
      .gte('created_at', startDate.toISOString())

    // Calculate stats
    const totalRevenue = orders?.filter(o => o.status === 'completed')
                               .reduce((sum, order) => sum + parseFloat(order.amount), 0) || 0
    const totalOrders = orders?.filter(o => o.status === 'completed').length || 0
    const conversionRate = totalLeads > 0 ? ((totalOrders / totalLeads) * 100).toFixed(1) : 0

    // Calculate traffic sources
    const sources = {}
    leads?.forEach(lead => {
      const source = lead.attribution_data?.utm_source || 'Direct'
      sources[source] = (sources[source] || 0) + 1
    })

    const trafficSources = Object.entries(sources)
      .map(([name, count]) => ({
        name,
        visitors: count,
        percentage: ((count / (totalLeads || 1)) * 100).toFixed(1)
      }))
      .sort((a, b) => b.visitors - a.visitors)
      .slice(0, 5)

    // Top pages (simplified - based on form submissions)
    const topPages = [
      { path: '/home', funnel_name: 'Home Page', views: submissions?.length || 0 },
      { path: '/checkout', funnel_name: 'Checkout', views: totalOrders },
    ]

    const stats = {
      totalLeads,
      totalOrders,
      totalRevenue,
      conversionRate: parseFloat(conversionRate),
      totalPageViews: submissions?.length || 0,
      trafficSources,
      topPages
    }

    res.status(200).json({
      success: true,
      stats
    })

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid authentication token' })
    }
    
    console.error('Error fetching portal analytics:', error)
    res.status(500).json({ 
      error: 'Failed to fetch analytics',
      details: error.message
    })
  }
}