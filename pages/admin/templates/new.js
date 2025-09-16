import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import AdminLayout from '../../../components/admin/AdminLayout'

export default function NewTemplatePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [availableComponents, setAvailableComponents] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    type: 'landing',
    category: '',
    component_file: '',
    component_path: '',
    config_schema: {
      sections: []
    },
    is_active: true
  })

  useEffect(() => {
    // Get list of available template components
    fetchAvailableComponents()
  }, [])

  async function fetchAvailableComponents() {
    try {
      const response = await fetch('/api/admin/templates/components')
      if (response.ok) {
        const data = await response.json()
        setAvailableComponents(data.components)
      }
    } catch (error) {
      console.error('Error fetching components:', error)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/admin/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const { template } = await response.json()
        alert('Template created successfully!')
        router.push(`/admin/templates/${template.id}/edit`)
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to create template')
      }
    } catch (error) {
      console.error('Error creating template:', error)
      alert('Failed to create template')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleComponentSelect = (componentFile) => {
    const component = availableComponents.find(c => c.file === componentFile)
    if (component) {
      setFormData(prev => ({
        ...prev,
        component_file: component.file,
        component_path: component.path
      }))
    }
  }

  const addSection = () => {
    const newSection = {
      key: '',
      name: '',
      description: '',
      required: false,
      order: formData.config_schema.sections.length,
      fields: []
    }
    
    setFormData(prev => ({
      ...prev,
      config_schema: {
        ...prev.config_schema,
        sections: [...prev.config_schema.sections, newSection]
      }
    }))
  }

  return (
    <AdminLayout title="Create New Template">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link 
            href="/admin/templates"
            className="text-indigo-600 hover:text-indigo-800 flex items-center space-x-2"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            <span>Back to Templates</span>
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="mb-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Template Information</h3>
              <p className="mt-1 text-sm text-gray-500">
                Create a new template with section-based configuration.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Template Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Template Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="My Custom Template"
                  />
                </div>

                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                    Template Type *
                  </label>
                  <select
                    id="type"
                    required
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="landing">Landing Page</option>
                    <option value="parties">Party Events</option>
                    <option value="events">Events Booking</option>
                    <option value="bookings">Bookings Management</option>
                    <option value="checkout">Checkout Page</option>
                    <option value="thank-you">Thank You Page</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Category *
                  </label>
                  <input
                    type="text"
                    id="category"
                    required
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="interactive, professional, modern"
                  />
                </div>

                <div>
                  <label htmlFor="component_file" className="block text-sm font-medium text-gray-700">
                    Component File
                  </label>
                  <select
                    id="component_file"
                    value={formData.component_file}
                    onChange={(e) => handleComponentSelect(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select existing component or create new</option>
                    {availableComponents.map((component) => (
                      <option key={component.file} value={component.file}>
                        {component.file} ({component.type})
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Link to existing component file or leave blank to create new
                  </p>
                </div>
              </div>

              {/* Component Path */}
              {formData.component_file && (
                <div>
                  <label htmlFor="component_path" className="block text-sm font-medium text-gray-700">
                    Component Path
                  </label>
                  <input
                    type="text"
                    id="component_path"
                    value={formData.component_path}
                    onChange={(e) => handleInputChange('component_path', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="components/templates/MyTemplate.js"
                  />
                </div>
              )}

              {/* Template Status */}
              <div className="flex items-center">
                <input
                  id="is_active"
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => handleInputChange('is_active', e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                  Active template
                </label>
              </div>

              {/* Initial Section */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Template Structure</h4>
                <p className="text-sm text-blue-700 mb-3">
                  After creating the template, you can add sections and fields in the template editor.
                </p>
                {formData.config_schema.sections.length > 0 && (
                  <div className="text-xs text-blue-600">
                    Sections: {formData.config_schema.sections.length}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    loading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                  }`}
                >
                  {loading ? 'Creating Template...' : 'Create Template'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

function ArrowLeftIcon(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  )
}