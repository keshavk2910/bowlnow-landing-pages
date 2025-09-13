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
    const supabase = createRouteHandlerClient()

    // Get basic stats for the site
    const [
      leadsResult,
      ordersResult,
      monthlyOrdersResult
    ] = await Promise.all([
      // Total leads (customers)
      supabase
        .from('customers')
        .select('id', { count: 'exact' })
        .eq('site_id', siteId),
      
      // All completed orders
      supabase
        .from('orders')
        .select('amount')
        .eq('site_id', siteId)
        .eq('status', 'completed'),
      
      // Monthly orders (current month)
      supabase
        .from('orders')
        .select('amount')
        .eq('site_id', siteId)
        .eq('status', 'completed')
        .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
    ])

    // Calculate revenue
    const totalRevenue = ordersResult.data?.reduce((sum, order) => sum + parseFloat(order.amount), 0) || 0
    const monthlyRevenue = monthlyOrdersResult.data?.reduce((sum, order) => sum + parseFloat(order.amount), 0) || 0

    // Get recent leads
    const { data: recentLeads } = await supabase
      .from('customers')
      .select('id, name, email, created_at')
      .eq('site_id', siteId)
      .order('created_at', { ascending: false })
      .limit(5)

    // Get recent orders with customer info
    const { data: recentOrders } = await supabase
      .from('orders')
      .select(`
        id,
        amount,
        status,
        created_at,
        customers (name, email)
      `)
      .eq('site_id', siteId)
      .order('created_at', { ascending: false })
      .limit(5)

    const stats = {
      totalLeads: leadsResult.count || 0,
      totalOrders: ordersResult.data?.length || 0,
      totalRevenue: totalRevenue,
      monthlyRevenue: monthlyRevenue,
      conversionRate: leadsResult.count > 0 ? ((ordersResult.data?.length || 0) / leadsResult.count * 100).toFixed(1) : 0
    }

    res.status(200).json({
      success: true,
      stats,
      recentLeads: recentLeads || [],
      recentOrders: recentOrders || []
    })

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid authentication token' })
    }
    
    console.error('Error fetching portal dashboard stats:', error)
    res.status(500).json({ 
      error: 'Failed to fetch dashboard stats',
      details: error.message
    })
  }
}