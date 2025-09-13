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
      filter = 'all' 
    } = req.query

    const supabase = createRouteHandlerClient()

    // Build query
    let query = supabase
      .from('customers')
      .select('*', { count: 'exact' })
      .eq('site_id', siteId)
      .order('created_at', { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1)

    // Apply filters
    if (filter === 'new') {
      const threeDaysAgo = new Date()
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
      query = query.gte('created_at', threeDaysAgo.toISOString())
    } else if (filter === 'contacted') {
      query = query.not('ghl_contact_id', 'is', null)
    } else if (filter === 'converted') {
      // Get customers who have orders
      const { data: customerIds } = await supabase
        .from('orders')
        .select('customer_id')
        .eq('site_id', siteId)
        .eq('status', 'completed')

      if (customerIds && customerIds.length > 0) {
        const ids = customerIds.map(o => o.customer_id).filter(Boolean)
        query = query.in('id', ids)
      } else {
        // No converted customers
        query = query.eq('id', '00000000-0000-0000-0000-000000000000') // Non-existent ID
      }
    }

    const { data: leads, error, count } = await query

    if (error) throw error

    res.status(200).json({
      success: true,
      leads: leads || [],
      total: count || 0
    })

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid authentication token' })
    }
    
    console.error('Error fetching portal leads:', error)
    res.status(500).json({ 
      error: 'Failed to fetch leads',
      details: error.message
    })
  }
}