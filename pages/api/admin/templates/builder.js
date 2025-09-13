import { createRouteHandlerClient } from '../../../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const {
      name,
      type,
      category = 'builder',
      builder_data,
      config_schema
    } = req.body

    // Validate required fields
    if (!name || !type || !builder_data) {
      return res.status(400).json({ error: 'Missing required fields: name, type, and builder_data' })
    }

    const supabase = createRouteHandlerClient()

    // Check if template name already exists
    const { data: existingTemplate } = await supabase
      .from('templates')
      .select('id')
      .eq('name', name)
      .single()

    if (existingTemplate) {
      return res.status(400).json({ error: 'Template with this name already exists' })
    }

    // Create the builder template
    const templateData = {
      name,
      type,
      category,
      config_schema: config_schema || { builder: true, fields: [] },
      is_builder_template: true,
      builder_data,
      is_active: true
    }

    const { data: template, error } = await supabase
      .from('templates')
      .insert([templateData])
      .select()
      .single()

    if (error) throw error

    // Create initial version
    const { data: version, error: versionError } = await supabase
      .from('builder_template_versions')
      .insert([{
        template_id: template.id,
        version_number: 1,
        builder_data,
        version_name: 'Initial Version',
        created_by: 'admin', // TODO: Get from auth
        is_published: true
      }])
      .select()
      .single()

    if (versionError) {
      console.error('Error creating template version:', versionError)
      // Don't fail the template creation, just log the error
    }

    res.status(201).json({
      success: true,
      message: 'Builder template created successfully',
      template,
      version
    })

  } catch (error) {
    console.error('Error creating builder template:', error)
    res.status(500).json({ 
      error: 'Failed to create builder template',
      details: error.message
    })
  }
}