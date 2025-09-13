const BookYourEventHalf = ({ content, themeColor }) => {
  return (
    <div className='rounded-3xl overflow-hidden'>
      <div className='flex'>
        <div
          className='w-1/2 p-10 py-20 text-white'
          style={{
            backgroundColor: themeColor,
          }}
        >
          <h3 className='text-3xl md:text-5xl font-bold text-white mb-4'>
            {content.book_event_title || 'Book Your Event'}
          </h3>
          <p className='text-sm mb-6 max-w-lg'>
            {content.book_event_desc ||
              'Pleasant Hill Lanes is your premier facility for corporate outings, team building, youth events, fundraising and much more! Our team ofevent planners are ready to help you organize and book your next event!'}
          </p>
          <a
            href={content.book_event_cta_link || '#booking'}
            className='inline-block bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-200'
          >
            {content.book_event_cta_text || 'Book Now'}
          </a>
        </div>
        <div
          className='w-1/2'
          style={{
            backgroundImage: `url('https://partners.bowlnow.com/wp-content/uploads/2025/04/join-bg-e1744693267594.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        ></div>
      </div>
    </div>
  );
};

export default BookYourEventHalf;
