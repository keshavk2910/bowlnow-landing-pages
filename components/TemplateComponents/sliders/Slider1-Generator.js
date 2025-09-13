import React, { useRef, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const DEFAULT_SLIDES = [
  {
    title: 'Open Bowling',
    description:
      'Bowling is fun for the whole family. Everyone can bowl, nobody has to sit on the side line.',
    image:
      'https://partners.bowlnow.com/wp-content/uploads/2025/04/t4200x2520-e1744691387553.webp',
    link: '#open-bowling',
    buttonText: 'Know More',
  },
  {
    title: 'Specials',
    description:
      'Bowling is fun for the whole family. Everyone can bowl, nobody has to sit on the side line.',
    image:
      'https://partners.bowlnow.com/wp-content/uploads/2025/04/t4200x2520-e1744691387553.webp',
    link: '#specials',
    buttonText: 'Know More',
  },
  {
    title: 'Company Events',
    description:
      'Perfect venue for team building and corporate celebrations. Create memorable experiences for your team.',
    image:
      'https://partners.bowlnow.com/wp-content/uploads/2025/04/t4200x2520-e1744691387553.webp',
    link: '#company-events',
    buttonText: 'Know More',
  },
  {
    title: 'Birthday Parties',
    description:
      'Celebrate your special day with friends and family. Make your birthday unforgettable with our party packages.',
    image:
      'https://partners.bowlnow.com/wp-content/uploads/2025/04/t4200x2520-e1744691387553.webp',
    link: '#birthday-parties',
    buttonText: 'Know More',
  },
];

const Slider1Generator = ({ content, themeColor }) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const paginationRef = useRef(null);
  const [swiperReady, setSwiperReady] = useState(false);

  const actualSlides = content?.slides?.length
    ? content?.slides
    : DEFAULT_SLIDES;

  // Swiper navigation fix: wait for refs to be attached
  useEffect(() => {
    setSwiperReady(true);
  }, []);

  return (
    <div className='w-full relative pb-20'>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={24}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        loop={true}
        loopFillGroupWithBlank={true}
        slidesPerView={2.2}
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
          768: { slidesPerView: 2.2, slidesPerGroup: 1 },
          1024: { slidesPerView: 2.4, slidesPerGroup: 1 },
        }}
        className='slider1-swiper relative'
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
        }}
      >
        {actualSlides.map((slide, idx) => (
          <SwiperSlide key={idx} className='rounded-2xl overflow-hidden'>
            <div
              className='min-w-[300px] bg-white shadow-md p-6 flex mx-auto relative'
              style={{
                height: '600px',
                borderRadius: '15px',
                overflow: 'hidden',
                backgroundColor: themeColor,
                backgroundImage: `url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
              }}
            >
              {/* add overlay gradient dark bottom light top */}
              <div className='overlay absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.9)] to-[rgba(0,0,0,0)]'></div>
              <div className='flex flex-col justify-end z-10 px-5 py-8'>
                {slide.title && (
                  <h4 className='text-4xl text-white font-semibold mb-5'>
                    {slide.title}
                  </h4>
                )}
                {slide.description && (
                  <p className='text-white text-sm font-semibold w-2/3'>
                    {slide.description}
                  </p>
                )}
                {slide.buttonText && (
                  <a
                    href={slide.link}
                    className='bg-transparent border-2 border-white text-white px-5 py-2 text-sm rounded-full w-fit mt-5'
                  >
                    {slide.buttonText}
                  </a>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      {/* Navigation buttons using refs */}
      <button
        ref={prevRef}
        type='button'
        className='slider1-prev absolute left-auto right-24 top-auto bottom-[25px] z-10 cursor-pointer p-2 bg-transparent border-2 border-gray-300 rounded-full flex items-center justify-center transition hover:border-gray-500'
        style={{ boxShadow: 'none' }}
        aria-label='Previous Slide'
      >
        <svg
          width='24'
          height='24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
        >
          <path d='M15 19l-7-7 7-7' />
        </svg>
      </button>
      <button
        ref={nextRef}
        type='button'
        className='slider1-next absolute right-10 top-auto bottom-[25px] z-10 cursor-pointer p-2 bg-transparent border-2 border-gray-300 rounded-full flex items-center justify-center transition hover:border-gray-500'
        style={{ boxShadow: 'none' }}
        aria-label='Next Slide'
      >
        <svg
          width='24'
          height='24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
        >
          <path d='M9 5l7 7-7 7' />
        </svg>
      </button>
      <div
        ref={paginationRef}
        className='slider1-pagination flex justify-center mt-6'
      />
      <style>
        {`
          .slider1-pagination .swiper-pagination-bullet-active {
            background: #000 !important;
          }
        `}
      </style>
    </div>
  );
};

export default Slider1Generator;
