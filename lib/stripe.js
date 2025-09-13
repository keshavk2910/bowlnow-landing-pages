import Stripe from 'stripe'

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
})

export default stripe

// Stripe Connect functions
export async function createConnectedAccount(accountData) {
  try {
    const account = await stripe.accounts.create({
      type: 'express',
      country: accountData.country || 'US',
      email: accountData.email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: accountData.business_type || 'individual',
      metadata: {
        site_id: accountData.site_id,
        client_name: accountData.client_name
      }
    })

    return account
  } catch (error) {
    console.error('Error creating connected account:', error)
    throw error
  }
}

export async function createAccountLink(accountId, refreshUrl, returnUrl) {
  try {
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: refreshUrl,
      return_url: returnUrl,
      type: 'account_onboarding',
    })

    return accountLink
  } catch (error) {
    console.error('Error creating account link:', error)
    throw error
  }
}

export async function getConnectedAccount(accountId) {
  try {
    const account = await stripe.accounts.retrieve(accountId)
    return account
  } catch (error) {
    console.error('Error retrieving connected account:', error)
    throw error
  }
}

// Product and Price management for connected accounts
export async function createProductForConnectedAccount(accountId, productData) {
  try {
    const product = await stripe.products.create(
      {
        name: productData.name,
        description: productData.description,
        metadata: {
          site_id: productData.site_id,
          plan_id: productData.plan_id
        }
      },
      {
        stripeAccount: accountId
      }
    )

    return product
  } catch (error) {
    console.error('Error creating product for connected account:', error)
    throw error
  }
}

export async function createPriceForConnectedAccount(accountId, priceData) {
  try {
    const priceConfig = {
      unit_amount: Math.round(priceData.amount * 100), // Convert to cents
      currency: priceData.currency || 'usd',
      product: priceData.product_id,
      metadata: {
        site_id: priceData.site_id,
        plan_id: priceData.plan_id
      }
    }

    // Add recurring config for subscriptions
    if (priceData.type === 'subscription') {
      priceConfig.recurring = {
        interval: priceData.billing_interval || 'month'
      }
    }

    const price = await stripe.prices.create(priceConfig, {
      stripeAccount: accountId
    })

    return price
  } catch (error) {
    console.error('Error creating price for connected account:', error)
    throw error
  }
}

// Checkout session creation for connected accounts
export async function createCheckoutSessionForConnectedAccount(sessionData) {
  try {
    const {
      accountId,
      priceId,
      successUrl,
      cancelUrl,
      customerEmail,
      metadata = {}
    } = sessionData

    const sessionConfig = {
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: sessionData.mode || 'payment', // 'payment' for one-time, 'subscription' for recurring
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        ...metadata,
        site_id: sessionData.site_id,
        funnel_id: sessionData.funnel_id,
        session_id: sessionData.session_id
      },
      customer_creation: 'always',
    }

    if (customerEmail) {
      sessionConfig.customer_email = customerEmail
    }

    // Configure payment intent data for application fees
    if (sessionData.applicationFeeAmount) {
      sessionConfig.payment_intent_data = {
        application_fee_amount: Math.round(sessionData.applicationFeeAmount * 100),
      }
    }

    const session = await stripe.checkout.sessions.create(sessionConfig, {
      stripeAccount: accountId
    })

    return session
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw error
  }
}

// Webhook handling
export async function constructWebhookEvent(body, signature, endpointSecret) {
  try {
    const event = stripe.webhooks.constructEvent(body, signature, endpointSecret)
    return event
  } catch (error) {
    console.error('Error constructing webhook event:', error)
    throw error
  }
}

// Customer management for connected accounts
export async function createCustomerForConnectedAccount(accountId, customerData) {
  try {
    const customer = await stripe.customers.create({
      email: customerData.email,
      name: customerData.name,
      phone: customerData.phone,
      metadata: {
        site_id: customerData.site_id,
        customer_id: customerData.customer_id
      }
    }, {
      stripeAccount: accountId
    })

    return customer
  } catch (error) {
    console.error('Error creating customer for connected account:', error)
    throw error
  }
}

// Utility functions
export function calculateApplicationFee(amount, feePercentage = 2.9) {
  return Math.round(amount * (feePercentage / 100) * 100) / 100
}