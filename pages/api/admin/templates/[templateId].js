import { createRouteHandlerClient } from '../../../../lib/supabase'

export default async function handler(req, res) {
  const { templateId } = req.query

  if (req.method === 'GET') {
    return handleGetTemplate(req, res, templateId)
  } else if (req.method === 'PATCH') {
    return handleUpdateTemplate(req, res, templateId)
  } else if (req.method === 'DELETE') {
    return handleDeleteTemplate(req, res, templateId)
  } else {
    return res.status(405).json({ error: 'Method not allowed' })
  }
}

async function handleGetTemplate(req, res, templateId) {
  try {
    const supabase = createRouteHandlerClient()
    
    const { data: template, error } = await supabase
      .from('templates')
      .select('*')
      .eq('id', templateId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Template not found' })
      }
      throw error
    }

    res.status(200).json({
      success: true,
      template
    })

  } catch (error) {
    console.error('Error fetching template:', error)
    res.status(500).json({ 
      error: 'Failed to fetch template',
      details: error.message
    })
  }
}

async function handleUpdateTemplate(req, res, templateId) {
  try {
    const updates = req.body

    // Remove any fields that shouldn't be updated directly
    delete updates.id
    delete updates.created_at
    delete updates.updated_at

    // Validate required fields
    if (updates.name && updates.name.trim() === '') {
      return res.status(400).json({ error: 'Template name is required' })
    }

    const supabase = createRouteHandlerClient()

    const { data: updatedTemplate, error } = await supabase
      .from('templates')
      .update(updates)
      .eq('id', templateId)
      .select()
      .single()

    if (error) throw error

    res.status(200).json({
      success: true,
      message: 'Template updated successfully',
      template: updatedTemplate
    })

  } catch (error) {
    console.error('Error updating template:', error)
    res.status(500).json({ 
      error: 'Failed to update template',
      details: error.message
    })
  }
}

async function handleDeleteTemplate(req, res, templateId) {
  try {
    const supabase = createRouteHandlerClient()
    
    // First check if template is being used by any pages
    const { data: pagesUsingTemplate, error: checkError } = await supabase
      .from('site_pages')
      .select('id')
      .eq('template_id', templateId)
      .limit(1)

    if (checkError) throw checkError

    if (pagesUsingTemplate && pagesUsingTemplate.length > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete template that is being used by pages. Update or delete those pages first.' 
      })
    }

    // Get template info before deletion
    const { data: template, error: fetchError } = await supabase
      .from('templates')
      .select('name')
      .eq('id', templateId)
      .single()

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return res.status(404).json({ error: 'Template not found' })
      }
      throw fetchError
    }

    // Delete the template
    const { error: deleteError } = await supabase
      .from('templates')
      .delete()
      .eq('id', templateId)

    if (deleteError) throw deleteError

    res.status(200).json({
      success: true,
      message: `Template "${template.name}" deleted successfully`
    })

  } catch (error) {
    console.error('Error deleting template:', error)
    res.status(500).json({ 
      error: 'Failed to delete template',
      details: error.message
    })
  }
}