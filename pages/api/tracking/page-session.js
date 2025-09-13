import { createRouteHandlerClient } from '../../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { session_id, page_id, utm_params } = req.body

    // Validate required fields
    if (!session_id) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const supabase = createRouteHandlerClient()

    // Check if session already exists
    const { data: existingSession } = await supabase
      .from('page_sessions')
      .select('*')
      .eq('session_id', session_id)
      .single()

    let session
    if (existingSession) {
      // Update existing session
      const updates = {
        current_step: existingSession.current_step + 1,
        last_activity: new Date().toISOString()
      }

      // Add conversion event if this is a new page
      if (page_id && existingSession.page_id !== page_id) {
        const conversionEvents = [...(existingSession.conversion_events || []), {
          page_id: page_id,
          timestamp: new Date().toISOString(),
          event_type: 'page_view'
        }]
        updates.conversion_events = conversionEvents
        updates.page_id = page_id
      }

      const { data, error } = await supabase
        .from('page_sessions')
        .update(updates)
        .eq('session_id', session_id)
        .select()
        .single()

      if (error) throw error
      session = data
    } else {
      // Verify page exists before creating session
      let validPageId = null
      if (page_id) {
        const { data: pageExists } = await supabase
          .from('site_pages')
          .select('id')
          .eq('id', page_id)
          .single()
        
        validPageId = pageExists?.id || null
      }

      // Create new session
      const sessionData = {
        session_id,
        page_id: validPageId,
        current_step: 1,
        utm_params: utm_params || {},
        conversion_events: validPageId ? [{
          page_id: validPageId,
          timestamp: new Date().toISOString(),
          event_type: 'page_view'
        }] : [],
        last_activity: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('page_sessions')
        .insert([sessionData])
        .select()
        .single()

      if (error) throw error
      session = data
    }

    res.status(200).json({ success: true, session })

  } catch (error) {
    console.error('Error tracking page session:', error)
    res.status(500).json({ error: 'Failed to track page session' })
  }
}