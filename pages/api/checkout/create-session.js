import { createCheckoutSessionForConnectedAccount, calculateApplicationFee } from '../../../lib/stripe'
import { getSiteBySlug, createOrder, getCustomerByEmail, createCustomer } from '../../../lib/database'
import { createRouteHandlerClient } from '../../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const {
      plan_id,
      session_id,
      site_id,
      funnel_id,
      customer_email,
      customer_name,
      attribution_data = {},
      success_url,
      cancel_url
    } = req.body

    // Validate required fields
    if (!plan_id || !session_id || !site_id) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Get payment plan
    const paymentPlan = await getPaymentPlan(plan_id)
    if (!paymentPlan || !paymentPlan.is_active) {
      return res.status(404).json({ error: 'Payment plan not found or inactive' })
    }

    // Get site
    const site = await getSite(site_id)
    if (!site) {
      return res.status(404).json({ error: 'Site not found' })
    }

    if (!site.stripe_account_id) {
      return res.status(400).json({ error: 'Site does not have a connected Stripe account' })
    }

    // Get or create customer
    let customer = null
    if (customer_email) {
      customer = await getCustomerByEmail(site_id, customer_email)
      
      if (!customer) {
        customer = await createCustomer({
          site_id,
          email: customer_email,
          name: customer_name,
          attribution_data
        })
      }
    }

    // Calculate application fee (platform fee)
    const applicationFeeAmount = calculateApplicationFee(paymentPlan.price)

    // Create checkout session
    const checkoutSession = await createCheckoutSessionForConnectedAccount({
      accountId: site.stripe_account_id,
      priceId: paymentPlan.stripe_price_id,
      mode: paymentPlan.type === 'subscription' ? 'subscription' : 'payment',
      successUrl: success_url || `${process.env.NEXTAUTH_URL}/${site.slug}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: cancel_url || `${process.env.NEXTAUTH_URL}/${site.slug}`,
      customerEmail: customer_email,
      applicationFeeAmount,
      site_id,
      funnel_id,
      session_id,
      metadata: {
        plan_id,
        customer_id: customer?.id,
        attribution_source: attribution_data.utm_source,
        attribution_medium: attribution_data.utm_medium,
        attribution_campaign: attribution_data.utm_campaign
      }
    })

    // Create pending order record
    const orderData = {
      session_id,
      site_id,
      customer_id: customer?.id,
      payment_plan_id: plan_id,
      stripe_payment_intent_id: checkoutSession.payment_intent,
      amount: paymentPlan.price,
      currency: paymentPlan.currency,
      status: 'pending',
      attribution_data,
      metadata: {
        stripe_session_id: checkoutSession.id,
        funnel_id,
        application_fee_amount: applicationFeeAmount
      }
    }

    const order = await createOrder(orderData)

    res.status(200).json({
      success: true,
      url: checkoutSession.url,
      session_id: checkoutSession.id,
      order_id: order.id
    })

  } catch (error) {
    console.error('Error creating checkout session:', error)
    res.status(500).json({ 
      error: 'Failed to create checkout session',
      details: error.message 
    })
  }
}

// Helper function to get payment plan
async function getPaymentPlan(planId) {
  const supabase = createRouteHandlerClient()
  
  const { data, error } = await supabase
    .from('payment_plans')
    .select('*')
    .eq('id', planId)
    .single()
  
  if (error) throw error
  return data
}

// Helper function to get site
async function getSite(siteId) {
  const supabase = createRouteHandlerClient()
  
  const { data, error } = await supabase
    .from('sites')
    .select('*')
    .eq('id', siteId)
    .single()
  
  if (error) throw error
  return data
}