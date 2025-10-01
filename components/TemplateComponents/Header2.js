import React, { forwardRef } from 'react'

const Header2 = forwardRef(function Header2({ header = {}, themeColor = '#4F46E5', site = {} }, ref) {
  return (
    <header
      ref={ref}
      className='bg-black shadow-sm sticky top-0 z-50 py-4 border-b-[0.5px] border-white'
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          <div className='flex-shrink-0'>
            <img
              src={
                site?.logo_url ||
                'https://partners.bowlnow.com/wp-content/uploads/2025/04/logo.png'
              }
              alt='BowlNow Logo'
              className='w-[99px] h-[80px]'
            />
          </div>
          <div className=''>
            <a
              href={header.header_cta_link || '#form'}
              className='text-white px-6 py-2 rounded-full font-semibold'
              target='_blank'
              style={{
                backgroundColor: themeColor,
              }}
            >
              {header.header_cta_text || 'Book an Event'}
            </a>
          </div>
        </div>
      </div>
    </header>
  )
})

export default Header2
