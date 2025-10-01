const BookYourEventHalf1 = ({ content, themeColor }) => {
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
          className='w-full md:w-1/2 h-56 md:h-auto hidden md:block'
          style={{
            //either content?.book_event_image or https://partners.bowlnow.com/wp-content/uploads/2025/04/join-bg-e1744693267594.jpg
            backgroundImage: `url('${
              content?.book_event_image_1 ||
              'https://partners.bowlnow.com/wp-content/uploads/2025/04/join-bg-e1744693267594.jpg'
            }')`,
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
            {content?.book_event_title_1 || 'Book Your Event'}
          </h3>
          <div
            dangerouslySetInnerHTML={{
              __html:
                content?.book_event_desc_1 ||
                'Pleasant Hill Lanes is your premier facility for corporate outings, team building, youth events, fundraising and much more! Our team ofevent planners are ready to help you organize and book your next event!',
            }}
            className='description-content mb-6 max-w-lg'
          ></div>
          <style jsx>{`
            .description-content :global(h1) {
              font-size: 2rem;
              font-weight: 700;
              color: white;
              margin-bottom: 1rem;
              line-height: 1.2;
            }
            .description-content :global(h2) {
              font-size: 1.5rem;
              font-weight: 700;
              color: white;
              margin-bottom: 0.75rem;
              line-height: 1.3;
            }
            .description-content :global(h3) {
              font-size: 1.25rem;
              font-weight: 600;
              color: white;
              margin-bottom: 0.5rem;
              line-height: 1.4;
            }
            .description-content :global(p) {
              font-size: 1rem;
              color: rgba(255, 255, 255, 0.95);
              margin-bottom: 0.75rem;
              line-height: 1.6;
            }
            .description-content :global(ul),
            .description-content :global(ol) {
              margin-left: 1.5rem;
              margin-bottom: 0.75rem;
              color: rgba(255, 255, 255, 0.95);
            }
            .description-content :global(li) {
              margin-bottom: 0.25rem;
              line-height: 1.6;
            }
            .description-content :global(strong),
            .description-content :global(b) {
              font-weight: 600;
              color: white;
            }
            .description-content :global(a) {
              color: white;
              text-decoration: underline;
            }
          `}</style>
          <a
            href={content?.book_event_cta_link_1 || '#form'}
            target='_blank'
            className='inline-block bg-white text-black px-8 py-3 rounded-full text-center font-semibold hover:bg-gray-100 transition-colors duration-200'
          >
            {content?.book_event_cta_text_1 || 'Book Now'}
          </a>
        </div>

      </div>
    </div>
  );
};

export default BookYourEventHalf1;
