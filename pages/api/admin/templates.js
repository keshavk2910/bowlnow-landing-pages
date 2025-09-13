import { getAllTemplates } from '../../../lib/database'
import { createRouteHandlerClient } from '../../../lib/supabase'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return handleGetTemplates(req, res)
  } else if (req.method === 'POST') {
    return handleCreateTemplate(req, res)
  } else {
    return res.status(405).json({ error: 'Method not allowed' })
  }
}

async function handleGetTemplates(req, res) {
  try {
    const templates = await getAllTemplates()

    res.status(200).json({
      success: true,
      templates
    })

  } catch (error) {
    console.error('Error fetching templates:', error)
    res.status(500).json({ 
      error: 'Failed to fetch templates',
      details: error.message
    })
  }
}

async function handleCreateTemplate(req, res) {
  try {
    const {
      name,
      type,
      category,
      config_schema,
      preview_image_url,
      is_active = true
    } = req.body

    // Validate required fields
    if (!name || !type || !category || !config_schema) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const supabase = createRouteHandlerClient()
    
    const { data: template, error } = await supabase
      .from('templates')
      .insert([{
        name,
        type,
        category,
        config_schema,
        preview_image_url,
        is_active
      }])
      .select()
      .single()

    if (error) throw error

    res.status(201).json({
      success: true,
      message: 'Template created successfully',
      template
    })

  } catch (error) {
    console.error('Error creating template:', error)
    res.status(500).json({ 
      error: 'Failed to create template',
      details: error.message
    })
  }
}