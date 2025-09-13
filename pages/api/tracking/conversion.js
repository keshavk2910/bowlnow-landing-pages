import { createConversion, getPageSession } from '../../../lib/database'
import { createRouteHandlerClient } from '../../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { 
      session_id, 
      conversion_type, 
      conversion_value = 0, 
      page_id, 
      attribution_data = {},
      metadata = {} 
    } = req.body

    // Validate required fields
    if (!session_id || !conversion_type) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Get the page session to find associated customer
    const session = await getPageSession(session_id)
    
    // Get site_id from page if available
    let siteId = null
    if (page_id) {
      const supabase = createRouteHandlerClient()
      const { data: page } = await supabase
        .from('site_pages')
        .select('site_id')
        .eq('id', page_id)
        .single()
      
      siteId = page?.site_id
    }
    
    // Create conversion record
    const conversionData = {
      session_id,
      customer_id: session?.customer_id || null,
      site_id: siteId,
      page_id,
      conversion_type,
      conversion_value: parseFloat(conversion_value),
      attribution_data,
      metadata
    }

    const conversion = await createConversion(conversionData)

    // Track additional analytics based on conversion type
    switch (conversion_type) {
      case 'form_submit':
        // Could trigger additional tracking here
        break
      case 'checkout_start':
        // Could update session with checkout data
        break
      case 'payment_complete':
        // Could trigger fulfillment processes
        break
    }

    res.status(200).json({ success: true, conversion })

  } catch (error) {
    console.error('Error tracking conversion:', error)
    res.status(500).json({ error: 'Failed to track conversion' })
  }
}