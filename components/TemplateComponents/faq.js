import { useState } from 'react';

function PlusIcon(props) {
  return (
    <svg
      {...props}
      fill='none'
      viewBox='0 0 24 24'
      stroke='currentColor'
      width={20}
      height={20}
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M12 4v16m8-8H4'
      />
    </svg>
  );
}

function MinusIcon(props) {
  return (
    <svg
      {...props}
      fill='none'
      viewBox='0 0 24 24'
      stroke='currentColor'
      width={20}
      height={20}
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M20 12H4'
      />
    </svg>
  );
}

function FAQAccordion({ content = {}, themeColor = '#4F46E5', questions, sample_questions }) {
  const [openIndex, setOpenIndex] = useState(0);

  // Extract from content object if provided, otherwise use legacy props
  const {
    title = '',
    subtitle = '',
    faqs: contentFaqs = []
  } = content;

  // Priority: contentFaqs > questions > sample_questions > empty array
  const faqs = contentFaqs.length > 0
    ? contentFaqs
    : (questions && questions.length > 0 ? questions : (sample_questions || []));

  // Don't render if no FAQs
  if (!faqs || faqs.length === 0) {
    return null;
  }

  return (
    <section className='py-8 bg-white'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Section Header */}
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* FAQ Items */}
        <div className='max-w-4xl mx-auto'>
          {faqs.map((q, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={idx}
            className='border-b border-gray-200 border-[1px] mb-4 px-4 py-2 rounded-lg shadow-md '
          >
            <button
              className='w-full flex justify-between items-center py-5 text-left focus:outline-none cursor-pointer'
              onClick={() => setOpenIndex(isOpen ? -1 : idx)}
              aria-expanded={isOpen}
            >
              <span className='text-base md:text-xl font-medium text-black cursor-pointer'>
                Q: {q?.question || 'Question'}
              </span>
              <span className='ml-4 text-red-600 flex-shrink-0 '>
                {isOpen ? <MinusIcon /> : <PlusIcon />}
              </span>
            </button>
            {isOpen && (
              <div className='pl-2 pb-5 pr-8 text-gray-700 text-md md:text-lg border-t-[1px] border-gray-200 pt-4'>
                {q?.answer || 'Answer'}
              </div>
            )}
          </div>
        );
      })}
        </div>
      </div>
    </section>
  );
}

export default FAQAccordion;
