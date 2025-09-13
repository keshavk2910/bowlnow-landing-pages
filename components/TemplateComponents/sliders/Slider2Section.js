import React, { useRef, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Add animation styles
const fadeInStyles = `
  .slider2-fadein-content {
    opacity: 0;
    transform: translateY(-32px);
    pointer-events: none;
    transition: opacity 0.5s cubic-bezier(.4,0,.2,1), transform 0.5s cubic-bezier(.4,0,.2,1);
    will-change: opacity, transform;
  }
  .slider2-fadein-content.active {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
    transition-delay: 0.15s;
  }
`;

if (
  typeof window !== 'undefined' &&
  !document.getElementById('slider2-fadein-style')
) {
  const style = document.createElement('style');
  style.id = 'slider2-fadein-style';
  style.innerHTML = fadeInStyles;
  document.head.appendChild(style);
}

const DEFAULT_SLIDES = [
  {
    title: 'Birthday Parties',
    description:
      'Celebrate your special day with friends and family. Make your birthday unforgettable with our party packages.',
    image:
      'https://partners.bowlnow.com/wp-content/uploads/2025/04/t4200x2520-e1744691387553.webp',
    link: '#birthday-parties',
    buttonText: 'Learn More',
  },
  {
    title: 'Corporate Events',
    description:
      'Perfect venue for team building and corporate celebrations. Create memorable experiences for your team.',
    image:
      'https://partners.bowlnow.com/wp-content/uploads/2025/04/t4200x2520-e1744691387553.webp',
    link: '#company-events',
    buttonText: 'Learn More',
  },
  {
    title: 'Youth Parties',
    description:
      'Fun and safe environment for kids and teens to celebrate and enjoy.',
    image:
      'https://partners.bowlnow.com/wp-content/uploads/2025/04/t4200x2520-e1744691387553.webp',
    link: '#youth-parties',
    buttonText: 'Learn More',
  },
  {
    title: 'Fundraisers',
    description:
      'Host your next fundraiser with us and make a difference in your community.',
    image:
      'https://partners.bowlnow.com/wp-content/uploads/2025/04/t4200x2520-e1744691387553.webp',
    link: '#fundraisers',
    buttonText: 'Learn More',
  },
  {
    title: 'Fundraisers',
    description:
      'Host your next fundraiser with us and make a difference in your community.',
    image:
      'https://partners.bowlnow.com/wp-content/uploads/2025/04/t4200x2520-e1744691387553.webp',
    link: '#fundraisers',
    buttonText: 'Learn More',
  },
  {
    title: 'Fundraisers',
    description:
      'Host your next fundraiser with us and make a difference in your community.',
    image:
      'https://partners.bowlnow.com/wp-content/uploads/2025/04/t4200x2520-e1744691387553.webp',
    link: '#fundraisers',
    buttonText: 'Learn More',
  },
];

const Slider2Section = ({ content, themeColor }) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const paginationRef = useRef(null);
  const [swiperReady, setSwiperReady] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const actualSlides = content?.slider2_slides?.length
    ? content.slider2_slides
    : DEFAULT_SLIDES;

  useEffect(() => {
    setSwiperReady(true);
  }, []);

  return (
    <section className='w-full mx-auto px-4 sm:px-6 lg:px-8 py-15 bg-black h-screen'>
      <h3 className='text-3xl md:text-5xl font-bold text-white mb-4 text-center mb-15'>
        {content.slider2_title || 'Parties & Events'}
      </h3>
      <div className='w-full relative pb-20'>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          loop={true}
          slideToClickedSlide={true}
          loopFillGroupWithBlank={true}
          centeredSlides={true}
          roundLengths={true}
          centeredSlidesBounds={true}
          slidesPerView={1.75}
          slidesPerGroup={1}
          navigation={
            swiperReady
              ? {
                  prevEl: prevRef.current,
                  nextEl: nextRef.current,
                }
              : false
          }
          pagination={
            swiperReady
              ? {
                  el: paginationRef.current,
                  clickable: true,
                }
              : false
          }
          breakpoints={{
            640: { slidesPerView: 1, slidesPerGroup: 1 },
            768: { slidesPerView: 1.5, slidesPerGroup: 1 },
            1024: { slidesPerView: 1.75, slidesPerGroup: 1 },
          }}
          className='slider2-swiper relative'
          style={{
            perspective: '1000px',
          }}
          onSwiper={(swiper) => {
            setTimeout(() => {
              if (
                swiper.params.navigation &&
                typeof swiper.params.navigation !== 'boolean'
              ) {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
                swiper.navigation.destroy();
                swiper.navigation.init();
                swiper.navigation.update();
              }
              if (
                swiper.params.pagination &&
                typeof swiper.params.pagination !== 'boolean'
              ) {
                swiper.params.pagination.el = paginationRef.current;
                swiper.pagination.destroy();
                swiper.pagination.init();
                swiper.pagination.update();
              }
            });
            // Set initial active index
            setActiveIndex(swiper.realIndex);
            swiper.on('slideChange', () => {
              setActiveIndex(swiper.realIndex);
            });
          }}
        >
          {actualSlides.map((slide, idx) => (
            <SwiperSlide key={idx} className='rounded-2xl overflow-visible'>
              <div
                className={`min-w-[500px] bg-white shadow-md p-6 flex mx-auto relative slide-content `}
                style={{
                  height: activeIndex === idx ? '600px' : '460px',
                  //if not active add blur
                  filter: activeIndex === idx ? 'none' : 'blur(3px)',
                  borderRadius: '15px',
                  overflow: 'hidden',
                  backgroundColor: themeColor,
                  backgroundImage: `url(${slide.image})`,
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  perspective: '1000px',
                }}
              >
                {/* add overlay gradient dark bottom light top */}
              </div>
              {/*slide content */}
              <div
                className={`slider2-fadein-content flex flex-col justify-end z-10 px-5 py-4 text-center${
                  activeIndex === idx ? ' active' : ''
                }`}
                aria-hidden={activeIndex !== idx}
              >
                {slide.title && (
                  <h4 className='text-4xl text-white font-semibold mb-2'>
                    {slide.title}
                  </h4>
                )}
                {slide.description && (
                  <p className='text-white text-sm font-semibold '>
                    {slide.description}
                  </p>
                )}
                {slide.buttonText && (
                  <a
                    href={slide.link}
                    className='bg-transparent border-2 border-white text-white px-5 py-2 text-sm rounded-full w-fit mt-2 mx-auto'
                  >
                    {slide.buttonText}
                  </a>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        {/* Navigation buttons using refs */}
        <button
          ref={prevRef}
          type='button'
          className='slider2-prev absolute left-auto right-24 top-auto bottom-[50px] z-10 cursor-pointer p-2 bg-transparent border-2 border-gray-300 rounded-full flex items-center justify-center transition hover:border-gray-500'
          style={{ boxShadow: 'none' }}
          aria-label='Previous Slide'
        >
          <svg
            width='24'
            height='24'
            fill='none'
            stroke='white'
            strokeWidth='2'
            viewBox='0 0 24 24'
          >
            <path d='M15 19l-7-7 7-7' />
          </svg>
        </button>
        <button
          ref={nextRef}
          type='button'
          className='slider2-next absolute left-auto right-10 top-auto bottom-[50px] z-10 cursor-pointer p-2 bg-transparent border-2 border-gray-300 rounded-full flex items-center justify-center transition hover:border-gray-500'
          style={{ boxShadow: 'none' }}
          aria-label='Next Slide'
        >
          <svg
            width='24'
            height='24'
            fill='none'
            stroke='white'
            strokeWidth='2'
            viewBox='0 0 24 24'
          >
            <path d='M9 5l7 7-7 7' />
          </svg>
        </button>
        {/* Pagination */}
        <div
          ref={paginationRef}
          className='slider2-pagination absolute left-1/2 -translate-x-1/2 bottom-2 z-10 flex gap-2'
        />
      </div>
    </section>
  );
};

export default Slider2Section;
