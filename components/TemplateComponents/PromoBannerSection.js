import React from 'react'

export default function PromoBannerSection({ content = {}, themeColor = '#4F46E5', section = {} }) {
  // Section metadata
  const sectionTitle = section.title || ''
  const sectionDescription = section.description || ''
  const {
    title = '',
    subtitle = '',
    cta_text = '',
    cta_link = '',
    background_image = '/api/placeholder/1600/600',
    overlay_opacity = 0.5,
    text_alignment = 'center',
  } = content

  const alignmentClass = text_alignment === 'left' ? 'items-start text-left' : text_alignment === 'right' ? 'items-end text-right' : 'items-center text-center'

  return (
    <section className="relative w-full">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {sectionTitle}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {sectionDescription}
          </p>
        </div>
      </div>

      <div
        className="relative rounded-xl overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,${overlay_opacity}), rgba(0,0,0,${overlay_opacity})), url(${background_image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 flex flex-col ${alignmentClass} gap-4`}>
          {title && <h2 className="text-white text-3xl sm:text-4xl font-bold">{title}</h2>}
          {subtitle && <p className="text-white/90 text-lg sm:text-xl max-w-3xl">{subtitle}</p>}
          {cta_text && (
            <div className="pt-2">
              <a
                href={cta_link || '#'}
                className="inline-block px-6 py-3 rounded-full font-semibold text-white transition-colors"
                style={{ backgroundColor: themeColor }}
              >
                {cta_text}
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}


