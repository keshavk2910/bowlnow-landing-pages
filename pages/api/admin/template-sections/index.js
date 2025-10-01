import { supabase } from '../../../../lib/supabase'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('template_sections')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      res.status(200).json({ success: true, data })
    } catch (error) {
      console.error('Error fetching template sections:', error)
      res.status(500).json({ success: false, error: error.message })
    }
  } else if (req.method === 'POST') {
    try {
      const { name, description, component_name, config_schema, is_active = true } = req.body

      if (!name || !component_name) {
        return res.status(400).json({ 
          success: false, 
          error: 'Name and component_name are required' 
        })
      }

      const { data, error } = await supabase
        .from('template_sections')
        .insert([
          {
            name,
            description,
            component_name,
            config_schema,
            is_active
          }
        ])
        .select()

      if (error) throw error

      res.status(201).json({ success: true, data: data[0] })
    } catch (error) {
      console.error('Error creating template section:', error)
      res.status(500).json({ success: false, error: error.message })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).json({ success: false, error: 'Method not allowed' })
  }
}
