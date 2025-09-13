import { useState } from 'react'
import Image from 'next/image'

export default function LandingPageTemplate({ content, site, funnel, page, sessionId, onFormSubmit, onCheckoutClick, loading }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormSubmitting(true)

    try {
      await onFormSubmit({
        ...formData,
        form_type: 'contact_form',
        funnel_name: funnel?.name
      })
      setFormSubmitted(true)
      setFormData({ name: '', email: '', phone: '', message: '' })
    } catch (error) {
      console.error('Form submission error:', error)
      alert('Failed to submit form. Please try again.')
    } finally {
      setFormSubmitting(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Default values
  const heroTitle = content.hero_title || 'Welcome to Our Business'
  const heroSubtitle = content.hero_subtitle || 'Experience excellence with our premium services'
  const ctaText = content.cta_text || 'Get Started'
  const ctaLink = content.cta_link || '#contact'
  const heroBackground = content.hero_background || '/api/placeholder/1920/1080'

  const themeColor = site.settings?.theme_color || '#4F46E5'

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div 
        className="relative h-screen flex items-center justify-center text-center text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {heroTitle}
          </h1>
          {heroSubtitle && (
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              {heroSubtitle}
            </p>
          )}
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <a
              href={ctaLink}
              className="inline-block px-8 py-4 text-lg font-semibold rounded-lg transition-colors duration-200"
              style={{ 
                backgroundColor: themeColor,
                color: 'white'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#3730A3'}
              onMouseLeave={(e) => e.target.style.backgroundColor = themeColor}
            >
              {ctaText}
            </a>
            <a
              href="#learn-more"
              className="inline-block px-8 py-4 text-lg font-semibold border-2 border-white rounded-lg hover:bg-white hover:text-gray-900 transition-colors duration-200"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="animate-bounce">
            <ChevronDownIcon className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="learn-more" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose {site.client_name}?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {content.features_subtitle || 'We provide exceptional service and unmatched quality'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(content.features || [
              { title: 'Premium Quality', description: 'Top-tier service you can trust', icon: '⭐' },
              { title: 'Expert Team', description: 'Professional staff with years of experience', icon: '👥' },
              { title: 'Great Value', description: 'Competitive prices for excellent service', icon: '💎' }
            ]).map((feature, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Form Section */}
      <div id="contact" className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Get In Touch
            </h2>
            <p className="text-lg text-gray-600">
              Ready to get started? Contact us today for a free consultation.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-8">
            {formSubmitted ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
                <p className="text-gray-600">
                  We've received your message and will get back to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50"
                      style={{ focusRingColor: themeColor }}
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50"
                      style={{ focusRingColor: themeColor }}
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    style={{ focusRingColor: themeColor }}
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    style={{ focusRingColor: themeColor }}
                    placeholder="Tell us about your needs..."
                  />
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="px-8 py-3 text-lg font-semibold text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: themeColor }}
                    onMouseEnter={(e) => !formSubmitting && (e.target.style.backgroundColor = '#3730A3')}
                    onMouseLeave={(e) => !formSubmitting && (e.target.style.backgroundColor = themeColor)}
                  >
                    {formSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">{site.client_name}</h3>
            <p className="text-gray-400 mb-4">
              {content.footer_description || 'Thank you for choosing us for your needs.'}
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-400">
              <span>© 2024 {site.client_name}</span>
              <span>•</span>
              <span>All rights reserved</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function ChevronDownIcon(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
  )
}