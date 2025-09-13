import { getSiteBySlug, getPaymentPlansBySite } from '../../../../lib/database'

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

    // Get payment plans for this site
    const plans = await getPaymentPlansBySite(site.id)

    res.status(200).json({
      success: true,
      plans: plans || []
    })

  } catch (error) {
    console.error('Error fetching site payment plans:', error)
    res.status(500).json({ 
      error: 'Failed to fetch payment plans',
      details: error.message
    })
  }
}