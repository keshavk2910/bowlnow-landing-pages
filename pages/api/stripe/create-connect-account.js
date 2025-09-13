import { createConnectedAccount, createAccountLink } from '../../../lib/stripe'
import { updateSite, getSiteBySlug } from '../../../lib/database'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { siteSlug, email, country = 'US', businessType = 'individual' } = req.body

    // Validate required fields
    if (!siteSlug || !email) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Get the site
    const site = await getSiteBySlug(siteSlug)
    if (!site) {
      return res.status(404).json({ error: 'Site not found' })
    }

    // Check if site already has a connected account
    if (site.stripe_account_id) {
      return res.status(400).json({ error: 'Site already has a connected Stripe account' })
    }

    // Create Stripe Connect account
    const account = await createConnectedAccount({
      email,
      country,
      business_type: businessType,
      site_id: site.id,
      client_name: site.client_name
    })

    // Update site with Stripe account ID
    await updateSite(site.id, {
      stripe_account_id: account.id
    })

    // Create account link for onboarding
    const refreshUrl = `${process.env.NEXTAUTH_URL}/admin/sites/${site.slug}/stripe/refresh`
    const returnUrl = `${process.env.NEXTAUTH_URL}/admin/sites/${site.slug}/stripe/success`
    
    const accountLink = await createAccountLink(account.id, refreshUrl, returnUrl)

    res.status(200).json({
      success: true,
      account_id: account.id,
      onboarding_url: accountLink.url
    })

  } catch (error) {
    console.error('Error creating Stripe Connect account:', error)
    res.status(500).json({ 
      error: 'Failed to create Stripe Connect account',
      details: error.message 
    })
  }
}