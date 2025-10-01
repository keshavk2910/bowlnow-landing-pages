import React from 'react'

export default function RegisterNowSection({ content = {}, themeColor = '#4F46E5', section = {} }) {
  // Section metadata
  const sectionTitle = section.title || 'Register Now Section'
  const sectionDescription = section.description || 'Registration section with optional form and urgency messaging'
  const {
    title = 'Register Now',
    subtitle = 'Join our community today',
    description = 'Get exclusive access to special offers and events.',
    cta_text = 'Register',
    cta_link = '#contact',
    background_color = '#f8fafc',
    show_form = false,
    form_fields = ['name', 'email'],
    urgency_text = 'Limited spots available!',
    show_urgency = false
  } = content

  return (
    <section 
      className="py-16"
      style={{ backgroundColor: background_color }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Section Header */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {sectionTitle}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {sectionDescription}
          </p>
        </div>
        {show_urgency && urgency_text && (
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-semibold animate-pulse">
              {urgency_text}
            </span>
          </div>
        )}

        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          {title}
        </h2>
        
        {subtitle && (
          <h3 className="text-xl md:text-2xl text-gray-700 mb-4">
            {subtitle}
          </h3>
        )}

        {description && (
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
        )}

        {show_form ? (
          <div className="max-w-md mx-auto">
            <form className="space-y-4">
              {form_fields.includes('name') && (
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              )}
              {form_fields.includes('email') && (
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              )}
              {form_fields.includes('phone') && (
                <input
                  type="tel"
                  placeholder="Your Phone"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              )}
              <button
                type="submit"
                className="w-full px-8 py-4 rounded-lg font-semibold text-white transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1"
                style={{ backgroundColor: themeColor }}
              >
                {cta_text}
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-4">
            <a
              href={cta_link || '#contact'}
              className="inline-block px-8 py-4 rounded-full font-semibold text-white transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1"
              style={{ backgroundColor: themeColor }}
            >
              {cta_text}
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
