import { getSiteBySlug, getSitePipelineConfigBySite } from '../../../../../lib/database'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { slug } = req.query

    if (!slug) {
      return res.status(400).json({ error: 'Site slug is required' })
    }

    // Get site first
    const site = await getSiteBySlug(slug)
    if (!site) {
      return res.status(404).json({ error: 'Site not found' })
    }

    // Get pipeline configuration for this site
    const config = await getSitePipelineConfigBySite(site.id)

    res.status(200).json({
      success: true,
      config: config || null
    })

  } catch (error) {
    console.error('Error fetching pipeline config:', error)
    res.status(500).json({ 
      error: 'Failed to fetch pipeline configuration',
      details: error.message
    })
  }
}