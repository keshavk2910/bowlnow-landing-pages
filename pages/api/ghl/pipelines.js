import { getPipelines, getPipelineStages } from '../../../lib/gohighlevel-location'
import { getSiteBySlug } from '../../../lib/database'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { siteSlug, pipelineId } = req.query

    if (!siteSlug) {
      return res.status(400).json({ error: 'Site slug is required' })
    }

    // Get the site
    const site = await getSiteBySlug(siteSlug)
    if (!site) {
      return res.status(404).json({ error: 'Site not found' })
    }

    if (!site.ghl_location_id || !site.ghl_location_token_encrypted) {
      return res.status(400).json({ error: 'Site is not connected to GoHighLevel. Please add Location ID and Private Integration Token.' })
    }

    let pipelines = []
    let stages = []

    if (pipelineId) {
      // Get stages for specific pipeline (stages are included in pipeline data)
      stages = await getPipelineStages(site.ghl_location_id, pipelineId, site.ghl_location_token_encrypted)
    } else {
      // Get all pipelines (includes stages)
      pipelines = await getPipelines(site.ghl_location_id, site.ghl_location_token_encrypted)
    }

    res.status(200).json({
      success: true,
      pipelines,
      stages
    })

  } catch (error) {
    console.error('Error getting GHL pipelines:', error)
    res.status(500).json({ 
      error: 'Failed to get pipelines',
      details: error.response?.data?.message || error.message
    })
  }
}