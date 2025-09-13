const Footer = ({ content, site, themeColor }) => {
  return (
    <div className={` w-full py-12`} style={{ backgroundColor: themeColor }}>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-2 gap-4'>
          <div className=''>
            <img
              src={
                site.logo ||
                'https://partners.bowlnow.com/wp-content/uploads/2025/04/logo.png'
              }
              alt={site.client_name}
              className='w-[99px] h-[80px]'
            />
            <p className='text-white mb-4 mt-4'>
              {content.footer_description ||
                'Pleasant Hill Lanes is a family-owned and operated bowling center. Opened in 1962 by Robert Maclary, who envisioned bringing wholesome family entertainment to Wilmington, DE.'}
            </p>
          </div>

          <div className='text-right'>
            <div className='p-4 rounded-lg'>
              <h3 className='text-2xl font-bold text-white mb-4'>Contact</h3>
              <p className='text-white mb-4'>
                {content.contact_info || 'info@bowlphl.com'}
              </p>
              <p className='text-white mb-4'>
                {content.contact_phone || '302-998-8811'}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className='flex justify-center space-x-6 text-sm text-black mt-4'>
        <span>
          © {new Date().getFullYear()} {site.client_name}
        </span>
        <span>•</span>
        <span>All rights reserved</span>
      </div>
    </div>
  );
};

export default Footer;
