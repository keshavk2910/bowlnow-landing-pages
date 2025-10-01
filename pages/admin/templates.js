import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import Link from 'next/link';
export default function TemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
  const [duplicateModal, setDuplicateModal] = useState(null);
  const [duplicating, setDuplicating] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  async function fetchTemplates() {
    try {
      const response = await fetch('/api/admin/templates');
      if (response.ok) {
        const data = await response.json();
        setTemplates(data.templates);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteTemplate(templateId, templateName) {
    if (!confirm(`Are you sure you want to delete "${templateName}"?\n\nThis will permanently delete the template configuration.\nNote: The component file will remain in the templates folder.`)) {
      return
    }

    // Additional confirmation for safety
    const confirmName = prompt(`Type "${templateName}" to confirm deletion:`)
    if (confirmName !== templateName) {
      alert('Template name does not match. Deletion cancelled.')
      return
    }

    try {
      const response = await fetch(`/api/admin/templates/${templateId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchTemplates() // Refresh the list
        alert('Template deleted successfully')
      } else {
        const error = await response.json()

        // Display detailed error message with site names
        if (error.usedInSites && error.usedInSites.length > 0) {
          const sitesList = error.usedInSites.join(', ')
          const pageCountText = error.pageCount > 1 ? `${error.pageCount} pages` : '1 page'
          alert(
            `Cannot delete template "${templateName}".\n\n` +
            `This template is currently used by ${pageCountText} in the following site(s):\n\n` +
            `${sitesList}\n\n` +
            `Please update or delete those pages first.`
          )
        } else {
          alert(error.error || 'Failed to delete template')
        }
      }
    } catch (error) {
      console.error('Error deleting template:', error)
      alert('Failed to delete template')
    }
  }

  async function duplicateTemplate(templateId, newName, newCategory, duplicateComponent, configSchema) {
    setDuplicating(true)
    try {
      const response = await fetch(`/api/admin/templates/${templateId}/duplicate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newName, newCategory, duplicateComponent, configSchema })
      })

      if (response.ok) {
        const data = await response.json()

        // Verify isolation after duplication
        if (data.duplicatedTemplate?.id) {
          await verifyTemplateIsolation(templateId, data.duplicatedTemplate.id)
        }

        fetchTemplates() // Refresh the list
        setDuplicateModal(null)

        // Enhanced success message with isolation info
        const message = `Template duplicated successfully!\n\n` +
          `Original: ${data.originalTemplate?.name}\n` +
          `Duplicate: ${data.duplicatedTemplate?.name}\n` +
          `Files copied: ${Object.values(data.filesCopied || {}).filter(Boolean).length}\n` +
          `Configuration ${data.configurationUpdated ? 'updated' : 'preserved'}`

        alert(message)
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to duplicate template')
      }
    } catch (error) {
      console.error('Error duplicating template:', error)
      alert('Failed to duplicate template')
    } finally {
      setDuplicating(false)
    }
  }

  async function verifyTemplateIsolation(originalId, duplicatedId) {
    try {
      const response = await fetch(`/api/admin/templates/${originalId}/verify-isolation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ duplicatedTemplateId: duplicatedId })
      })

      if (response.ok) {
        const data = await response.json()
        if (!data.isolation.fullyIsolated) {
          console.warn('Template isolation verification failed:', data)
          alert(`Warning: Template isolation may be incomplete (${data.isolation.percentage}% isolated)`)
        } else {
          console.log('Template isolation verified successfully:', data.isolation.percentage + '% isolated')
        }
      }
    } catch (error) {
      console.warn('Failed to verify template isolation:', error)
    }
  }

  const filteredTemplates = templates.filter((template) => {
    if (filter === 'all') return true;
    return template.type === filter;
  });

  const templateTypes = ['all', 'landing', 'parties', 'events', 'bookings', 'bowling', 'template-page-one'];

  return (
    <AdminLayout title='Templates'>
      <div className='space-y-6'>
        {/* Header */}
        <div className='flex justify-between items-center'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>Templates</h1>
            <p className='text-gray-600'>Manage funnel templates and designs</p>
          </div>
          <div className="flex space-x-2">
            <Link
              href="/builder"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
            >
              🎨 Visual Builder
            </Link>
            <Link
              href="/admin/templates/new"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors inline-block"
            >
              Create Template
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className='bg-white p-4 rounded-lg shadow'>
          <div className='flex space-x-2'>
            {templateTypes.map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === type
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {type === 'all'
                  ? 'All Templates'
                  : type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        {loading ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className='bg-white rounded-lg shadow animate-pulse'>
                <div className='h-48 bg-gray-200 rounded-t-lg'></div>
                <div className='p-6'>
                  <div className='h-6 bg-gray-200 rounded w-3/4 mb-2'></div>
                  <div className='h-4 bg-gray-200 rounded w-1/2 mb-4'></div>
                  <div className='h-10 bg-gray-200 rounded'></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onDelete={deleteTemplate}
                onDuplicate={(template) => setDuplicateModal(template)}
                onImageClick={setSelectedImage}
              />
            ))}
          </div>
        )}

        {!loading && filteredTemplates.length === 0 && (
          <div className='text-center py-12'>
            <div className='text-gray-400 text-lg mb-2'>No templates found</div>
            <p className='text-gray-500 mb-4'>
              {filter === 'all'
                ? 'No templates available'
                : `No ${filter} templates found`}
            </p>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center z-50 p-4" onClick={() => setSelectedImage(null)}>
          {/* Title at Top */}
          <div className="text-white text-center mb-4 flex-shrink-0">
            <h3 className="text-2xl font-semibold">{selectedImage.title}</h3>
            <p className="text-gray-300 mt-1">Template Preview</p>
          </div>
          
          {/* Image Container */}
          <div className="flex-1 flex items-center justify-center max-h-[calc(100vh-120px)] w-full">
            <img
              src={selectedImage.url}
              alt={selectedImage.title}
              className="max-h-full w-auto object-contain rounded-lg shadow-2xl"
              style={{ maxHeight: 'calc(100vh - 120px)' }}
            />
          </div>
          
          {/* Footer */}
          <div className="text-center mt-4 flex-shrink-0">
            <p className="text-gray-300 text-sm">Click anywhere to close</p>
          </div>
        </div>
      )}

      {/* Duplicate Modal */}
      {duplicateModal && (
        <DuplicateModal
          template={duplicateModal}
          onDuplicate={duplicateTemplate}
          onClose={() => setDuplicateModal(null)}
          duplicating={duplicating}
        />
      )}
    </AdminLayout>
  );
}

function TemplateCard({ template, onDelete, onDuplicate, onImageClick }) {
  const typeColors = {
    landing: 'bg-blue-100 text-blue-800',
    parties: 'bg-purple-100 text-purple-800',
    events: 'bg-green-100 text-green-800',
    bookings: 'bg-orange-100 text-orange-800',
    bowling: 'bg-red-100 text-red-800',
    'template-page-one': 'bg-blue-100 text-blue-800',
  };

  const typeIcons = {
    landing: '🏠',
    parties: '🎉',
    events: '📅',
    bookings: '📋',
    bowling: '🎳',
    'template-page-one': '🎯',
  };

  const handleDelete = () => {
    onDelete(template.id, template.name)
  }

  return (
    <div className='bg-white rounded-lg shadow hover:shadow-md transition-shadow'>
      <div 
        className='h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg flex items-center justify-center cursor-pointer relative overflow-hidden'
        onClick={() => template.template_image_url && onImageClick({ url: template.template_image_url, title: template.name })}
      >
        {template.template_image_url ? (
          <>
            <img
              src={template.template_image_url}
              alt={template.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all flex items-center justify-center">
              <div className="text-white opacity-0 hover:opacity-100 transition-opacity">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
            </div>
          </>
        ) : (
          <div className='text-6xl'>{typeIcons[template.type] || '📄'}</div>
        )}
      </div>

      <div className='p-6'>
        <div className='flex items-center justify-between mb-3'>
          <h3 className='text-lg font-semibold text-gray-900'>
            {template.name}
          </h3>
          <span
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              typeColors[template.type] || 'bg-gray-100 text-gray-800'
            }`}
          >
            {template.type}
          </span>
        </div>

        <p className='text-gray-600 text-sm mb-4'>
          Category: {template.category} •{' '}
          {template.config_schema.fields?.length || 0} fields
        </p>

        <div className='grid grid-cols-2 gap-2 mb-2'>
          <Link
            href={`/admin/templates/${template.id}/edit`}
            className='px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors text-center'
          >
            Edit
          </Link>
          <Link
            href={`/admin/templates/${template.id}/preview`}
            className='px-3 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors text-center'
          >
            Preview
          </Link>
        </div>
        <div className='grid grid-cols-2 gap-2'>
          <button
            onClick={() => onDuplicate(template)}
            className='px-3 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition-colors'
          >
            Duplicate
          </button>
          <button
            onClick={handleDelete}
            className='px-3 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors'
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function DuplicateModal({ template, onDuplicate, onClose, duplicating }) {
  // Deep clone utility to ensure complete isolation
  const deepClone = (obj) => {
    if (obj === null || typeof obj !== 'object') return obj
    if (obj instanceof Date) return new Date(obj.getTime())
    if (obj instanceof Array) return obj.map(item => deepClone(item))
    if (typeof obj === 'object') {
      const clonedObj = {}
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          clonedObj[key] = deepClone(obj[key])
        }
      }
      return clonedObj
    }
    return obj
  }

  const [newName, setNewName] = useState(`${template.name} (Copy)`)
  const [newCategory, setNewCategory] = useState(template.category)
  const [duplicateComponent, setDuplicateComponent] = useState(false)
  // Use deep clone to ensure complete isolation from original template
  const [configSchema, setConfigSchema] = useState(() => deepClone(template.config_schema || {}))
  const [activeTab, setActiveTab] = useState('basic')

  // Reset configuration schema to original when modal opens
  useEffect(() => {
    setConfigSchema(deepClone(template.config_schema || {}))
    setNewName(`${template.name} (Copy)`)
    setNewCategory(template.category)
    setActiveTab('basic')
  }, [template.id]) // Reset when template changes

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!newName.trim()) {
      alert('Please enter a name for the duplicated template')
      return
    }
    onDuplicate(template.id, newName.trim(), newCategory.trim(), duplicateComponent, configSchema)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Duplicate Template
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
              disabled={duplicating}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600">
              <strong>Original:</strong> {template.name}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Type:</strong> {template.type} • <strong>Category:</strong> {template.category}
            </p>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  type="button"
                  onClick={() => setActiveTab('basic')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'basic'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  disabled={duplicating}
                >
                  Basic Settings
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('configuration')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'configuration'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  disabled={duplicating}
                >
                  Template Configuration
                </button>
              </nav>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="max-h-[60vh] overflow-y-auto">
            {/* Basic Settings Tab */}
            {activeTab === 'basic' && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="newName" className="block text-sm font-medium text-gray-700 mb-2">
                    New Template Name *
                  </label>
                  <input
                    type="text"
                    id="newName"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter template name"
                    required
                    disabled={duplicating}
                  />
                </div>

                <div>
                  <label htmlFor="newCategory" className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    id="newCategory"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter category"
                    disabled={duplicating}
                  />
                </div>

                {template.component_file && (
                  <div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="duplicateComponent"
                        checked={duplicateComponent}
                        onChange={(e) => setDuplicateComponent(e.target.checked)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        disabled={duplicating}
                      />
                      <label htmlFor="duplicateComponent" className="ml-2 block text-sm text-gray-900">
                        Also duplicate component file ({template.component_file}.js)
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 ml-6">
                      This will create a copy of the React component file with the new template name
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Template Configuration Tab */}
            {activeTab === 'configuration' && (
              <div className="space-y-6">
                <TemplateConfigEditor
                  configSchema={configSchema}
                  setConfigSchema={setConfigSchema}
                  disabled={duplicating}
                />
              </div>
            )}

          </form>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={duplicating}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={duplicating || !newName.trim()}
              className={`px-4 py-2 rounded-md text-sm font-medium text-white transition-colors ${
                duplicating || !newName.trim()
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {duplicating ? 'Duplicating...' : 'Duplicate Template'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function TemplateConfigEditor({ configSchema, setConfigSchema, disabled }) {
  const hasModernStructure = configSchema && configSchema.sections && Array.isArray(configSchema.sections)

  const addSection = () => {
    if (!hasModernStructure) {
      // Convert to modern structure if needed
      const newSchema = {
        sections: configSchema.fields ? [{
          key: 'main',
          name: 'Main Section',
          order: 0,
          fields: configSchema.fields,
          required: true,
          description: 'Main template configuration'
        }] : []
      }
      setConfigSchema(newSchema)
      return
    }

    const newSection = {
      key: `section_${Date.now()}`,
      name: 'New Section',
      order: configSchema.sections.length,
      fields: [],
      required: false,
      description: ''
    }

    setConfigSchema({
      ...configSchema,
      sections: [...configSchema.sections, newSection]
    })
  }

  const updateSection = (sectionIndex, updates) => {
    if (!hasModernStructure) return

    const updatedSections = [...configSchema.sections]
    updatedSections[sectionIndex] = { ...updatedSections[sectionIndex], ...updates }
    setConfigSchema({ ...configSchema, sections: updatedSections })
  }

  const removeSection = (sectionIndex) => {
    if (!hasModernStructure) return

    const updatedSections = configSchema.sections.filter((_, index) => index !== sectionIndex)
    setConfigSchema({ ...configSchema, sections: updatedSections })
  }

  const addField = (sectionIndex) => {
    if (!hasModernStructure) return

    const newField = {
      key: `field_${Date.now()}`,
      type: 'text',
      label: 'New Field',
      required: false,
      description: ''
    }

    const updatedSections = [...configSchema.sections]
    updatedSections[sectionIndex].fields = [...(updatedSections[sectionIndex].fields || []), newField]
    setConfigSchema({ ...configSchema, sections: updatedSections })
  }

  const updateField = (sectionIndex, fieldIndex, updates) => {
    if (!hasModernStructure) return

    const updatedSections = [...configSchema.sections]
    updatedSections[sectionIndex].fields[fieldIndex] = {
      ...updatedSections[sectionIndex].fields[fieldIndex],
      ...updates
    }
    setConfigSchema({ ...configSchema, sections: updatedSections })
  }

  const removeField = (sectionIndex, fieldIndex) => {
    if (!hasModernStructure) return

    const updatedSections = [...configSchema.sections]
    updatedSections[sectionIndex].fields = updatedSections[sectionIndex].fields.filter((_, index) => index !== fieldIndex)
    setConfigSchema({ ...configSchema, sections: updatedSections })
  }

  if (!configSchema) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">No configuration schema found</p>
        <button
          type="button"
          onClick={() => setConfigSchema({ sections: [] })}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          disabled={disabled}
        >
          Create Configuration Schema
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-medium text-gray-900">Template Configuration</h4>
        <button
          type="button"
          onClick={addSection}
          className="bg-indigo-600 text-white px-3 py-1 text-sm rounded-md hover:bg-indigo-700"
          disabled={disabled}
        >
          Add Section
        </button>
      </div>

      {!hasModernStructure && configSchema.fields && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <p className="text-sm text-yellow-800">
            This template uses the legacy field structure. Click "Add Section" to convert to the modern structure.
          </p>
        </div>
      )}

      {hasModernStructure && configSchema.sections.map((section, sectionIndex) => (
        <SectionEditor
          key={section.key || sectionIndex}
          section={section}
          sectionIndex={sectionIndex}
          onUpdateSection={updateSection}
          onRemoveSection={removeSection}
          onAddField={addField}
          onUpdateField={updateField}
          onRemoveField={removeField}
          disabled={disabled}
        />
      ))}

      {hasModernStructure && configSchema.sections.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500 mb-4">No sections configured</p>
          <button
            type="button"
            onClick={addSection}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            disabled={disabled}
          >
            Add First Section
          </button>
        </div>
      )}
    </div>
  )
}

function SectionEditor({ section, sectionIndex, onUpdateSection, onRemoveSection, onAddField, onUpdateField, onRemoveField, disabled }) {
  const [expanded, setExpanded] = useState(true)

  return (
    <div className="border border-gray-200 rounded-lg">
      <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex items-center space-x-2 text-left"
          disabled={disabled}
        >
          <svg
            className={`w-4 h-4 transition-transform ${expanded ? 'rotate-90' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="font-medium">{section.name || 'Unnamed Section'}</span>
          <span className="text-sm text-gray-500">({(section.fields || []).length} fields)</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => onAddField(sectionIndex)}
            className="text-sm bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
            disabled={disabled}
          >
            + Field
          </button>
          <button
            type="button"
            onClick={() => onRemoveSection(sectionIndex)}
            className="text-sm bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
            disabled={disabled}
          >
            Remove
          </button>
        </div>
      </div>

      {expanded && (
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Section Key</label>
              <input
                type="text"
                value={section.key || ''}
                onChange={(e) => onUpdateSection(sectionIndex, { key: e.target.value })}
                className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                placeholder="section_key"
                disabled={disabled}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Section Name</label>
              <input
                type="text"
                value={section.name || ''}
                onChange={(e) => onUpdateSection(sectionIndex, { name: e.target.value })}
                className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                placeholder="Section Name"
                disabled={disabled}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={section.description || ''}
              onChange={(e) => onUpdateSection(sectionIndex, { description: e.target.value })}
              className="w-full text-sm border border-gray-300 rounded px-2 py-1"
              rows="2"
              placeholder="Section description"
              disabled={disabled}
            />
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={section.required || false}
                onChange={(e) => onUpdateSection(sectionIndex, { required: e.target.checked })}
                className="mr-2"
                disabled={disabled}
              />
              <span className="text-sm">Required</span>
            </label>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
              <input
                type="number"
                value={section.order || 0}
                onChange={(e) => onUpdateSection(sectionIndex, { order: parseInt(e.target.value) || 0 })}
                className="w-20 text-sm border border-gray-300 rounded px-2 py-1"
                disabled={disabled}
              />
            </div>
          </div>

          {/* Fields */}
          <div className="space-y-2">
            <h6 className="font-medium text-gray-900">Fields</h6>
            {(section.fields || []).map((field, fieldIndex) => (
              <FieldEditor
                key={field.key || fieldIndex}
                field={field}
                fieldIndex={fieldIndex}
                sectionIndex={sectionIndex}
                onUpdateField={onUpdateField}
                onRemoveField={onRemoveField}
                disabled={disabled}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function FieldEditor({ field, fieldIndex, sectionIndex, onUpdateField, onRemoveField, disabled }) {
  const fieldTypes = ['text', 'textarea', 'richtext', 'image', 'url', 'slider', 'table', 'faq', 'array', 'object', 'checkbox']

  return (
    <div className="bg-gray-50 border border-gray-200 rounded p-3">
      <div className="grid grid-cols-4 gap-3 mb-2">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Key</label>
          <input
            type="text"
            value={field.key || ''}
            onChange={(e) => onUpdateField(sectionIndex, fieldIndex, { key: e.target.value })}
            className="w-full text-xs border border-gray-300 rounded px-2 py-1"
            placeholder="field_key"
            disabled={disabled}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Label</label>
          <input
            type="text"
            value={field.label || ''}
            onChange={(e) => onUpdateField(sectionIndex, fieldIndex, { label: e.target.value })}
            className="w-full text-xs border border-gray-300 rounded px-2 py-1"
            placeholder="Field Label"
            disabled={disabled}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
          <select
            value={field.type || 'text'}
            onChange={(e) => onUpdateField(sectionIndex, fieldIndex, { type: e.target.value })}
            className="w-full text-xs border border-gray-300 rounded px-2 py-1"
            disabled={disabled}
          >
            {fieldTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <button
            type="button"
            onClick={() => onRemoveField(sectionIndex, fieldIndex)}
            className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 w-full"
            disabled={disabled}
          >
            Remove
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
          <input
            type="text"
            value={field.description || ''}
            onChange={(e) => onUpdateField(sectionIndex, fieldIndex, { description: e.target.value })}
            className="w-full text-xs border border-gray-300 rounded px-2 py-1"
            placeholder="Field description"
            disabled={disabled}
          />
        </div>
        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={field.required || false}
              onChange={(e) => onUpdateField(sectionIndex, fieldIndex, { required: e.target.checked })}
              className="mr-1"
              disabled={disabled}
            />
            <span className="text-xs">Required</span>
          </label>
          {field.type === 'slider' && (
            <>
              <div>
                <label className="block text-xs font-medium text-gray-700">Min</label>
                <input
                  type="number"
                  value={field.minSlides || ''}
                  onChange={(e) => onUpdateField(sectionIndex, fieldIndex, { minSlides: parseInt(e.target.value) || undefined })}
                  className="w-16 text-xs border border-gray-300 rounded px-1 py-1"
                  disabled={disabled}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700">Max</label>
                <input
                  type="number"
                  value={field.maxSlides || ''}
                  onChange={(e) => onUpdateField(sectionIndex, fieldIndex, { maxSlides: parseInt(e.target.value) || undefined })}
                  className="w-16 text-xs border border-gray-300 rounded px-1 py-1"
                  disabled={disabled}
                />
              </div>
            </>
          )}
          {field.type === 'table' && (
            <>
              <div>
                <label className="block text-xs font-medium text-gray-700">Min Rows</label>
                <input
                  type="number"
                  value={field.minRows || ''}
                  onChange={(e) => onUpdateField(sectionIndex, fieldIndex, { minRows: parseInt(e.target.value) || undefined })}
                  className="w-16 text-xs border border-gray-300 rounded px-1 py-1"
                  disabled={disabled}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700">Max Rows</label>
                <input
                  type="number"
                  value={field.maxRows || ''}
                  onChange={(e) => onUpdateField(sectionIndex, fieldIndex, { maxRows: parseInt(e.target.value) || undefined })}
                  className="w-16 text-xs border border-gray-300 rounded px-1 py-1"
                  disabled={disabled}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
