import { buffer } from 'micro'
import { constructWebhookEvent } from '../../../lib/stripe'
import { updateOrder, getOrderByStripeSession, updateCustomer } from '../../../lib/database'
import { createGHLContact, updateGHLOpportunity } from '../../../lib/gohighlevel'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const buf = await buffer(req)
    const signature = req.headers['stripe-signature']
    
    // Construct webhook event
    const event = await constructWebhookEvent(
      buf,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )

    console.log(`Received Stripe webhook: ${event.type}`)

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object)
        break
        
      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object)
        break
        
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object)
        break
        
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object)
        break
        
      case 'account.updated':
        await handleAccountUpdated(event.data.object)
        break
        
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    res.status(200).json({ received: true })

  } catch (error) {
    console.error('Stripe webhook error:', error)
    res.status(400).json({ error: error.message })
  }
}

async function handleCheckoutSessionCompleted(session) {
  try {
    console.log('Processing completed checkout session:', session.id)

    // Find the order by Stripe session ID
    const order = await getOrderByStripeSession(session.id)
    if (!order) {
      console.error('Order not found for session:', session.id)
      return
    }

    // Update order status
    const updatedOrder = await updateOrder(order.id, {
      status: 'completed',
      stripe_subscription_id: session.subscription || null,
      metadata: {
        ...order.metadata,
        stripe_customer_id: session.customer,
        amount_total: session.amount_total / 100
      }
    })

    // Update customer with Stripe customer ID
    if (order.customer_id && session.customer) {
      await updateCustomer(order.customer_id, {
        stripe_customer_id: session.customer
      })
    }

    // Create conversion tracking
    await fetch(`${process.env.NEXTAUTH_URL}/api/tracking/conversion`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: order.session_id,
        conversion_type: 'payment_complete',
        conversion_value: updatedOrder.amount,
        funnel_id: order.metadata.funnel_id,
        attribution_data: order.attribution_data
      })
    })

    // Sync to GoHighLevel
    await syncToGHL(updatedOrder, 'payment_completed')

    console.log('Successfully processed checkout session:', session.id)

  } catch (error) {
    console.error('Error handling checkout session completed:', error)
  }
}

async function handlePaymentSucceeded(paymentIntent) {
  try {
    console.log('Processing successful payment:', paymentIntent.id)
    
    // Additional payment processing logic if needed
    
  } catch (error) {
    console.error('Error handling payment succeeded:', error)
  }
}

async function handleInvoicePaymentSucceeded(invoice) {
  try {
    console.log('Processing successful invoice payment:', invoice.id)
    
    // Handle subscription renewals
    if (invoice.subscription) {
      // Update subscription status and sync to GHL
    }
    
  } catch (error) {
    console.error('Error handling invoice payment succeeded:', error)
  }
}

async function handleSubscriptionCreated(subscription) {
  try {
    console.log('Processing new subscription:', subscription.id)
    
    // Additional subscription setup logic
    
  } catch (error) {
    console.error('Error handling subscription created:', error)
  }
}

async function handleAccountUpdated(account) {
  try {
    console.log('Processing account update:', account.id)
    
    // Update site status based on account requirements
    // Could notify admins if account needs attention
    
  } catch (error) {
    console.error('Error handling account updated:', error)
  }
}

async function syncToGHL(order, stage) {
  try {
    // Get site and GHL configuration
    const site = await getSite(order.site_id)
    if (!site || !site.ghl_location_id) {
      console.log('No GHL configuration for site:', order.site_id)
      return
    }

    // Create or update contact in GHL
    const customer = await getCustomer(order.customer_id)
    if (customer) {
      const ghlContactId = await createGHLContact(site.ghl_location_id, {
        email: customer.email,
        name: customer.name,
        phone: customer.phone,
        customFields: {
          funnel_name: order.metadata.funnel_name,
          purchase_amount: order.amount,
          stripe_customer_id: customer.stripe_customer_id,
          attribution_source: order.attribution_data.utm_source,
          attribution_medium: order.attribution_data.utm_medium,
          attribution_campaign: order.attribution_data.utm_campaign
        }
      })

      // Update opportunity in GHL pipeline
      if (order.ghl_opportunity_id) {
        await updateGHLOpportunity(site.ghl_location_id, order.ghl_opportunity_id, {
          stage: stage,
          monetaryValue: order.amount,
          status: 'won'
        })
      }
    }

  } catch (error) {
    console.error('Error syncing to GHL:', error)
  }
}

// Helper functions

async function getSite(siteId) {
  const supabase = createRouteHandlerClient()
  
  const { data, error } = await supabase
    .from('sites')
    .select('*')
    .eq('id', siteId)
    .single()
  
  if (error) return null
  return data
}

async function getCustomer(customerId) {
  const supabase = createRouteHandlerClient()
  
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('id', customerId)
    .single()
  
  if (error) return null
  return data
}