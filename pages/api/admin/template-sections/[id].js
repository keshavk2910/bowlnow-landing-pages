import { supabase } from '../../../../lib/supabase'

export default async function handler(req, res) {
  const { id } = req.query

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('template_sections')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      res.status(200).json({ success: true, data })
    } catch (error) {
      console.error('Error fetching template section:', error)
      res.status(500).json({ success: false, error: error.message })
    }
  } else if (req.method === 'PUT') {
    try {
      const { name, description, component_name, config_schema, is_active } = req.body

      const updateData = {}
      if (name !== undefined) updateData.name = name
      if (description !== undefined) updateData.description = description
      if (component_name !== undefined) updateData.component_name = component_name
      if (config_schema !== undefined) updateData.config_schema = config_schema
      if (is_active !== undefined) updateData.is_active = is_active

      const { data, error } = await supabase
        .from('template_sections')
        .update(updateData)
        .eq('id', id)
        .select()

      if (error) throw error

      res.status(200).json({ success: true, data: data[0] })
    } catch (error) {
      console.error('Error updating template section:', error)
      res.status(500).json({ success: false, error: error.message })
    }
  } else if (req.method === 'DELETE') {
    try {
      const { error } = await supabase
        .from('template_sections')
        .delete()
        .eq('id', id)

      if (error) throw error

      res.status(200).json({ success: true })
    } catch (error) {
      console.error('Error deleting template section:', error)
      res.status(500).json({ success: false, error: error.message })
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
    res.status(405).json({ success: false, error: 'Method not allowed' })
  }
}
