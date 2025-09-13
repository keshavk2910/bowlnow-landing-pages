import { getConnectedAccount } from '../../../lib/stripe'
import { getSiteBySlug } from '../../../lib/database'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { siteSlug } = req.query

    if (!siteSlug) {
      return res.status(400).json({ error: 'Site slug is required' })
    }

    // Get the site
    const site = await getSiteBySlug(siteSlug)
    if (!site) {
      return res.status(404).json({ error: 'Site not found' })
    }

    if (!site.stripe_account_id) {
      return res.status(200).json({
        connected: false,
        account_status: 'not_connected'
      })
    }

    // Get Stripe account details
    const account = await getConnectedAccount(site.stripe_account_id)

    const accountStatus = {
      connected: true,
      account_id: account.id,
      account_status: account.details_submitted ? 'active' : 'pending',
      charges_enabled: account.charges_enabled,
      payouts_enabled: account.payouts_enabled,
      requirements: account.requirements,
      business_profile: account.business_profile,
      country: account.country,
      email: account.email,
      created: account.created
    }

    res.status(200).json(accountStatus)

  } catch (error) {
    console.error('Error getting Stripe account status:', error)
    res.status(500).json({ 
      error: 'Failed to get account status',
      details: error.message 
    })
  }
}