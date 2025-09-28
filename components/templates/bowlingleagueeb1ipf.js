import { useState, useRef, useEffect } from 'react';
import ContactForm from '../ContactForm';
import Footer from '../TemplateComponents/Footer';
import Slider1Generator from '../TemplateComponents/sliders/Slider1-Generator';

export default function bowlingleagueeb1ipf({
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
  var { header, contact_form, party_slider, party_started } = content;
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
                className='w-[99px] h-[80px] object-contain'
              />
            </div>
            <div>
              <a
                href={header?.header_cta_link || '#form'}
                className='text-white px-6 py-2 rounded-full font-semibold'
                target={
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
      <section className=''>
        <div className='flex flex-col md:flex-row w-full'>
          <div className='bg-black text-white flex justify-center items-center w-full md:w-1/2 h-[300px] md:h-[500px] md:flex hidden'>
            <h1 className='text-3xl sm:text-4xl md:text-7xl font-bold mb-6 text-shadow-lg text-center px-2'>
              {heroTitle}
            </h1>
          </div>
          <div className='w-full md:w-1/2 h-[200px] md:h-[500px] relative'>
            <div
              className='w-full h-full'
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${heroBackground})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <h1 className='text-4xl sm:text-4xl md:text-5xl font-bold mb-6 text-shadow-lg text-white text-center px-2 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 md:hidden block'>
                {heroTitle}
              </h1>
            </div>
          </div>
        </div>
      </section>
      {/* Parties slider */}
      <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-15'>
        <h3 className='text-3xl md:text-5xl font-bold text-black mb-4'>
          {party_slider.slider_1_title || 'Our Parties'}
        </h3>
      </section>

      {party_slider.enabled && (
        <Slider1Generator content={party_slider} themeColor={themeColor} />
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
                className='text-sm sm:text-md mb-6 md:mb-8 text-gray-200 text-center md:text-left'
              ></div>
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

          <style
            dangerouslySetInnerHTML={{
              __html: `
              .party-started ul {
              margin-top: 1rem;
            list-style: disc;
            padding-left: 0;
          }
        
              .party-started ul li {
            margin-bottom: 0.5rem;
            font-size: 1rem;
          }
          `,
            }}
          />
        </section>
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
