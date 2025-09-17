import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AdminLayout from '../../../../components/admin/AdminLayout';

export default function EditTemplateSections() {
  const router = useRouter();
  const { templateId } = router.query;
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [availableComponents, setAvailableComponents] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    type: 'landing',
    category: '',
    component_file: '',
    component_path: '',
    config_schema: {
      sections: [],
    },
    is_active: true,
  });

  useEffect(() => {
    if (templateId) {
      fetchTemplateAndComponents();
    }
  }, [templateId]);

  async function fetchTemplateAndComponents() {
    try {
      const [templateRes, componentsRes] = await Promise.all([
        fetch(`/api/admin/templates/${templateId}`),
        fetch('/api/admin/templates/components')
      ]);

      if (templateRes.ok) {
        const data = await templateRes.json();
        setTemplate(data.template);

        // Initialize formData with sections structure and component info
        const templateData = data.template;
        setFormData({
          ...templateData,
          component_file: templateData.component_file || '',
          component_path: templateData.component_path || '',
          config_schema: {
            sections: templateData.config_schema?.sections || [],
          },
        });
      }

      if (componentsRes.ok) {
        const componentsData = await componentsRes.json();
        setAvailableComponents(componentsData.components);
      }
    } catch (error) {
      console.error('Error fetching template data:', error);
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

  const handleComponentSelect = (componentFile) => {
    const component = availableComponents.find(c => c.file === componentFile);
    if (component) {
      setFormData(prev => ({
        ...prev,
        component_file: component.file,
        component_path: component.path
      }));
    }
  };

  // Section Management
  const addSection = () => {
    const newSection = {
      key: '',
      name: '',
      description: '',
      required: false,
      order: formData.config_schema.sections.length,
      fields: [],
    };

    setFormData((prev) => ({
      ...prev,
      config_schema: {
        ...prev.config_schema,
        sections: [...prev.config_schema.sections, newSection],
      },
    }));
  };

  const updateSection = (sectionIndex, field, value) => {
    setFormData((prev) => ({
      ...prev,
      config_schema: {
        ...prev.config_schema,
        sections: prev.config_schema.sections.map((section, index) =>
          index === sectionIndex ? { ...section, [field]: value } : section
        ),
      },
    }));
  };

  const removeSection = (sectionIndex) => {
    if (
      !confirm(
        'Are you sure you want to remove this section and all its fields?'
      )
    )
      return;

    setFormData((prev) => ({
      ...prev,
      config_schema: {
        ...prev.config_schema,
        sections: prev.config_schema.sections.filter(
          (_, index) => index !== sectionIndex
        ),
      },
    }));
  };

  const moveSection = (fromIndex, toIndex) => {
    setFormData((prev) => {
      const sections = [...prev.config_schema.sections];
      const [movedSection] = sections.splice(fromIndex, 1);
      sections.splice(toIndex, 0, movedSection);

      // Update order values
      sections.forEach((section, index) => {
        section.order = index;
      });

      return {
        ...prev,
        config_schema: {
          ...prev.config_schema,
          sections,
        },
      };
    });
  };

  // Field Management within Sections
  const addFieldToSection = (sectionIndex) => {
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
        sections: prev.config_schema.sections.map((section, index) =>
          index === sectionIndex
            ? {
                ...section,
                fields: [...section.fields, newField],
              }
            : section
        ),
      },
    }));
  };

  const updateField = (sectionIndex, fieldIndex, field, value) => {
    setFormData((prev) => ({
      ...prev,
      config_schema: {
        ...prev.config_schema,
        sections: prev.config_schema.sections.map((section, sIndex) =>
          sIndex === sectionIndex
            ? {
                ...section,
                fields: section.fields.map((fieldData, fIndex) =>
                  fIndex === fieldIndex
                    ? { ...fieldData, [field]: value }
                    : fieldData
                ),
              }
            : section
        ),
      },
    }));
  };

  const removeField = (sectionIndex, fieldIndex) => {
    setFormData((prev) => ({
      ...prev,
      config_schema: {
        ...prev.config_schema,
        sections: prev.config_schema.sections.map((section, sIndex) =>
          sIndex === sectionIndex
            ? {
                ...section,
                fields: section.fields.filter(
                  (_, fIndex) => fIndex !== fieldIndex
                ),
              }
            : section
        ),
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

        {/* Template Settings */}
        <div className='bg-white rounded-lg shadow p-6'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>
            Template Settings
          </h3>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
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

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Category
              </label>
              <input
                type='text'
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                placeholder='interactive, professional, modern'
              />
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
              >
                <option value='landing'>Landing</option>
                <option value='parties'>Parties</option>
                <option value='events'>Events</option>
                <option value='bookings'>Bookings</option>
                <option value='checkout'>Checkout</option>
                <option value='bowling'>Bowling</option>
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Component File
              </label>
              <select
                value={formData.component_file}
                onChange={(e) => handleComponentSelect(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
              >
                <option value=''>Select component file...</option>
                {availableComponents.map((component) => (
                  <option key={component.file} value={component.file}>
                    {component.displayName} ({component.type})
                  </option>
                ))}
              </select>
              <p className='text-xs text-gray-500 mt-1'>
                Link template to specific React component file
              </p>
            </div>
          </div>

          {/* Component Path Display */}
          {formData.component_file && (
            <div className='mt-4 p-3 bg-blue-50 rounded-lg'>
              <div className='text-sm text-blue-800'>
                <strong>Component:</strong> {formData.component_file}
              </div>
              <div className='text-xs text-blue-600 mt-1'>
                <strong>Path:</strong> {formData.component_path}
              </div>
            </div>
          )}

          <div className='mt-4 flex items-center'>
            <input
              id='is_active'
              type='checkbox'
              checked={formData.is_active}
              onChange={(e) => handleInputChange('is_active', e.target.checked)}
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

        {/* Template Sections */}
        <div className='bg-white rounded-lg shadow'>
          <div className='px-6 py-4 border-b border-gray-200 flex justify-between items-center'>
            <h3 className='text-lg font-semibold text-gray-900'>
              Template Sections
            </h3>
            <button
              onClick={addSection}
              className='bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700'
            >
              Add Section
            </button>
          </div>

          <div className='p-6'>
            {formData.config_schema.sections.length > 0 ? (
              <div className='space-y-6'>
                {formData.config_schema.sections.map(
                  (section, sectionIndex) => (
                    <SectionEditor
                      key={sectionIndex}
                      section={section}
                      sectionIndex={sectionIndex}
                      onUpdateSection={updateSection}
                      onRemoveSection={removeSection}
                      onMoveSection={moveSection}
                      onAddField={addFieldToSection}
                      onUpdateField={updateField}
                      onRemoveField={removeField}
                      totalSections={formData.config_schema.sections.length}
                    />
                  )
                )}
              </div>
            ) : (
              <div className='text-center py-8 text-gray-500'>
                <div className='mb-4'>
                  <FolderIcon className='h-12 w-12 text-gray-300 mx-auto' />
                </div>
                <p className='text-lg font-medium mb-2'>No sections defined</p>
                <p className='text-sm mb-4'>
                  Templates are organized into sections. Each section can
                  contain multiple fields.
                </p>
                <button
                  onClick={addSection}
                  className='bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700'
                >
                  Add Your First Section
                </button>
              </div>
            )}
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

// Section Editor Component
function SectionEditor({
  section,
  sectionIndex,
  onUpdateSection,
  onRemoveSection,
  onMoveSection,
  onAddField,
  onUpdateField,
  onRemoveField,
  totalSections,
}) {
  const [expanded, setExpanded] = useState(false);

  const handleHeaderClick = (e) => {
    // Only toggle if not clicking on input fields or buttons
    if (e.target.closest('input, button, select, textarea')) {
      return
    }
    setExpanded(!expanded)
  }

  return (
    <div className='border border-gray-200 rounded-lg' key={sectionIndex}>
      {/* Section Header */}
      <div 
        className='px-4 py-3 bg-gray-50 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors'
        onClick={handleHeaderClick}
      >
        <div className='flex justify-between items-center'>
          <div className='flex items-center space-x-3'>
            <div className='text-gray-500'>
              {expanded ? (
                <ChevronDownIcon className='h-5 w-5' />
              ) : (
                <ChevronRightIcon className='h-5 w-5' />
              )}
            </div>
            <div>
              <h4 className='text-md font-semibold text-gray-900'>
                {section.name || `Section ${sectionIndex + 1}`}
              </h4>
              <p className='text-xs text-gray-500'>
                {section.fields?.length || 0} fields •{' '}
                {section.required ? 'Required' : 'Optional'}
              </p>
            </div>
          </div>

          <div className='flex items-center space-x-2'>
            {sectionIndex > 0 && (
              <button
                onClick={() => onMoveSection(sectionIndex, sectionIndex - 1)}
                className='text-xs text-indigo-600 hover:text-indigo-800'
              >
                ↑ Up
              </button>
            )}
            {sectionIndex < totalSections - 1 && (
              <button
                onClick={() => onMoveSection(sectionIndex, sectionIndex + 1)}
                className='text-xs text-indigo-600 hover:text-indigo-800'
              >
                ↓ Down
              </button>
            )}
            <button
              onClick={() => onRemoveSection(sectionIndex)}
              className='text-xs text-red-600 hover:text-red-800'
            >
              Remove Section
            </button>
          </div>
        </div>
      </div>

      {expanded && (
        <div className='p-4'>
          {/* Section Configuration */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
            <div>
              <label className='block text-xs font-medium text-gray-700 mb-1'>
                Section Key
              </label>
              <input
                type='text'
                value={section.key}
                onChange={(e) =>
                  onUpdateSection(sectionIndex, 'key', e.target.value)
                }
                className='w-full px-2 py-1 border border-gray-300 rounded text-sm'
                placeholder='header, gallery_1, faq_section'
              />
            </div>

            <div>
              <label className='block text-xs font-medium text-gray-700 mb-1'>
                Section Name
              </label>
              <input
                type='text'
                value={section.name}
                onChange={(e) =>
                  onUpdateSection(sectionIndex, 'name', e.target.value)
                }
                className='w-full px-2 py-1 border border-gray-300 rounded text-sm'
                placeholder='Header Section'
              />
            </div>
          </div>

          <div className='mb-4'>
            <label className='block text-xs font-medium text-gray-700 mb-1'>
              Description
            </label>
            <input
              type='text'
              value={section.description}
              onChange={(e) =>
                onUpdateSection(sectionIndex, 'description', e.target.value)
              }
              className='w-full px-2 py-1 border border-gray-300 rounded text-sm'
              placeholder='Description of this section'
            />
          </div>

          <div className='mb-6 flex items-center'>
            <input
              type='checkbox'
              checked={section.required}
              onChange={(e) =>
                onUpdateSection(sectionIndex, 'required', e.target.checked)
              }
              className='h-3 w-3 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'
            />
            <span className='ml-2 text-xs text-gray-600'>
              Required section (cannot be disabled in page editor)
            </span>
          </div>

          {/* Fields within Section */}
          <div className='border-t border-gray-200 pt-4'>
            <div className='flex justify-between items-center mb-4'>
              <h5 className='text-sm font-medium text-gray-700'>
                Section Fields
              </h5>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onAddField(sectionIndex)
                }}
                className='bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700'
              >
                Add Field
              </button>
            </div>

            {section.fields?.length > 0 ? (
              <div className='space-y-3'>
                {section.fields.map((field, fieldIndex) => (
                  <FieldEditor
                    key={fieldIndex}
                    field={field}
                    fieldIndex={fieldIndex}
                    sectionIndex={sectionIndex}
                    onUpdateField={onUpdateField}
                    onRemoveField={onRemoveField}
                  />
                ))}
              </div>
            ) : (
              <div className='text-center py-4 text-gray-400 text-sm'>
                No fields in this section. Click "Add Field" to start.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Field Editor Component
function FieldEditor({
  field,
  fieldIndex,
  sectionIndex,
  onUpdateField,
  onRemoveField,
}) {
  return (
    <div className='border border-gray-200 rounded-lg p-6 bg-white shadow-sm'>
      <div className='flex justify-between items-start mb-4'>
        <h5 className='text-md font-semibold text-gray-900'>Field #{fieldIndex + 1}</h5>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemoveField(sectionIndex, fieldIndex)
          }}
          className='text-red-600 hover:text-red-800 text-sm px-3 py-1 border border-red-300 rounded hover:bg-red-50'
        >
          Remove Field
        </button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Field Key
          </label>
          <input
            type='text'
            value={field.key}
            onChange={(e) =>
              onUpdateField(sectionIndex, fieldIndex, 'key', e.target.value)
            }
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
            placeholder='field_name'
          />
          <p className='text-xs text-gray-500 mt-1'>Unique identifier for this field</p>
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Field Label
          </label>
          <input
            type='text'
            value={field.label}
            onChange={(e) =>
              onUpdateField(sectionIndex, fieldIndex, 'label', e.target.value)
            }
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
            placeholder='Field Label'
          />
          <p className='text-xs text-gray-500 mt-1'>Display name shown to users</p>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Field Type
          </label>
          <select
            value={field.type}
            onChange={(e) =>
              onUpdateField(sectionIndex, fieldIndex, 'type', e.target.value)
            }
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
          >
            <option value='text'>Text Input</option>
            <option value='textarea'>Textarea</option>
            <option value='url'>URL Input</option>
            <option value='image'>Image Upload</option>
            <option value='slider'>Image Slider</option>
            <option value='faq'>FAQ Section</option>
          </select>
        </div>

        <div className='flex items-end'>
          <label className='flex items-center'>
            <input
              type='checkbox'
              checked={field.required}
              onChange={(e) =>
                onUpdateField(
                  sectionIndex,
                  fieldIndex,
                  'required',
                  e.target.checked
                )
              }
              className='h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'
            />
            <span className='ml-2 text-sm text-gray-700'>Required field</span>
          </label>
        </div>
      </div>

      <div className='mt-6'>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          Field Description
        </label>
        <textarea
          rows={2}
          value={field.description || ''}
          onChange={(e) =>
            onUpdateField(
              sectionIndex,
              fieldIndex,
              'description',
              e.target.value
            )
          }
          className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
          placeholder='Optional description or help text for this field'
        />
      </div>

      {/* Field-specific settings */}
      {(field.type === 'slider' || field.type === 'faq') && (
        <div className='mt-6 pt-4 border-t border-gray-200'>
          <h6 className='text-sm font-medium text-gray-700 mb-3'>
            {field.type === 'slider' ? 'Slider Settings' : 'FAQ Settings'}
          </h6>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-xs font-medium text-gray-700 mb-1'>
                Minimum {field.type === 'slider' ? 'Slides' : 'FAQs'}
              </label>
              <input
                type='number'
                min='1'
                max='10'
                value={field.type === 'slider' ? (field.minSlides || 1) : (field.minFAQs || 1)}
                onChange={(e) => onUpdateField(sectionIndex, fieldIndex, field.type === 'slider' ? 'minSlides' : 'minFAQs', parseInt(e.target.value))}
                className='w-full px-2 py-1 border border-gray-300 rounded text-sm'
              />
            </div>
            <div>
              <label className='block text-xs font-medium text-gray-700 mb-1'>
                Maximum {field.type === 'slider' ? 'Slides' : 'FAQs'}
              </label>
              <input
                type='number'
                min='1'
                max={field.type === 'slider' ? 20 : 50}
                value={field.type === 'slider' ? (field.maxSlides || 10) : (field.maxFAQs || 20)}
                onChange={(e) => onUpdateField(sectionIndex, fieldIndex, field.type === 'slider' ? 'maxSlides' : 'maxFAQs', parseInt(e.target.value))}
                className='w-full px-2 py-1 border border-gray-300 rounded text-sm'
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Icons
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

function FolderIcon(props) {
  return (
    <svg {...props} fill='none' viewBox='0 0 24 24' stroke='currentColor'>
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z'
      />
    </svg>
  );
}

function ChevronDownIcon(props) {
  return (
    <svg {...props} fill='none' viewBox='0 0 24 24' stroke='currentColor'>
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M19 9l-7 7-7-7'
      />
    </svg>
  );
}

function ChevronRightIcon(props) {
  return (
    <svg {...props} fill='none' viewBox='0 0 24 24' stroke='currentColor'>
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M9 5l7 7-7 7'
      />
    </svg>
  );
}
