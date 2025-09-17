import { useState, useRef, useEffect } from 'react';
import ContactForm from '../ContactForm';
import Footer from '../TemplateComponents/Footer';
import FAQAccordion from '../TemplateComponents/faq';
export default function BirthdayParties({ content, site, page, sessionId }) {
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
  var { header, party_started, contact_form, faq_section } = content;
  // Default values
  const heroTitle = header?.hero_title || 'Birthday Parties';

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
      {/* Header */}
      <header
        ref={headerRef}
        className='bg-black shadow-sm sticky top-0 z-50 py-4 border-b-[0.5px] border-white'
      >
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-16'>
            <div className='flex-shrink-0'>
              <img
                src={
                  site.logo_url ||
                  'https://partners.bowlnow.com/wp-content/uploads/2025/04/logo.png'
                }
                alt='BowlNow Logo'
                className='w-[99px] h-[80px]'
              />
            </div>
            <div className=''>
              <a
                href={header?.header_cta_link || '#form'}
                className='text-white px-6 py-2 rounded-full font-semibold'
                target={
                  //if header?.header_cta_link  is there and its not starting with # then we add _blank and rest we always add _blank
                  header?.header_cta_link &&
                  !header?.header_cta_link.startsWith('#')
                    ? '_blank'
                    : '_self'
                }
                style={{
                  backgroundColor: themeColor,
                }}
              >
                {header?.header_cta_text || 'Reserve a Lane'}
              </a>
            </div>
          </div>
        </div>
      </header>
      {/* Hero Section */}
      <div className=''>
        <div className='flex   w-full'>
          <div className='bg-black text-white flex justify-center items-center w-1/2 h-[500px]'>
            <h1 className='text-4xl md:text-7xl font-bold mb-6 text-shadow-lg'>
              {heroTitle}
            </h1>
          </div>
          <div
            className='w-1/2'
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${heroBackground})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          ></div>
        </div>
      </div>
      {/* Lets Get The Party Started */}

      <section
        className='py-20'
        style={{
          //theme color is in hex format #4F46E5 so we need to convert it to rgba format to make it tint
          backgroundColor: '#E8E4D5',
        }}
      >
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center items-center '>
          <div
            className='flex justify-center items-start p-10 w-1/2 h-[600px] flex-col'
            style={{
              backgroundColor: themeColor,
            }}
          >
            <h2 className='text-2xl md:text-5xl mb-6 text-shadow-lg text-white'>
              {party_started?.title || 'Lets Get The Party Started'}
            </h2>
            <p className='text-md mb-8 text-gray-200'>
              {party_started?.desc || 'Book your next party with us'}
            </p>
            <a
              href={party_started?.cta_link || '#form'}
              className='bg-white text-black px-8 py-3 rounded-full text-center font-semibold hover:bg-gray-100 transition-colors duration-200'
            >
              {party_started?.cta_text || 'Book your next party with us'}
            </a>
          </div>
          <div className='w-1/2 h-[700px]'>
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

      {/* Booking Form Section */}
      <div id='form' className='py-20 bg-white'>
        <ContactForm
          content={contact_form}
          themeColor={themeColor}
          siteId={site.id}
          pageId={page.id}
          sessionId={sessionId}
        />
      </div>
      {/* FAQ Section */}
      <section className='pb-20 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h2 className='text-2xl md:text-5xl font-bold mb-10  text-black '>
            {faq_section?.title || "Tips for a great kid's birthday party!"}
          </h2>
        </div>
        <FAQAccordion
          questions={faq_section?.questions}
          sample_questions={sample_questions}
        />
      </section>
      {/* FAQ List */}

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
