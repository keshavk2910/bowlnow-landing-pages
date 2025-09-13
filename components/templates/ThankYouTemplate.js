import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function ThankYouTemplate({ content, site, funnel, page, sessionId }) {
  const router = useRouter()
  const [orderDetails, setOrderDetails] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get checkout session ID from URL
    const sessionId = router.query.session_id
    if (sessionId) {
      fetchOrderDetails(sessionId)
    } else {
      setLoading(false)
    }
  }, [router.query])

  async function fetchOrderDetails(checkoutSessionId) {
    try {
      const response = await fetch(`/api/orders/by-session/${checkoutSessionId}`)
      if (response.ok) {
        const data = await response.json()
        setOrderDetails(data.order)
      }
    } catch (error) {
      console.error('Error fetching order details:', error)
    } finally {
      setLoading(false)
    }
  }

  const themeColor = site.settings?.theme_color || '#4F46E5'
  const title = content.title || 'Thank You!'
  const heroTitle = content.hero_title || 'Order Confirmed!'

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {heroTitle}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Thank you for your business! We've received your order and will be in touch shortly.
          </p>
        </div>

        {/* Order Details */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        ) : orderDetails ? (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-mono text-gray-900">#{orderDetails.id.slice(-8)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="text-gray-900">{new Date(orderDetails.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="text-green-600 font-semibold">{orderDetails.status}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 mt-3">
                    <span className="text-gray-600 font-semibold">Total:</span>
                    <span className="text-xl font-bold text-gray-900">${orderDetails.amount}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Customer Information</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">Name:</span>
                    <div className="text-gray-900">{orderDetails.customers?.name || 'N/A'}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <div className="text-gray-900">{orderDetails.customers?.email}</div>
                  </div>
                  {orderDetails.customers?.phone && (
                    <div>
                      <span className="text-gray-600">Phone:</span>
                      <div className="text-gray-900">{orderDetails.customers.phone}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome!</h2>
              <p className="text-gray-600">
                Thank you for your interest in {site.client_name}. We appreciate your business!
              </p>
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What Happens Next?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirmation Email</h3>
              <p className="text-gray-600 text-sm">
                You'll receive a confirmation email with all the details within the next few minutes.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Personal Contact</h3>
              <p className="text-gray-600 text-sm">
                Our team will reach out to you within 24 hours to discuss next steps.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Get Started</h3>
              <p className="text-gray-600 text-sm">
                We'll help you get set up and start enjoying your experience right away.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help?</h2>
          <p className="text-gray-600 mb-6">
            Our customer service team is here to help with any questions or concerns.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="flex items-center justify-center space-x-2">
              <PhoneIcon className="h-5 w-5 text-gray-500" />
              <span className="text-gray-700">(555) 123-4567</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <MailIcon className="h-5 w-5 text-gray-500" />
              <span className="text-gray-700">support@{site.slug}.com</span>
            </div>
          </div>
        </div>

        {/* Return to Site */}
        <div className="text-center mt-8">
          <a
            href={`${process.env.NEXT_PUBLIC_FRONTEND_DOMAIN || 'https://partners.bowlnow.com'}/${site.slug}`}
            className="inline-block px-8 py-3 text-lg font-semibold text-white rounded-lg transition-colors duration-200"
            style={{ backgroundColor: themeColor }}
          >
            Return to {site.client_name}
          </a>
        </div>
      </div>
    </div>
  )
}

function PhoneIcon(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  )
}

function MailIcon(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  )
}