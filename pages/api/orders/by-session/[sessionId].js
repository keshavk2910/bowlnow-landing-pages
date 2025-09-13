import { createRouteHandlerClient } from '../../../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { sessionId } = req.query

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' })
    }

    const supabase = createRouteHandlerClient()

    // Get order by Stripe session ID from metadata
    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        customers (name, email, phone),
        payment_plans (name, description),
        sites (client_name, slug)
      `)
      .eq('metadata->>stripe_session_id', sessionId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Order not found' })
      }
      throw error
    }

    res.status(200).json({
      success: true,
      order
    })

  } catch (error) {
    console.error('Error fetching order by session:', error)
    res.status(500).json({ 
      error: 'Failed to fetch order details',
      details: error.message
    })
  }
}