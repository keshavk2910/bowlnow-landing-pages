import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import AdminLayout from '../../../components/admin/AdminLayout'

export default function NewSitePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [templates, setTemplates] = useState([])
  const [formData, setFormData] = useState({
    client_name: '',
    slug: '',
    template_type: 'landing',
    tracking_pixels: {
      facebook: '',
      google: ''
    },
    settings: {
      domain: '',
      theme_color: '#4F46E5'
    }
  })

  useEffect(() => {
    fetchTemplates()
  }, [])

  useEffect(() => {
    // Auto-generate slug from client name
    if (formData.client_name) {
      const slug = formData.client_name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      
      setFormData(prev => ({ ...prev, slug }))
    }
  }, [formData.client_name])

  async function fetchTemplates() {
    try {
      const response = await fetch('/api/admin/templates')
      if (response.ok) {
        const data = await response.json()
        setTemplates(data.templates)
      }
    } catch (error) {
      console.error('Error fetching templates:', error)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/admin/sites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const { site } = await response.json()
        router.push(`/admin/sites/${site.slug}`)
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to create site')
      }
    } catch (error) {
      console.error('Error creating site:', error)
      alert('Failed to create site')
    } finally {
      setLoading(false)
    }
  }

  function handleInputChange(field, value) {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  function handleNestedChange(parent, field, value) {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }))
  }

  return (
    <AdminLayout title="Create New Site">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="mb-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Site Information</h3>
              <p className="mt-1 text-sm text-gray-500">
                Create a new client site with funnel templates and tracking setup.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Client Name */}
              <div>
                <label htmlFor="client_name" className="block text-sm font-medium text-gray-700">
                  Client Name *
                </label>
                <input
                  type="text"
                  id="client_name"
                  required
                  value={formData.client_name}
                  onChange={(e) => handleInputChange('client_name', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Pleasant Hills Bowling"
                />
              </div>

              {/* Slug */}
              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                  Site Slug *
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    {process.env.NEXT_PUBLIC_FRONTEND_DOMAIN || 'partners.bowlnow.com'}/
                  </span>
                  <input
                    type="text"
                    id="slug"
                    required
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    className="flex-1 block w-full rounded-none rounded-r-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="pleasant-hills"
                    pattern="[a-z0-9-]+"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">Only lowercase letters, numbers, and hyphens allowed</p>
              </div>

              {/* Default Template */}
              <div>
                <label htmlFor="template_type" className="block text-sm font-medium text-gray-700">
                  Default Template Type
                </label>
                <select
                  id="template_type"
                  value={formData.template_type}
                  onChange={(e) => handleInputChange('template_type', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="landing">Landing Page</option>
                  <option value="parties">Party Events</option>
                  <option value="events">Events Booking</option>
                  <option value="bookings">Bookings Management</option>
                  <option value="bowling">Bowling Alley</option>
                  <option value="template-page-one">Template Page One (Pleasant Hill Exact)</option>
                </select>
              </div>

              {/* Tracking Pixels */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Tracking Pixels
                </label>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="facebook_pixel" className="block text-xs font-medium text-gray-600">
                      Facebook Pixel ID
                    </label>
                    <input
                      type="text"
                      id="facebook_pixel"
                      value={formData.tracking_pixels.facebook}
                      onChange={(e) => handleNestedChange('tracking_pixels', 'facebook', e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="123456789012345"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="google_pixel" className="block text-xs font-medium text-gray-600">
                      Google Analytics ID
                    </label>
                    <input
                      type="text"
                      id="google_pixel"
                      value={formData.tracking_pixels.google}
                      onChange={(e) => handleNestedChange('tracking_pixels', 'google', e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="GA_MEASUREMENT_ID"
                    />
                  </div>
                </div>
              </div>

              {/* Settings */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Site Settings
                </label>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="domain" className="block text-xs font-medium text-gray-600">
                      Custom Domain (Optional)
                    </label>
                    <input
                      type="text"
                      id="domain"
                      value={formData.settings.domain}
                      onChange={(e) => handleNestedChange('settings', 'domain', e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="example.com"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="theme_color" className="block text-xs font-medium text-gray-600">
                      Theme Color
                    </label>
                    <div className="mt-1 flex items-center space-x-3">
                      <input
                        type="color"
                        id="theme_color"
                        value={formData.settings.theme_color}
                        onChange={(e) => handleNestedChange('settings', 'theme_color', e.target.value)}
                        className="h-10 w-16 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.settings.theme_color}
                        onChange={(e) => handleNestedChange('settings', 'theme_color', e.target.value)}
                        className="flex-1 block border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="#4F46E5"
                      />
                    </div>
                  </div>
                </div>
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
                  {loading ? 'Creating Site...' : 'Create Site'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}