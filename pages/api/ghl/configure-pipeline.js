import { getSiteBySlug, createSitePipelineConfig, getSitePipelineConfigBySite } from '../../../lib/database'
import { getPipelines, getPipelineStages } from '../../../lib/gohighlevel-v2'
import { createRouteHandlerClient } from '../../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const {
      siteSlug,
      pipelineId,
      stageMappings
    } = req.body

    // Validate required fields
    if (!siteSlug || !pipelineId || !stageMappings) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Get the site
    const site = await getSiteBySlug(siteSlug)
    if (!site) {
      return res.status(404).json({ error: 'Site not found' })
    }

    if (!site.ghl_location_id) {
      return res.status(400).json({ error: 'Site is not connected to GoHighLevel. Please add a Location ID first.' })
    }

    // We're just saving our mapping preferences - no need to verify with GHL API
    // The pipeline and stage validation happens on the frontend

    // Check if configuration already exists
    const existingConfig = await getSitePipelineConfigBySite(site.id)
    
    if (existingConfig) {
      // Update existing configuration
      const supabase = createRouteHandlerClient()
      const { data, error } = await supabase
        .from('site_pipeline_config')
        .update({
          pipeline_id: pipelineId,
          pipeline_name: req.body.pipelineName || 'Selected Pipeline',
          stage_mappings: stageMappings,
          is_active: true
        })
        .eq('id', existingConfig.id)
        .select()
        .single()

      if (error) throw error
      
      res.status(200).json({
        success: true,
        message: 'Pipeline configuration updated',
        config: data
      })
    } else {
      // Create new configuration
      const config = await createSitePipelineConfig({
        site_id: site.id,
        pipeline_id: pipelineId,
        pipeline_name: req.body.pipelineName || 'Selected Pipeline',
        stage_mappings: stageMappings,
        is_active: true
      })

      res.status(200).json({
        success: true,
        message: 'Pipeline configuration created',
        config
      })
    }

  } catch (error) {
    console.error('Error configuring GHL pipeline:', error)
    res.status(500).json({ 
      error: 'Failed to configure pipeline',
      details: error.message
    })
  }
}