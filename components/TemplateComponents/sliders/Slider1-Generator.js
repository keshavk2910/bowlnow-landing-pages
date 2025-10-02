import React, { useRef, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Slider1Generator = ({ content, themeColor }) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const paginationRef = useRef(null);
  const [swiperReady, setSwiperReady] = useState(false);

  // Get slides from content.slides (from SliderField) or content.slider1 (legacy)
  const actualSlides = content?.slides || content?.slider1 || [];

  // Swiper navigation fix: wait for refs to be attached
  useEffect(() => {
    setSwiperReady(true);
  }, []);

  // Fix: Only try to access swiper.params.navigation if it exists
  const handleSwiper = (swiper) => {
    setTimeout(() => {
      // Defensive: check for params and navigation/pagination existence
      if (
        swiper &&
        swiper.params &&
        swiper.navigation &&
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
        swiper &&
        swiper.params &&
        swiper.pagination &&
        swiper.params.pagination &&
        typeof swiper.params.pagination !== 'boolean'
      ) {
        swiper.params.pagination.el = paginationRef.current;
        swiper.pagination.destroy();
        swiper.pagination.init();
        swiper.pagination.update();
      }
    });
  };

  return (
    <div className='w-full relative pb-20 slider1'>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={16}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        loop={true}
        loopFillGroupWithBlank={true}
        slidesPerView={1.1}
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
          0: { slidesPerView: 1.1, slidesPerGroup: 1, spaceBetween: 12 },
          480: { slidesPerView: 1.2, slidesPerGroup: 1, spaceBetween: 16 },
          640: { slidesPerView: 1, slidesPerGroup: 1, spaceBetween: 16 },
          768: { slidesPerView: 1, slidesPerGroup: 1, spaceBetween: 20 },
          1024: { slidesPerView: 2.4, slidesPerGroup: 1, spaceBetween: 24 },
        }}
        className='slider1-swiper relative'
        onSwiper={handleSwiper}
      >
        {actualSlides.map((slide, idx) => (
          <SwiperSlide key={idx} className='rounded-2xl overflow-hidden'>
            <div
              className={`
                min-w-[220px] 
                bg-white shadow-md 
                p-4 sm:p-6 
                flex mx-auto relative
                h-[350px] xs:h-[400px] sm:h-[500px] md:h-[600px] lg:h-[650px]
              `}
              style={{
                borderRadius: '15px',
                overflow: 'hidden',
                backgroundColor: themeColor,
                backgroundImage: `url(${slide.url || slide.image})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
              }}
            >
              {/* add overlay gradient dark bottom light top */}
              <div className='overlay absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.9)] to-[rgba(0,0,0,0.1)]'></div>
              <div className='flex flex-col justify-end z-10 px-3 sm:px-5 py-6 sm:py-8'>
                {slide.title && (
                  <h4 className='text-2xl sm:text-3xl md:text-4xl text-white font-semibold mb-3 sm:mb-5'>
                    {slide.title}
                  </h4>
                )}
                {slide.description && (
                  <div
                    dangerouslySetInnerHTML={{ __html: slide.description }}
                    className='text-white text-xs sm:text-sm font-semibold w-full sm:w-2/3'
                  ></div>
                )}
                {slide.buttonText && (
                  <a
                    href={slide.buttonLink || slide.link}
                    target='_blank'
                    className='bg-transparent border-2 border-white text-white px-4 sm:px-5 py-2 text-xs sm:text-sm rounded-full w-fit mt-4 sm:mt-5'
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
        className='slider1-prev absolute left-4 sm:left-auto right-auto sm:right-24 top-auto bottom-[10px] sm:bottom-[25px] z-10 cursor-pointer p-2 bg-white/80 border-2 border-gray-300 rounded-full flex items-center justify-center transition hover:border-gray-500'
        style={{ boxShadow: 'none', display: 'none' }}
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
        className='slider1-next absolute right-4 sm:right-10 top-auto bottom-[10px] sm:bottom-[25px] z-10 cursor-pointer p-2 bg-white/80 border-2 border-gray-300 rounded-full flex items-center justify-center transition hover:border-gray-500'
        style={{ boxShadow: 'none', display: 'none' }}
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
        className='slider1-pagination flex justify-center mt-4 sm:mt-6'
      />
      <style>
        {`
          .slider1-pagination .swiper-pagination-bullet-active {
            background: #000 !important;
          }
          @media (max-width: 640px) {
            .slider1-prev, .slider1-next {
              display: none !important;
            }
          }
          @media (min-width: 641px) {
            .slider1-prev, .slider1-next {
              display: flex !important;
            }
          }
          
          /* H2 styles in slider1 */
          .slider1 h2 {
            font-size: 16px;
            margin-bottom: 0.5rem;
            font-weight: 500;
          }
            .slider1 p {
            font-size: 14px;
            margin-bottom: 0.5rem;
            font-weight: 400;
          }
          
          /* Arrow styles for list items */
          .slider1 ul {
            list-style: none;
            padding-left: 0;
          }
          
          .slider1 ul li {
            position: relative;
            padding-left: 1.5rem;
            margin-bottom: 0.5rem;
          }
          
          .slider1 ul li::before {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 0;
            height: 0;
            border-left: 8px solid ${themeColor || '#6366f1'};
            border-top: 5px solid transparent;
            border-bottom: 5px solid transparent;
          }
          
          .slider1 ul li:hover::before {
            border-left-color: ${
              themeColor
                ? `color-mix(in srgb, ${themeColor} 80%, black)`
                : '#4f46e5'
            };
          }
        `}
      </style>
    </div>
  );
};

export default Slider1Generator;