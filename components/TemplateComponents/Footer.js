const Footer = ({ content, site, themeColor }) => {
  return (
    <div className={` w-full py-12`} style={{ backgroundColor: themeColor }}>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-2 gap-4'>
          <div className=''>
            <img
              src={site.logo_url}
              alt={site.client_name}
              className='w-[99px] h-[80px]'
            />
            <p className='text-white mb-4 mt-4'>{site.footer_description} </p>
          </div>

          <div className='text-right'>
            <div className='p-4 rounded-lg'>
              <h3 className='text-2xl font-bold text-white mb-4'>Contact</h3>
              <p className='text-white mb-4'>{site.contact_info} </p>
              <p className='text-white mb-4'>{site.contact_phone} </p>
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
