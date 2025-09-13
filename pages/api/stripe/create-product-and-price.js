import { createProductForConnectedAccount, createPriceForConnectedAccount } from '../../../lib/stripe'
import { getSiteBySlug, createPaymentPlan, updatePaymentPlan } from '../../../lib/database'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const {
      siteSlug,
      planId, // If updating existing plan
      name,
      description,
      price,
      currency = 'usd',
      type, // 'one_time' or 'subscription'
      billingInterval = 'month' // For subscriptions
    } = req.body

    // Validate required fields
    if (!siteSlug || !name || !price || !type) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Get the site
    const site = await getSiteBySlug(siteSlug)
    if (!site) {
      return res.status(404).json({ error: 'Site not found' })
    }

    if (!site.stripe_account_id) {
      return res.status(400).json({ error: 'Site does not have a connected Stripe account' })
    }

    // Create Stripe product
    const product = await createProductForConnectedAccount(site.stripe_account_id, {
      name,
      description,
      site_id: site.id,
      plan_id: planId
    })

    // Create Stripe price
    const stripePrice = await createPriceForConnectedAccount(site.stripe_account_id, {
      amount: price,
      currency,
      product_id: product.id,
      type,
      billing_interval: billingInterval,
      site_id: site.id,
      plan_id: planId
    })

    // Create or update payment plan in our database
    const planData = {
      site_id: site.id,
      name,
      description,
      price: parseFloat(price),
      currency,
      type,
      stripe_price_id: stripePrice.id,
      billing_interval: type === 'subscription' ? billingInterval : null,
      is_active: true
    }

    let paymentPlan
    if (planId) {
      // Update existing plan
      paymentPlan = await updatePaymentPlan(planId, {
        ...planData,
        stripe_price_id: stripePrice.id
      })
    } else {
      // Create new plan
      paymentPlan = await createPaymentPlan(planData)
    }

    res.status(200).json({
      success: true,
      payment_plan: paymentPlan,
      stripe_product: product,
      stripe_price: stripePrice
    })

  } catch (error) {
    console.error('Error creating product and price:', error)
    res.status(500).json({ 
      error: 'Failed to create product and price',
      details: error.message 
    })
  }
}