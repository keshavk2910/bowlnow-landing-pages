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
    const { 
      offset = 0, 
      limit = 20, 
      status = 'all' 
    } = req.query

    const supabase = createRouteHandlerClient()

    // Build query
    let query = supabase
      .from('orders')
      .select(`
        *,
        customers (name, email),
        payment_plans (name, type)
      `, { count: 'exact' })
      .eq('site_id', siteId)
      .order('created_at', { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1)

    // Apply status filter
    if (status !== 'all') {
      query = query.eq('status', status)
    }

    const { data: orders, error, count } = await query

    if (error) throw error

    res.status(200).json({
      success: true,
      orders: orders || [],
      total: count || 0
    })

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid authentication token' })
    }
    
    console.error('Error fetching portal orders:', error)
    res.status(500).json({ 
      error: 'Failed to fetch orders',
      details: error.message
    })
  }
}