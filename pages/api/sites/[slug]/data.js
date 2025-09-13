import { getSiteBySlug, getSitePages } from '../../../../lib/database'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { slug } = req.query

    if (!slug) {
      return res.status(400).json({ error: 'Site slug is required' })
    }

    // Get site by slug
    const site = await getSiteBySlug(slug)
    if (!site) {
      return res.status(404).json({ error: 'Site not found' })
    }

    // Get pages for this site
    const pages = await getSitePages(site.id)

    res.status(200).json({
      success: true,
      site,
      pages: pages || []
    })

  } catch (error) {
    console.error('Error fetching site data:', error)
    res.status(500).json({ 
      error: 'Failed to fetch site data',
      details: error.message
    })
  }
}