import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AdminLayout from '../../../../components/admin/AdminLayout';

export default function EditTemplatePage() {
  const router = useRouter();
  const { templateId } = router.query;
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'landing',
    category: '',
    config_schema: {
      fields: [],
    },
    is_active: true,
  });

  useEffect(() => {
    if (templateId) {
      fetchTemplate();
    }
  }, [templateId]);

  async function fetchTemplate() {
    try {
      const response = await fetch(`/api/admin/templates/${templateId}`);
      if (response.ok) {
        const data = await response.json();
        setTemplate(data.template);
        setFormData(data.template);
      }
    } catch (error) {
      console.error('Error fetching template:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);

    try {
      const response = await fetch(`/api/admin/templates/${templateId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Template updated successfully!');
        router.push('/admin/templates');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update template');
      }
    } catch (error) {
      console.error('Error updating template:', error);
      alert('Failed to update template');
    } finally {
      setSaving(false);
    }
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFieldChange = (index, field, value) => {
    const updatedFields = [...formData.config_schema.fields];
    updatedFields[index] = { ...updatedFields[index], [field]: value };
    setFormData((prev) => ({
      ...prev,
      config_schema: {
        ...prev.config_schema,
        fields: updatedFields,
      },
    }));
  };

  const addField = () => {
    const newField = {
      key: '',
      type: 'text',
      label: '',
      required: false,
      description: '',
    };
    setFormData((prev) => ({
      ...prev,
      config_schema: {
        ...prev.config_schema,
        fields: [...prev.config_schema.fields, newField],
      },
    }));
  };

  const removeField = (index) => {
    const updatedFields = formData.config_schema.fields.filter(
      (_, i) => i !== index
    );
    setFormData((prev) => ({
      ...prev,
      config_schema: {
        ...prev.config_schema,
        fields: updatedFields,
      },
    }));
  };

  if (loading) {
    return (
      <AdminLayout title='Loading...'>
        <div className='flex items-center justify-center h-64'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600'></div>
        </div>
      </AdminLayout>
    );
  }

  if (!template) {
    return (
      <AdminLayout title='Template Not Found'>
        <div className='text-center py-12'>
          <h1 className='text-2xl font-bold text-gray-900 mb-4'>
            Template Not Found
          </h1>
          <Link
            href='/admin/templates'
            className='text-indigo-600 hover:text-indigo-800'
          >
            Back to Templates
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`Edit ${template.name}`}>
      <div className='max-w-6xl mx-auto space-y-6'>
        {/* Header */}
        <div className='flex justify-between items-center'>
          <div className='flex items-center space-x-4'>
            <Link
              href='/admin/templates'
              className='text-indigo-600 hover:text-indigo-800 flex items-center space-x-2'
            >
              <ArrowLeftIcon className='h-4 w-4' />
              <span>Back to Templates</span>
            </Link>
            <div>
              <h1 className='text-2xl font-bold text-gray-900'>
                Edit Template
              </h1>
              <p className='text-gray-600'>{template.name}</p>
            </div>
          </div>

          <div className='flex space-x-3'>
            <Link
              href={`/admin/templates/${templateId}/preview`}
              className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors'
            >
              Preview
            </Link>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Template Settings */}
          <div className='space-y-6'>
            <div className='bg-white rounded-lg shadow p-6'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                Template Settings
              </h3>

              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Template Name
                  </label>
                  <input
                    type='text'
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                  />
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) =>
                        handleInputChange('type', e.target.value)
                      }
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                    >
                      <option value='landing'>Landing</option>
                      <option value='parties'>Parties</option>
                      <option value='events'>Events</option>
                      <option value='bookings'>Bookings</option>
                      <option value='checkout'>Checkout</option>
                    </select>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Category
                    </label>
                    <input
                      type='text'
                      value={formData.category}
                      onChange={(e) =>
                        handleInputChange('category', e.target.value)
                      }
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                    />
                  </div>
                </div>

                <div className='flex items-center'>
                  <input
                    id='is_active'
                    type='checkbox'
                    checked={formData.is_active}
                    onChange={(e) =>
                      handleInputChange('is_active', e.target.checked)
                    }
                    className='h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'
                  />
                  <label
                    htmlFor='is_active'
                    className='ml-2 block text-sm text-gray-900'
                  >
                    Active template
                  </label>
                </div>
              </div>
            </div>

            {/* Template Fields */}
            <div className='bg-white rounded-lg shadow p-6'>
              <div className='flex justify-between items-center mb-4'>
                <h3 className='text-lg font-semibold text-gray-900'>
                  Template Fields
                </h3>
                <button
                  onClick={addField}
                  className='bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700'
                >
                  Add Field
                </button>
              </div>

              <div className='space-y-4'>
                {formData.config_schema.fields?.map((field, index) => (
                  <div
                    key={index}
                    className='border border-gray-200 rounded-lg p-4'
                  >
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                      <div>
                        <label className='block text-xs font-medium text-gray-700 mb-1'>
                          Field Key
                        </label>
                        <input
                          type='text'
                          value={field.key}
                          onChange={(e) =>
                            handleFieldChange(index, 'key', e.target.value)
                          }
                          className='w-full px-2 py-1 border border-gray-300 rounded text-sm'
                          placeholder='hero_title'
                        />
                      </div>

                      <div>
                        <label className='block text-xs font-medium text-gray-700 mb-1'>
                          Label
                        </label>
                        <input
                          type='text'
                          value={field.label}
                          onChange={(e) =>
                            handleFieldChange(index, 'label', e.target.value)
                          }
                          className='w-full px-2 py-1 border border-gray-300 rounded text-sm'
                          placeholder='Hero Title'
                        />
                      </div>

                      <div>
                        <label className='block text-xs font-medium text-gray-700 mb-1'>
                          Type
                        </label>
                        <select
                          value={field.type}
                          onChange={(e) =>
                            handleFieldChange(index, 'type', e.target.value)
                          }
                          className='w-full px-2 py-1 border border-gray-300 rounded text-sm'
                        >
                          <option value='text'>Text</option>
                          <option value='textarea'>Textarea</option>
                          <option value='url'>URL</option>
                          <option value='image'>Image Upload</option>
                          <option value='slider'>Slider (Multiple Images)</option>
                          <option value='array'>Array</option>
                          <option value='object'>Object</option>
                          <option value='boolean'>Boolean</option>
                        </select>
                      </div>
                    </div>

                    {/* Slider-specific settings */}
                    {field.type === 'slider' && (
                      <div className="mt-3 grid grid-cols-2 gap-4">
                        <div>
                          <label className='block text-xs font-medium text-gray-700 mb-1'>
                            Minimum Slides
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={field.minSlides || 1}
                            onChange={(e) => handleFieldChange(index, 'minSlides', parseInt(e.target.value))}
                            className='w-full px-2 py-1 border border-gray-300 rounded text-sm'
                          />
                        </div>
                        <div>
                          <label className='block text-xs font-medium text-gray-700 mb-1'>
                            Maximum Slides
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="20"
                            value={field.maxSlides || 10}
                            onChange={(e) => handleFieldChange(index, 'maxSlides', parseInt(e.target.value))}
                            className='w-full px-2 py-1 border border-gray-300 rounded text-sm'
                          />
                        </div>
                      </div>
                    )}

                    <div className='mt-3 flex items-center justify-between'>
                      <label className='flex items-center'>
                        <input
                          type='checkbox'
                          checked={field.required}
                          onChange={(e) =>
                            handleFieldChange(
                              index,
                              'required',
                              e.target.checked
                            )
                          }
                          className='h-3 w-3 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'
                        />
                        <span className='ml-2 text-xs text-gray-600'>
                          Required field
                        </span>
                      </label>

                      <button
                        onClick={() => removeField(index)}
                        className='text-red-600 hover:text-red-800 text-xs'
                      >
                        Remove Field
                      </button>
                    </div>
                  </div>
                ))}

                {formData.config_schema.fields?.length === 0 && (
                  <div className='text-center py-8 text-gray-500'>
                    No fields defined. Click &quot;Add Field&quot; to start.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className='flex justify-end space-x-3'>
          <Link
            href='/admin/templates'
            className='bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50'
          >
            Cancel
          </Link>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              saving
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {saving ? 'Saving...' : 'Save Template'}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}

function ArrowLeftIcon(props) {
  return (
    <svg {...props} fill='none' viewBox='0 0 24 24' stroke='currentColor'>
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M10 19l-7-7m0 0l7-7m-7 7h18'
      />
    </svg>
  );
}
