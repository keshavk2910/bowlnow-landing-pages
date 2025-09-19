const BookYourEventHalf = ({ content, themeColor }) => {
  return (
    <div className='rounded-3xl overflow-hidden'>
      <div className='flex flex-col md:flex-row'>
        <div
          className='w-full md:w-1/2 h-56 md:h-auto block md:hidden'
          style={{
            backgroundImage: `url('https://partners.bowlnow.com/wp-content/uploads/2025/04/join-bg-e1744693267594.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        ></div>
        <div
          className='w-full md:w-1/2 p-8 md:p-10 md:py-20 text-white flex flex-col justify-center'
          style={{
            backgroundColor: themeColor,
          }}
        >
          <h3 className='text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-4'>
            {content?.book_event_title || 'Book Your Event'}
          </h3>
          <div
            dangerouslySetInnerHTML={{
              __html:
                content?.book_event_desc ||
                'Pleasant Hill Lanes is your premier facility for corporate outings, team building, youth events, fundraising and much more! Our team ofevent planners are ready to help you organize and book your next event!',
            }}
            className='text-sm mb-6 max-w-lg'
          ></div>
          <a
            href={content?.book_event_cta_link || '#form'}
            target='_blank'
            className='inline-block bg-white text-black px-8 py-3 rounded-full text-center font-semibold hover:bg-gray-100 transition-colors duration-200'
          >
            {content?.book_event_cta_text || 'Book Now'}
          </a>
        </div>
        <div
          className='w-full md:w-1/2 h-56 md:h-auto hidden md:block'
          style={{
            //either content?.book_event_image or https://partners.bowlnow.com/wp-content/uploads/2025/04/join-bg-e1744693267594.jpg
            backgroundImage: `url('${
              content?.book_event_image ||
              'https://partners.bowlnow.com/wp-content/uploads/2025/04/join-bg-e1744693267594.jpg'
            }')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        ></div>
      </div>
    </div>
  );
};

export default BookYourEventHalf;
