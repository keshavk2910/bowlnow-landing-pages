import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function CheckoutTemplate({ content, site, funnel, page, sessionId, onFormSubmit, onCheckoutClick, loading }) {
  const router = useRouter()
  const [paymentPlans, setPaymentPlans] = useState([])
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: ''
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [loadingPlans, setLoadingPlans] = useState(true)

  useEffect(() => {
    fetchPaymentPlans()
  }, [site.id])

  async function fetchPaymentPlans() {
    try {
      const response = await fetch(`/api/sites/${site.id}/payment-plans`)
      if (response.ok) {
        const data = await response.json()
        setPaymentPlans(data.plans)
        if (data.plans.length === 1) {
          setSelectedPlan(data.plans[0])
        }
      }
    } catch (error) {
      console.error('Error fetching payment plans:', error)
    } finally {
      setLoadingPlans(false)
    }
  }

  const handleCustomerInfoChange = (field, value) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }))
  }

  const handleProceedToPayment = async () => {
    if (!selectedPlan || !customerInfo.email) {
      alert('Please select a plan and provide your email address')
      return
    }

    setIsProcessing(true)

    try {
      await onCheckoutClick(selectedPlan.id, {
        ...selectedPlan,
        customer_email: customerInfo.email,
        customer_name: customerInfo.name
      })
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Failed to process checkout. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const themeColor = site.settings?.theme_color || '#4F46E5'
  const title = content.title || 'Complete Your Purchase'
  const heroTitle = content.hero_title || 'Secure Checkout'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="text-gray-500 hover:text-gray-700"
              >
                <ArrowLeftIcon className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{heroTitle}</h1>
                <p className="text-gray-600">{site.client_name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <LockClosedIcon className="h-5 w-5 text-green-500" />
              <span className="text-sm text-green-600 font-medium">Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Customer Info & Plan Selection */}
          <div className="space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="customer_name"
                    value={customerInfo.name}
                    onChange={(e) => handleCustomerInfoChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    style={{ focusRingColor: themeColor }}
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label htmlFor="customer_email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="customer_email"
                    required
                    value={customerInfo.email}
                    onChange={(e) => handleCustomerInfoChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    style={{ focusRingColor: themeColor }}
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="customer_phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="customer_phone"
                    value={customerInfo.phone}
                    onChange={(e) => handleCustomerInfoChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    style={{ focusRingColor: themeColor }}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
            </div>

            {/* Plan Selection */}
            {paymentPlans.length > 1 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Plan</h2>
                
                {loadingPlans ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-16 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {paymentPlans.map((plan) => (
                      <div
                        key={plan.id}
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                          selectedPlan?.id === plan.id
                            ? 'border-opacity-100'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        style={{
                          borderColor: selectedPlan?.id === plan.id ? themeColor : undefined
                        }}
                        onClick={() => setSelectedPlan(plan)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <input
                              type="radio"
                              checked={selectedPlan?.id === plan.id}
                              onChange={() => setSelectedPlan(plan)}
                              className="h-4 w-4"
                              style={{ accentColor: themeColor }}
                            />
                            <div>
                              <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                              {plan.description && (
                                <p className="text-sm text-gray-600">{plan.description}</p>
                              )}
                              {plan.type === 'subscription' && (
                                <p className="text-xs text-gray-500">
                                  Recurring {plan.billing_interval}ly
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-gray-900">
                              ${plan.price}
                            </div>
                            {plan.type === 'subscription' && (
                              <div className="text-sm text-gray-500">
                                /{plan.billing_interval}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              {selectedPlan ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{selectedPlan.name}</h3>
                      {selectedPlan.description && (
                        <p className="text-sm text-gray-600 mt-1">{selectedPlan.description}</p>
                      )}
                      {selectedPlan.type === 'subscription' && (
                        <p className="text-xs text-gray-500 mt-1">
                          Billed {selectedPlan.billing_interval}ly
                        </p>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <div className="font-semibold text-gray-900">
                        ${selectedPlan.price}
                      </div>
                      {selectedPlan.type === 'subscription' && (
                        <div className="text-sm text-gray-500">
                          /{selectedPlan.billing_interval}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <div className="text-lg font-semibold text-gray-900">Total</div>
                      <div className="text-lg font-bold text-gray-900">
                        ${selectedPlan.price}
                        {selectedPlan.type === 'subscription' && (
                          <span className="text-sm text-gray-500 font-normal">
                            /{selectedPlan.billing_interval}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleProceedToPayment}
                    disabled={isProcessing || !customerInfo.email}
                    className="w-full py-3 px-4 text-white font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: themeColor }}
                  >
                    {isProcessing ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Processing...</span>
                      </div>
                    ) : (
                      `Proceed to Payment - $${selectedPlan.price}`
                    )}
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  {loadingPlans ? (
                    <div>
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-300 mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading payment options...</p>
                    </div>
                  ) : paymentPlans.length === 0 ? (
                    <div>
                      <p className="text-gray-600 mb-4">No payment plans available</p>
                      <button
                        onClick={() => router.back()}
                        className="text-sm text-gray-500 hover:text-gray-700"
                      >
                        ← Go back
                      </button>
                    </div>
                  ) : (
                    <p className="text-gray-600">Please select a plan to continue</p>
                  )}
                </div>
              )}

              {/* Security Notice */}
              <div className="mt-6 pt-4 border-t">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <ShieldCheckIcon className="h-4 w-4 text-green-500" />
                  <span>256-bit SSL encrypted checkout</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 mt-1">
                  <CreditCardIcon className="h-4 w-4 text-blue-500" />
                  <span>Powered by Stripe</span>
                </div>
              </div>
            </div>

            {/* Features/Benefits */}
            {selectedPlan && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 mb-3">What You Get:</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircleIcon className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-blue-800">Instant access after payment</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircleIcon className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-blue-800">Email confirmation & receipt</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircleIcon className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-blue-800">24/7 customer support</span>
                  </div>
                  {selectedPlan.type === 'subscription' && (
                    <div className="flex items-center space-x-2">
                      <CheckCircleIcon className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-blue-800">Cancel anytime</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>© 2024 {site.client_name} • Secure checkout powered by Stripe</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Icons
function ArrowLeftIcon(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  )
}

function LockClosedIcon(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  )
}

function ShieldCheckIcon(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  )
}

function CreditCardIcon(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  )
}

function CheckCircleIcon(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}