import { createRouteHandlerClient } from '../../../../lib/supabase'
import { LANDING_PAGE_CONFIG } from '../../../../utils/landingPageConfig'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { templateId, configSchema } = req.body

    if (!templateId) {
      return res.status(400).json({ error: 'Template ID is required' })
    }

    const supabase = createRouteHandlerClient()
    
    // Use the provided config schema or default to LANDING_PAGE_CONFIG
    const schemaToUse = configSchema || LANDING_PAGE_CONFIG
    
    console.log('Updating template configuration for ID:', templateId)
    
    const { data: updatedTemplate, error } = await supabase
      .from('templates')
      .update({
        config_schema: schemaToUse,
        updated_at: new Date().toISOString()
      })
      .eq('id', templateId)
      .select()
      .single()

    if (error) {
      console.error('Error updating template:', error)
      return res.status(500).json({ 
        error: 'Failed to update template configuration',
        details: error.message
      })
    }

    res.status(200).json({
      success: true,
      message: 'Template configuration updated successfully',
      template: updatedTemplate
    })

  } catch (error) {
    console.error('Error in update-config API:', error)
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message
    })
  }
}

