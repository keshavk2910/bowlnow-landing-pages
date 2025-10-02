import React from 'react'

export default function CardGrid({ content = {}, themeColor = '#4F46E5', section = {} }) {
  // Section metadata
  const sectionTitle = section.title || ''
  const sectionDescription = section.description || ''
  const {
    title = '',
    subtitle = '',
    cards = [],
    columns = 3,
    rows = null, // null means auto-calculate based on cards length
    card_style = 'default',
    max_cards_per_row = 4,
    min_cards_per_row = 1
  } = content

  // Support both old array format and new object format
  const actualCards = cards?.table_data || (Array.isArray(cards) ? cards : [])

  // Filter to show only enabled cards (cards where enabled !== false)
  const enabledCards = actualCards.filter(card => card.enabled !== false)

  // Calculate actual columns based on user input and constraints
  const actualColumns = Math.min(Math.max(parseInt(columns) || 3, min_cards_per_row), max_cards_per_row)

  // If rows is specified, limit the number of cards displayed
  const maxCards = rows ? actualColumns * parseInt(rows) : enabledCards.length
  const displayCards = enabledCards.slice(0, maxCards)

  // Dynamic grid classes based on actual columns
  const getGridCols = (cols) => {
    switch (cols) {
      case 1:
        return 'grid-cols-1'
      case 2:
        return 'grid-cols-1 md:grid-cols-2'
      case 3:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      case 4:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
      case 5:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
      case 6:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'
      default:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
    }
  }

  const gridCols = getGridCols(actualColumns)

  return (
    <>
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {sectionTitle}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            {sectionDescription}
          </p>
        </div>

        {/* Content Header */}
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && (
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {displayCards.length === 0 && (
          <div className="text-center text-gray-500">
            No cards configured yet.
          </div>
        )}

        <div className={`grid ${gridCols} gap-8`}>
          {displayCards.map((card, index) => (
            <div
              key={index}
              className={`bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col ${
                card_style === 'bordered' ? 'border-2 border-gray-200' : ''
              }`}
            >
              <div className="p-8 flex flex-col flex-1">
                {card.image ? (
                  <div className="mb-4 w-full h-48 overflow-hidden rounded">
                    <img
                      src={card.image}
                      alt={card.title || 'card'}
                      className="w-full h-full object-fill"
                    />
                  </div>
                ) : card.icon ? (
                  <div className="text-4xl mb-4 text-center h-12 flex items-center justify-center">{card.icon}</div>
                ) : null}
                <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                  {card.title}
                </h3>
                <div
                  className="text-gray-600 mb-6 leading-relaxed rich-text-display flex-1 overflow-hidden"
                  style={{ minHeight: '120px' }}
                  dangerouslySetInnerHTML={{ __html: card.description }}
                />
                {card.cta_text && (
                  <div className="text-center mt-auto">
                    <a
                      href={card.cta_link || '#contact'}
                      className="inline-block px-6 py-3 rounded-full font-semibold text-white transition-all duration-200 hover:shadow-lg"
                      style={{ backgroundColor: themeColor }}
                    >
                      {card.cta_text}
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        </div>
      </section>

      {/* Rich Text Display Styling */}
      <style jsx>{`
        .rich-text-display :global(h1) {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 10px;
          margin-top: 12px;
          color: #1f2937;
        }
        .rich-text-display :global(h2) {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 8px;
          margin-top: 10px;
          color: #1f2937;
        }
        .rich-text-display :global(h3) {
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 6px;
          margin-top: 8px;
          color: #1f2937;
        }
        .rich-text-display :global(p) {
          margin-bottom: 8px;
          line-height: 1.6;
          color: #4b5563;
        }
        .rich-text-display :global(ul) {
          margin: 8px 0;
          padding-left: 24px;
          list-style-type: disc;
          text-align: left;
          color: #4b5563;
        }
        .rich-text-display :global(ol) {
          margin: 8px 0;
          padding-left: 24px;
          list-style-type: decimal;
          text-align: left;
          color: #4b5563;
        }
        .rich-text-display :global(ul ul) {
          list-style-type: circle;
          margin: 4px 0;
        }
        .rich-text-display :global(ol ol) {
          list-style-type: lower-alpha;
          margin: 4px 0;
        }
        .rich-text-display :global(li) {
          margin-bottom: 4px;
          line-height: 1.5;
          display: list-item;
        }
        .rich-text-display :global(li p) {
          margin: 0;
          display: inline;
        }
        .rich-text-display :global(a) {
          color: #3B82F6;
          text-decoration: underline;
        }
        .rich-text-display :global(strong) {
          font-weight: 600;
          color: #1f2937;
        }
        .rich-text-display :global(em) {
          font-style: italic;
        }
      `}</style>
    </>
  )
}
