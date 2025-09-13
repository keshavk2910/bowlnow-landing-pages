import { createAttributionTracking } from '../../../lib/database'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const attributionData = req.body

    // Validate required fields
    if (!attributionData.session_id) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Add server-side data
    const serverData = {
      ...attributionData,
      ip_address: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      user_agent: req.headers['user-agent']
    }

    // Check if this is first touch or last touch
    const isFirstTouch = !attributionData.referrer_url || 
                        attributionData.referrer_url.includes(process.env.BASE_DOMAIN)
    
    serverData.first_touch = isFirstTouch
    serverData.last_touch = true // Always mark as last touch, previous ones will be updated

    // Create attribution record
    const attribution = await createAttributionTracking(serverData)

    res.status(200).json({ success: true, attribution })

  } catch (error) {
    console.error('Error tracking attribution:', error)
    res.status(500).json({ error: 'Failed to track attribution' })
  }
}