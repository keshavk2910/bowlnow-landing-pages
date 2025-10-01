import React from 'react'

export default function BookYourEventLeft({ content = {}, themeColor = '#4F46E5', section = {} }) {
  // Section metadata
  const sectionTitle = section.title || 'Book Your Event Half Section'
  const sectionDescription = section.description || 'Two-column layout with content and image for event booking'
  const {
    title = '',
    subtitle = '',
    description = 'Pleasant Hill Lanes is your premier facility for corporate outings, team building, youth events, fundraising and much more! Our team of event planners are ready to help you organize and book your next event!',
    show_image = true,
    image_position = 'left',
    cta_text = 'Book Now',
    cta_link = '#form',
    background_image = 'https://partners.bowlnow.com/wp-content/uploads/2025/04/join-bg-e1744693267594.jpg',
    image_alt = '',
    secondary_image = '',
  } = content

  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            {subtitle}
          </p>
        </div>

        <div className='rounded-3xl overflow-hidden shadow-xl'>
          <div className='flex flex-col md:flex-row'>
            {/* Mobile Image - Always shows first on mobile */}
            {show_image && (
              <div
                className='w-full md:w-1/2 h-56 md:h-auto block md:hidden'
                style={{
                  backgroundImage: `url('${background_image}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
                role="img"
                aria-label={image_alt || title || 'Event booking image'}
              ></div>
            )}

            {/* Content */}
            <div
              className={`w-full md:w-1/2 p-8 md:p-10 md:py-20 text-white flex flex-col justify-center ${
                image_position === 'right' ? 'md:order-1' : 'md:order-2'
              }`}
              style={{
                backgroundColor: themeColor,
              }}
            >
              {/* <h3 className='text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-4'>
                {title}
              </h3>
              {subtitle && (
                <h4 className='text-lg md:text-xl text-white/90 mb-4'>
                  {subtitle}
                </h4>
              )} */}
              <div
                dangerouslySetInnerHTML={{
                  __html: description,
                }}
                className='description-content mb-6 max-w-lg'
              ></div>
              <style jsx>{`
                .description-content :global(h1) {
                  font-size: 2rem;
                  font-weight: 700;
                  color: white;
                  margin-bottom: 1rem;
                  line-height: 1.2;
                }
                .description-content :global(h2) {
                  font-size: 1.5rem;
                  font-weight: 700;
                  color: white;
                  margin-bottom: 0.75rem;
                  line-height: 1.3;
                }
                .description-content :global(h3) {
                  font-size: 1.25rem;
                  font-weight: 600;
                  color: white;
                  margin-bottom: 0.5rem;
                  line-height: 1.4;
                }
                .description-content :global(p) {
                  font-size: 1rem;
                  color: rgba(255, 255, 255, 0.95);
                  margin-bottom: 0.75rem;
                  line-height: 1.6;
                }
                .description-content :global(ul),
                .description-content :global(ol) {
                  margin-left: 1.5rem;
                  margin-bottom: 0.75rem;
                  color: rgba(255, 255, 255, 0.95);
                }
                .description-content :global(li) {
                  margin-bottom: 0.25rem;
                  line-height: 1.6;
                }
                .description-content :global(strong),
                .description-content :global(b) {
                  font-weight: 600;
                  color: white;
                }
                .description-content :global(a) {
                  color: white;
                  text-decoration: underline;
                }
              `}</style>
              <a
                href={cta_link}
                target='_blank'
                className='inline-block bg-white text-black px-8 py-3 rounded-full text-center font-semibold hover:bg-gray-100 transition-colors duration-200'
              >
                {cta_text}
              </a>
              
              {/* Secondary Image - Small overlay */}
              {secondary_image && (
                <div className='mt-6'>
                  <img
                    src={secondary_image}
                    alt={image_alt || 'Secondary event image'}
                    className='w-24 h-24 rounded-lg object-cover border-2 border-white/20'
                  />
                </div>
              )}
            </div>
            
            {/* Desktop Image - Fills the section */}
            {show_image && (
              <div
                className={`w-full md:w-1/2 h-56 md:h-auto hidden md:block ${
                  image_position === 'right' ? 'md:order-2' : 'md:order-1'
                }`}
                style={{
                  backgroundImage: `url('${background_image}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
                role="img"
                aria-label={image_alt || title || 'Event booking image'}
              ></div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
