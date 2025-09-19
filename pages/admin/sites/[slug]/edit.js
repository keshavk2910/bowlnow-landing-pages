import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import AdminLayout from '../../../../components/admin/AdminLayout'
import FileUpload from '../../../../components/FileUpload'

export default function EditSitePage() {
  const router = useRouter()
  const { slug } = router.query
  const [site, setSite] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    client_name: '',
    slug: '',
    logo_url: '',
    tracking_pixels: {
      facebook: '',
      google: ''
    },
    settings: {
      domain: '',
      theme_color: '#4F46E5',
      description: ''
    },
    contact_info: '',
    contact_phone: '',
    contact_email: '',
    footer_description: '',
    status: 'active'
  })

  useEffect(() => {
    if (slug) {
      fetchSite()
    }
  }, [slug])

  async function fetchSite() {
    try {
      const response = await fetch(`/api/admin/sites/by-slug/${slug}`)
      if (response.ok) {
        const data = await response.json()
        setSite(data.site)
        setFormData({
          client_name: data.site.client_name,
          slug: data.site.slug,
          logo_url: data.site.logo_url || '',
          tracking_pixels: data.site.tracking_pixels || { facebook: '', google: '' },
          settings: {
            domain: data.site.settings?.domain || '',
            theme_color: data.site.settings?.theme_color || '#4F46E5',
            description: data.site.settings?.description || ''
          },
          contact_info: data.site.contact_info || '',
          contact_phone: data.site.contact_phone || '',
          contact_email: data.site.contact_email || '',
          footer_description: data.site.footer_description || '',
          status: data.site.status
        })
      }
    } catch (error) {
      console.error('Error fetching site:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    setSaving(true)

    try {
      const response = await fetch(`/api/admin/sites/by-slug/${slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        alert('Site updated successfully!')
        router.push(`/admin/sites/${slug}`)
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to update site')
      }
    } catch (error) {
      console.error('Error updating site:', error)
      alert('Failed to update site')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNestedChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }))
  }

  const handleLogoUploaded = (file) => {
    if (file) {
      setFormData(prev => ({ ...prev, logo_url: file.url }))
    } else {
      setFormData(prev => ({ ...prev, logo_url: '' }))
    }
  }

  if (loading) {
    return (
      <AdminLayout title="Loading...">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </AdminLayout>
    )
  }

  if (!site) {
    return (
      <AdminLayout title="Site Not Found">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Site Not Found</h1>
          <Link
            href="/admin/sites"
            className="text-indigo-600 hover:text-indigo-800"
          >
            Back to Sites
          </Link>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title={`Edit ${site.client_name}`}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link 
            href={`/admin/sites/${slug}`}
            className="text-indigo-600 hover:text-indigo-800 flex items-center space-x-2"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            <span>Back to {site.client_name}</span>
          </Link>
        </div>

        <div className="space-y-6">
          {/* Site Logo */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Site Logo</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Logo
                  </label>
                  <FileUpload
                    value={formData.logo_url}
                    onFileUploaded={handleLogoUploaded}
                    siteId={site.id}
                    pageId={null}
                    fieldKey="site_logo"
                    allowedTypes={['image']}
                    maxSizeMB={2}
                    multiple={false}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Recommended: Square image, at least 200x200px, under 2MB
                  </p>
                </div>

                {formData.logo_url && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Logo Preview
                    </label>
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <img
                        src={formData.logo_url}
                        alt={`${formData.client_name} logo`}
                        className="w-32 h-32 object-contain mx-auto"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  />
                </div>

                <div>
                  <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                    Site URL
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      {process.env.NEXT_PUBLIC_FRONTEND_DOMAIN || 'localhost:3000'}/
                    </span>
                    <input
                      type="text"
                      id="slug"
                      value={formData.slug}
                      readOnly
                      className="flex-1 block w-full rounded-none rounded-r-md border border-gray-300 py-2 px-3 bg-gray-50 text-gray-500"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">URL slug cannot be changed after creation</p>
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Site Description
                </label>
                <textarea
                  id="description"
                  rows={3}
                  value={formData.settings.description}
                  onChange={(e) => handleNestedChange('settings', 'description', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Brief description of the business or site"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Contact Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="contact_info" className="block text-sm font-medium text-gray-700">
                    Contact Info/Address
                  </label>
                  <textarea
                    id="contact_info"
                    rows={3}
                    value={formData.contact_info}
                    onChange={(e) => handleInputChange('contact_info', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="123 Main Street, City, State 12345"
                  />
                </div>
                
                <div>
                  <label htmlFor="contact_phone" className="block text-sm font-medium text-gray-700">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    id="contact_phone"
                    value={formData.contact_phone}
                    onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    id="contact_email"
                    value={formData.contact_email}
                    onChange={(e) => handleInputChange('contact_email', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="contact@business.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="footer_description" className="block text-sm font-medium text-gray-700">
                    Footer Description
                  </label>
                  <textarea
                    id="footer_description"
                    rows={2}
                    value={formData.footer_description}
                    onChange={(e) => handleInputChange('footer_description', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Brief description for site footer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Appearance Settings */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Appearance</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="theme_color" className="block text-sm font-medium text-gray-700">
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

                <div>
                  <label htmlFor="domain" className="block text-sm font-medium text-gray-700">
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
              </div>
            </div>
          </div>

          {/* Tracking Pixels */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Tracking Pixels</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="facebook_pixel" className="block text-sm font-medium text-gray-700">
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
                  <label htmlFor="google_pixel" className="block text-sm font-medium text-gray-700">
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
          </div>

          {/* Site Status */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Site Status</h3>
              
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Save Actions */}
          <div className="flex justify-end space-x-3">
            <Link
              href={`/admin/sites/${slug}`}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
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
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
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