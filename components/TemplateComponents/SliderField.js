import { useState, useEffect } from 'react';
import FileUpload from '../FileUpload';

export default function SliderField({
  value = [],
  onChange,
  siteId,
  pageId,
  fieldKey,
  label = 'Slider Images',
  description = 'Upload images for the slider',
  minSlides = 1,
  maxSlides = 10,
  required = false,
}) {
  const [slides, setSlides] = useState(value);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSlides(value);
  }, [value]);

  const handleFileUploaded = (uploadedFile) => {
    const newSlide = {
      id: uploadedFile.id,
      url: uploadedFile.url,
      filename: uploadedFile.filename,
      title: '',
      description: '',
      buttonText: '',
      buttonLink: '',
      order: slides.length,
    };

    const updatedSlides = [...slides, newSlide];
    setSlides(updatedSlides);
    onChange(updatedSlides);
  };

  const updateSlide = (index, field, value) => {
    const updatedSlides = slides.map((slide, i) =>
      i === index ? { ...slide, [field]: value } : slide
    );
    setSlides(updatedSlides);
    onChange(updatedSlides);
  };

  const removeSlide = async (index) => {
    if (!confirm('Are you sure you want to remove this slide?')) return;

    const slideToRemove = slides[index];

    try {
      // Delete file from server if it has an ID
      if (slideToRemove.id) {
        await fetch(`/api/files/${slideToRemove.id}`, {
          method: 'DELETE',
        });
      }

      const updatedSlides = slides.filter((_, i) => i !== index);
      setSlides(updatedSlides);
      onChange(updatedSlides);
    } catch (error) {
      console.error('Error removing slide:', error);
      alert('Failed to remove slide');
    }
  };

  const moveSlide = (fromIndex, toIndex) => {
    const updatedSlides = [...slides];
    const [movedSlide] = updatedSlides.splice(fromIndex, 1);
    updatedSlides.splice(toIndex, 0, movedSlide);

    // Update order values
    updatedSlides.forEach((slide, index) => {
      slide.order = index;
    });

    setSlides(updatedSlides);
    onChange(updatedSlides);
  };

  return (
    <div className='space-y-4'>
      <div>
        {/* <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label> */}
        <p className='text-xs text-gray-500 mb-4'>{description}</p>
      </div>

      {/* Existing Slides */}
      {slides.length > 0 && (
        <div className='space-y-4'>
          {slides.map((slide, index) => (
            <div
              key={slide.id || index}
              className='border border-gray-200 rounded-lg p-4'
            >
              <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
                {/* Image Preview */}
                <div className='space-y-2'>
                  <div className='aspect-video bg-gray-100 rounded-lg overflow-hidden'>
                    <img
                      src={slide.url}
                      alt={slide.title || `Slide ${index + 1}`}
                      className='w-full h-full object-cover'
                    />
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-xs text-gray-500'>
                      Slide {index + 1}
                    </span>
                    <div className='flex space-x-2'>
                      {index > 0 && (
                        <button
                          onClick={() => moveSlide(index, index - 1)}
                          className='text-xs text-indigo-600 hover:text-indigo-800'
                        >
                          ↑ Up
                        </button>
                      )}
                      {index < slides.length - 1 && (
                        <button
                          onClick={() => moveSlide(index, index + 1)}
                          className='text-xs text-indigo-600 hover:text-indigo-800'
                        >
                          ↓ Down
                        </button>
                      )}
                      <button
                        onClick={() => removeSlide(index)}
                        className='text-xs text-red-600 hover:text-red-800'
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>

                {/* Slide Details */}
                <div className='lg:col-span-2 space-y-3'>
                  <div>
                    <label className='block text-xs font-medium text-gray-700 mb-1'>
                      Title
                    </label>
                    <input
                      type='text'
                      value={slide.title}
                      onChange={(e) =>
                        updateSlide(index, 'title', e.target.value)
                      }
                      className='w-full px-2 py-1 border border-gray-300 rounded text-sm'
                      placeholder='Slide title'
                    />
                  </div>

                  <div>
                    <label className='block text-xs font-medium text-gray-700 mb-1'>
                      Description
                    </label>
                    <textarea
                      rows={2}
                      value={slide.description}
                      onChange={(e) =>
                        updateSlide(index, 'description', e.target.value)
                      }
                      className='w-full px-2 py-1 border border-gray-300 rounded text-sm'
                      placeholder='Slide description'
                    />
                  </div>

                  <div className='grid grid-cols-2 gap-3'>
                    <div>
                      <label className='block text-xs font-medium text-gray-700 mb-1'>
                        Button Text
                      </label>
                      <input
                        type='text'
                        value={slide.buttonText}
                        onChange={(e) =>
                          updateSlide(index, 'buttonText', e.target.value)
                        }
                        className='w-full px-2 py-1 border border-gray-300 rounded text-sm'
                        placeholder='Learn More'
                      />
                    </div>

                    <div>
                      <label className='block text-xs font-medium text-gray-700 mb-1'>
                        Button Link
                      </label>
                      <input
                        type='url'
                        value={slide.buttonLink}
                        onChange={(e) =>
                          updateSlide(index, 'buttonLink', e.target.value)
                        }
                        className='w-full px-2 py-1 border border-gray-300 rounded text-sm'
                        placeholder='https://example.com'
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Validation Status */}
      <div
        className={`p-3 rounded-lg text-sm ${
          slides.length < minSlides
            ? 'bg-yellow-50 border border-yellow-200 text-yellow-800'
            : slides.length >= maxSlides
            ? 'bg-blue-50 border border-blue-200 text-blue-800'
            : 'bg-green-50 border border-green-200 text-green-800'
        }`}
      >
        <div className='flex justify-between items-center'>
          <span>
            {slides.length < minSlides
              ? `Need ${
                  minSlides - slides.length
                } more slides (minimum ${minSlides})`
              : slides.length >= maxSlides
              ? `Maximum slides reached (${maxSlides})`
              : `${slides.length}/${maxSlides} slides added`}
          </span>
          {required && slides.length < minSlides && (
            <span className='text-red-600 font-medium'>Required</span>
          )}
        </div>
      </div>

      {/* Add New Slide */}
      {slides.length < maxSlides && (
        <div>
          <FileUpload
            onFileUploaded={handleFileUploaded}
            siteId={siteId}
            pageId={pageId}
            fieldKey={fieldKey}
            allowedTypes={['image']}
            maxSizeMB={5}
            multiple={false}
          />
        </div>
      )}

      {slides.length === 0 && (
        <p className='text-sm text-gray-500 text-center py-4'>
          No slides added yet. Upload your first image to get started.
          {required && (
            <span className='text-red-600 block mt-1'>
              This field is required.
            </span>
          )}
        </p>
      )}
    </div>
  );
}
