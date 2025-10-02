import { useState, useRef, useEffect } from 'react';
import ContactForm from '../ContactForm';
import Footer from '../TemplateComponents/Footer';
import Slider1Generator from '../TemplateComponents/sliders/Slider1-Generator';
import BookYourEventLeft from '../TemplateComponents/BookYourEventLeft';
import Review from '../TemplateComponents/Review';
import FAQAccordion from '../TemplateComponents/faq';
import Header2 from '../TemplateComponents/Header2';

export default function BirthdayPartiesWithSlider({
  content,
  site,
  page,
  sessionId,
}) {
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    function updateHeaderHeight() {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    }
    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
    return () => window.removeEventListener('resize', updateHeaderHeight);
  }, []);
  var {
    header = {},
    main_cta = {},
    features_slider = {},
    contact_form,
    party_slider,
    party_started,
    book_your_event_left = {},
    book_your_event_left_2 = {},
    book_your_event_left_3 = {},
    book_your_event_left_4 = {},
    review_section = {},
    faq_section = {}
  } = content;
  // Default values
  const heroTitle = header?.hero_title || '';
  const heroSubtitle = header?.hero_subtitle || '';
  const ctaText = main_cta?.cta_text || '';
  const ctaLink = main_cta?.cta_link || '#form';

  const heroBackground =
    header?.hero_background ||
    'https://partners.bowlnow.com/wp-content/uploads/2025/04/group-of-children-blowing-party-horns-P4KM5NU-scaled-1-1024x683-1.jpg';

  const themeColor = site.settings?.theme_color || '#4F46E5';

  // Calculate hero minHeight: 100vh - headerHeight
  const heroMinHeight =
    headerHeight > 0 ? `calc(90vh - ${headerHeight}px)` : 'calc(100vh - 80px)'; // fallback
  //if faq is not filld we have to initiate some default questions

  var sample_questions = [
    {
      question: 'What is a birthday party?',
      answer: "A birthday party is a celebration of a person's birthday.",
    },
    {
      question: 'What is a birthday party?',
      answer: "A birthday party is a celebration of a person's birthday.",
    },
    {
      question: 'What is a birthday party?',
      answer: "A birthday party is a celebration of a person's birthday.",
    },
    {
      question: 'What is a birthday party?',
      answer: "A birthday party is a celebration of a person's birthday.",
    },
  ];

  return (
    <div className='min-h-screen bg-white'>
      {/* Header - Required */}
      <Header2 ref={headerRef} header={header} themeColor={themeColor} site={site} />

      {/* Hero Section with Background Image */}
      {header.enabled !== false && (
        <section
          className='relative flex items-center justify-center text-white'
          style={{
            minHeight: heroMinHeight,
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${heroBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10'>
            <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold mb-6'>
              {heroTitle}
            </h1>
            <p className='text-xl md:text-2xl mb-8 max-w-3xl mx-auto'>
              {heroSubtitle}
            </p>
            {main_cta.enabled !== false && (
              <a
                href={ctaLink}
                className='inline-block px-8 py-4 text-lg font-semibold text-white rounded-full hover:opacity-90 transition-opacity'
                style={{ backgroundColor: themeColor }}
              >
                {ctaText}
              </a>
            )}
          </div>
        </section>
      )}

      {/* Features Section */}
      {features_slider.enabled && (
        <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-15'>
          <h3 className='text-3xl md:text-5xl font-bold text-black mb-4'>
            {features_slider.slider_1_title || 'Our Features'}
          </h3>
        </section>
      )}
      {features_slider.enabled && (
        <Slider1Generator content={features_slider} themeColor={themeColor} />
      )}

      {/* Book Your Event Left - Optional */}
      {book_your_event_left.enabled && (
        <BookYourEventLeft
          content={book_your_event_left}
          themeColor={themeColor}
        />
      )}

      {/* Book Your Event Left 2 - Optional */}
      {book_your_event_left_2.enabled && (
        <BookYourEventLeft
          content={book_your_event_left_2}
          themeColor={themeColor}
        />
      )}

      {/* Book Your Event Left 3 - Optional */}
      {book_your_event_left_3.enabled && (
        <BookYourEventLeft
          content={book_your_event_left_3}
          themeColor={themeColor}
        />
      )}

      {/* Book Your Event Left 4 - Optional */}
      {book_your_event_left_4.enabled && (
        <BookYourEventLeft
          content={book_your_event_left_4}
          themeColor={themeColor}
        />
      )}
      
      {/* Parties slider */}
      {party_slider.enabled && (
        <>
        <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-15'>
          <h3 className='text-3xl md:text-5xl font-bold text-black mb-4'>
            {party_slider.slider_1_title || 'Our Parties'}
          </h3>
        </section>
        <Slider1Generator content={party_slider} themeColor={themeColor} />
        </>
      )}


      {/* Booking Form Section */}
      <div id='form' className=' bg-white'>
        <ContactForm
          content={contact_form}
          themeColor={themeColor}
          siteId={site.id}
          pageId={page.id}
          sessionId={sessionId}
        />
      </div>
      {/* Lets Get The Party Started */}

      {party_started.enabled && (
        <section
          className='py-10 md:py-20 party-started'
          style={{
            backgroundColor: '#E8E4D5',
          }}
        >
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-center items-center'>
            <div className='w-full md:w-1/2  md:rounded-xl rounded-t-xl overflow-hidden flex-shrink-0 md:hidden block'>
              <img
                src={
                  party_started?.image ||
                  'https://partners.bowlnow.com/wp-content/uploads/2025/04/Birthday-Flyer-20250224.jpg'
                }
                alt='Party Started'
                className='w-full h-full object-cover'
              />
            </div>
            <div
              className='flex justify-center md:items-start items-center p-6 md:p-10 w-full md:w-1/2 h-auto md:h-[600px] flex-col mb-6 md:mb-0 md:rounded-none rounded-b-xl'
              style={{
                backgroundColor: themeColor,
              }}
            >
              <h2 className='text-2xl  md:text-5xl mb-4 md:mb-6 text-shadow-lg text-white text-left'>
                {party_started?.title || 'Lets Get The Party Started'}
              </h2>
              <div
                dangerouslySetInnerHTML={{
                  __html: party_started?.desc || 'Book your next party with us',
                }}
                className='description-content text-sm sm:text-md mb-6 md:mb-8 text-gray-200 text-center md:text-left'
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
                href={party_started?.cta_link || '#form'}
                className='bg-white text-black px-6 md:px-8 py-3 rounded-full text-center font-semibold hover:bg-gray-100 transition-colors duration-200 w-full md:w-auto'
              >
                {party_started?.cta_text || 'Book your next party with us'}
              </a>
            </div>
            <div className='w-full md:w-1/2 h-[700px]  md:h-[700px] rounded-xl overflow-hidden flex-shrink-0 md:block hidden'>
              <img
                src={
                  party_started?.image ||
                  'https://partners.bowlnow.com/wp-content/uploads/2025/04/Birthday-Flyer-20250224.jpg'
                }
                alt='Party Started'
                className='w-full h-full object-cover'
              />
            </div>
          </div>
        </section>
      )}

      
      {/* FAQ Section - Optional */}
      {faq_section.enabled && (
        <FAQAccordion
          content={faq_section}
          themeColor={themeColor}
        />
      )}

      {/* Review Section - Optional */}
      {review_section.enabled && (
        <Review
          content={review_section}
          themeColor={themeColor}
        />
      )}

      {/* Footer */}
      <Footer content={content} site={site} themeColor={themeColor} />
    </div>
  );
}

function CheckIcon(props) {
  return (
    <svg {...props} fill='none' viewBox='0 0 24 24' stroke='currentColor'>
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M5 13l4 4L19 7'
      />
    </svg>
  );
}
