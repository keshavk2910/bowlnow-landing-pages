import { useState } from 'react';

export default function ContactForm({
  siteId,
  pageId,
  sessionId,
  content,
  showEventFields = true,
  themeColor = '#4F46E5',
  className = '',
}) {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    organization: '',
    type_of_event: '',
    preferred_date: '',
    preferred_time: '',
    number_of_guests: '',
    additional_information: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required field validation
    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    // Event-specific required fields
    if (showEventFields) {
      if (!formData.type_of_event.trim()) {
        newErrors.type_of_event = 'Type of event is required';
      }

      if (!formData.preferred_date.trim()) {
        newErrors.preferred_date = 'Preferred date is required';
      }

      if (!formData.preferred_time.trim()) {
        newErrors.preferred_time = 'Preferred time is required';
      }

      if (!formData.number_of_guests.trim()) {
        newErrors.number_of_guests = 'Number of guests is required';
      } else if (
        isNaN(formData.number_of_guests) ||
        parseInt(formData.number_of_guests) < 1
      ) {
        newErrors.number_of_guests = 'Please enter a valid number of guests';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      console.log('ContactForm props received:', { siteId, pageId, sessionId });

      if (!siteId || !sessionId) {
        console.error('ContactForm missing required props:', {
          siteId,
          pageId,
          sessionId,
        });
        alert(
          'Form configuration error. Please refresh the page and try again.'
        );
        return;
      }

      // Get attribution data from cookies (site-specific)
      const { getAttributionForGHL } = await import(
        '../lib/attribution-cookies'
      );
      const ghlAttribution = getAttributionForGHL(siteId);

      const submissionData = {
        session_id: sessionId,
        site_id: siteId,
        page_id: pageId,
        form_data: {
          ...formData,
          name: formData.full_name, // Map full_name to name for backward compatibility
          estimated_value: calculateEstimatedValue(
            formData.number_of_guests,
            formData.type_of_event
          ),
        },
        form_type: showEventFields ? 'event_inquiry' : 'general_contact',
        utm_data: ghlAttribution?.lastAttributionSource || {},
        attribution_data: ghlAttribution || {},
      };

      console.log('ContactForm submitting data:', submissionData);

      const response = await fetch('/api/forms/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      const result = await response.json();

      // Fire Facebook pixel Lead event
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'Lead', {
          content_name: showEventFields ? 'Event Inquiry' : 'Contact Form',
          content_category: showEventFields ? 'event_booking' : 'general_contact',
          value: formData.estimated_value || 0,
          currency: 'USD',
          predicted_ltv: formData.estimated_value || 0
        })
        console.log('Facebook Lead event fired')
      }

      // Fire Google Analytics Lead event
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'generate_lead', {
          currency: 'USD',
          value: formData.estimated_value || 0,
          event_category: showEventFields ? 'Event Inquiry' : 'Contact',
          event_label: formData.type_of_event || 'General Contact'
        })
        console.log('Google Analytics Lead event fired')
      }

      // Show success state instead of alert
      setSubmitted(true);

      // Don't auto-reset - keep showing until page refresh
    } catch (error) {
      console.error('Form submission error:', error);
      alert('Failed to submit form. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const calculateEstimatedValue = (guests, eventType) => {
    if (!guests || !eventType) return 0;

    const baseRates = {
      'Birthday Party': 25,
      Corporate: 45,
      'Special Needs Birthday Party': 30,
      Fundraiser: 20,
      'Non-Profit/Charity': 18,
      Other: 25,
    };

    const rate = baseRates[eventType] || 25;
    return parseInt(guests) * rate;
  };

  const eventTypes = [
    { value: 'Birthday Party', label: 'Birthday Party' },
    { value: 'Corporate', label: 'Corporate' },
    {
      value: 'Special Needs Birthday Party',
      label: 'Special Needs Birthday Party',
    },
    { value: 'Fundraiser', label: 'Fundraiser' },
    { value: 'Non-Profit/Charity', label: 'Non-Profit/Charity' },
    { value: 'Other', label: 'Other' },
  ];

  const timeSlots = [
    '9:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '1:00 PM',
    '2:00 PM',
    '3:00 PM',
    '4:00 PM',
    '5:00 PM',
    '6:00 PM',
    '7:00 PM',
    '8:00 PM',
    '9:00 PM',
    '10:00 PM',
    '11:00 PM',
  ];

  // Show success state if form was submitted
  if (submitted) {
    return (
      <div
        className={`rounded-lg shadow-2xl p-8 ${className} max-w-2xl mx-auto my-20 mx-10 text-center`}
        style={{ backgroundColor: themeColor }}
      >
        <div className='text-white'>
          {/* Animated Checkbox */}
          <div className='flex justify-center mb-6'>
            <div className='w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg animate-bounce'>
              <svg
                className='w-12 h-12 text-green-500'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={3}
                  d='M5 13l4 4L19 7'
                />
              </svg>
            </div>
          </div>

          <h2 className='text-3xl font-bold mb-4'>Thank You!</h2>
          <p className='text-xl mb-6 text-white/90'>
            Your {showEventFields ? 'event inquiry' : 'message'} has been
            received successfully.
          </p>

          <div className='bg-white/20 rounded-lg p-6 mb-6'>
            <p className='text-lg font-semibold mb-2'>What happens next?</p>
            <div className='space-y-2 text-white/90'>
              <p>
                ✓ We'll review your{' '}
                {showEventFields ? 'event details' : 'request'}
              </p>
              <p>✓ Our team will contact you within 24 hours</p>
              <p>
                ✓ We'll help you plan the perfect{' '}
                {showEventFields ? 'event' : 'experience'}
              </p>
            </div>
          </div>

          <p className='text-sm text-white/80'>
            Thank you for choosing {content.business_name || 'us'} for your
            event needs!
          </p>
        </div>
      </div>
    );
  }
  var title = '';
  var subtitle = '';
  var submit_text = 'Submit';
  console.log(content.form_title);
  if (content?.title || content?.form_title) {
    title = content.title || content.form_title;
  }
  if (content?.subtitle) {
    subtitle = content.subtitle;
  }
  if (content?.submit_text) {
    submit_text = content.submit_text;
  }

  return (
    <div
      className={`bg-white rounded-lg shadow-2xl p-8 ${className} max-w-2xl mx-auto my-8 mx-10`}
    >
      <div className='text-center mb-8'>
        <h2 className='text-3xl font-bold text-gray-900 mb-4'>{title}</h2>
        <p className='text-lg text-gray-600'>{subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Contact Information */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <label
              htmlFor='full_name'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Full Name *
            </label>
            <input
              type='text'
              id='full_name'
              value={formData.full_name}
              onChange={(e) => handleChange('full_name', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.full_name
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300'
              }`}
              style={{
                focusRingColor: errors.full_name ? '#ef4444' : themeColor,
              }}
              placeholder='Your full name'
            />
            {errors.full_name && (
              <p className='text-red-500 text-sm mt-1'>{errors.full_name}</p>
            )}
          </div>

          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Email *
            </label>
            <input
              type='email'
              id='email'
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder='your@email.com'
            />
            {errors.email && (
              <p className='text-red-500 text-sm mt-1'>{errors.email}</p>
            )}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <label
              htmlFor='phone'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Phone *
            </label>
            <input
              type='tel'
              id='phone'
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder='(555) 123-4567'
            />
            {errors.phone && (
              <p className='text-red-500 text-sm mt-1'>{errors.phone}</p>
            )}
          </div>

          <div>
            <label
              htmlFor='organization'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Organization
            </label>
            <input
              type='text'
              id='organization'
              value={formData.organization}
              onChange={(e) => handleChange('organization', e.target.value)}
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
              placeholder='Company or organization name'
            />
          </div>
        </div>

        {/* Event-Specific Fields */}
        {showEventFields && (
          <>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label
                  htmlFor='type_of_event'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  Type of Event *
                </label>
                <select
                  id='type_of_event'
                  value={formData.type_of_event}
                  onChange={(e) =>
                    handleChange('type_of_event', e.target.value)
                  }
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.type_of_event ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value=''>Select event type...</option>
                  {eventTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.type_of_event && (
                  <p className='text-red-500 text-sm mt-1'>
                    {errors.type_of_event}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor='number_of_guests'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  Number of Guests *
                </label>
                <input
                  type='number'
                  id='number_of_guests'
                  min='1'
                  value={formData.number_of_guests}
                  onChange={(e) =>
                    handleChange('number_of_guests', e.target.value)
                  }
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.number_of_guests
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                  placeholder='Expected number of guests'
                />
                {errors.number_of_guests && (
                  <p className='text-red-500 text-sm mt-1'>
                    {errors.number_of_guests}
                  </p>
                )}
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label
                  htmlFor='preferred_date'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  Preferred Date *
                </label>
                <input
                  type='date'
                  id='preferred_date'
                  value={formData.preferred_date}
                  onChange={(e) =>
                    handleChange('preferred_date', e.target.value)
                  }
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.preferred_date ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.preferred_date && (
                  <p className='text-red-500 text-sm mt-1'>
                    {errors.preferred_date}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor='preferred_time'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  Preferred Time *
                </label>
                <select
                  id='preferred_time'
                  value={formData.preferred_time}
                  onChange={(e) =>
                    handleChange('preferred_time', e.target.value)
                  }
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.preferred_time ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value=''>Select preferred time...</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                {errors.preferred_time && (
                  <p className='text-red-500 text-sm mt-1'>
                    {errors.preferred_time}
                  </p>
                )}
              </div>
            </div>
          </>
        )}

        {/* Additional Information */}
        <div>
          <label
            htmlFor='additional_information'
            className='block text-sm font-medium text-gray-700 mb-2'
          >
            Additional Information
          </label>
          <textarea
            id='additional_information'
            rows={4}
            value={formData.additional_information}
            onChange={(e) =>
              handleChange('additional_information', e.target.value)
            }
            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
            placeholder={
              showEventFields
                ? 'Special requests, dietary restrictions, or additional details about your event...'
                : 'Any additional information or questions...'
            }
          />
        </div>

        {/* Estimated Value Display */}
        {/* {showEventFields &&
          formData.number_of_guests &&
          formData.type_of_event && (
            <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
              <div className='text-center'>
                <p className='text-sm text-blue-700 mb-2'>
                  Estimated Event Cost
                </p>
                <p className='text-2xl font-bold text-blue-900'>
                  $
                  {calculateEstimatedValue(
                    formData.number_of_guests,
                    formData.type_of_event
                  ).toLocaleString()}
                </p>
                <p className='text-xs text-blue-600'>
                  *Final pricing subject to customization and services selected
                </p>
              </div>
            </div>
          )} */}

        {/* Submit Button */}
        <div className='text-center'>
          <button
            type='submit'
            disabled={submitting}
            className={`w-full px-8 cursor-pointer py-4 text-lg font-semibold text-white rounded-lg transition-all duration-200 ${
              submitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'transform hover:opacity-90'
            }`}
            style={{ backgroundColor: submitting ? '#9CA3AF' : themeColor }}
          >
            {submitting ? 'Submitting...' : submit_text}
          </button>
        </div>

        {/* Form Validation Summary */}
        {Object.keys(errors).length > 0 && (
          <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
            <div className='flex items-start'>
              <div className='flex-shrink-0'>
                <ExclamationCircleIcon className='h-5 w-5 text-red-400' />
              </div>
              <div className='ml-3'>
                <h3 className='text-sm font-medium text-red-800'>
                  Please fix the following errors:
                </h3>
                <ul className='mt-2 text-sm text-red-700 list-disc list-inside'>
                  {Object.values(errors).map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

function ExclamationCircleIcon(props) {
  return (
    <svg {...props} fill='none' viewBox='0 0 24 24' stroke='currentColor'>
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.766 0L3.046 16.5c-.77.833.192 2.5 1.732 2.5z'
      />
    </svg>
  );
}
