import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import AdminLayout from '../../../components/admin/AdminLayout'

export default function NewClientPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [sites, setSites] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    site_id: '',
    is_active: true
  })

  useEffect(() => {
    fetchSites()
  }, [])

  async function fetchSites() {
    try {
      const response = await fetch('/api/admin/sites')
      if (response.ok) {
        const data = await response.json()
        setSites(data.sites)
      }
    } catch (error) {
      console.error('Error fetching sites:', error)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/admin/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          site_id: formData.site_id,
          is_active: formData.is_active
        })
      })

      if (response.ok) {
        const { client } = await response.json()
        alert('Client created successfully!')
        router.push('/admin/clients')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to create client')
      }
    } catch (error) {
      console.error('Error creating client:', error)
      alert('Failed to create client')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const selectedSite = sites.find(site => site.id === formData.site_id)

  return (
    <AdminLayout title="Create New Client">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link 
            href="/admin/clients"
            className="text-indigo-600 hover:text-indigo-800 flex items-center space-x-2"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            <span>Back to Clients</span>
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="mb-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Client Information</h3>
              <p className="mt-1 text-sm text-gray-500">
                Create a new client account with portal access to their site.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Client Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              {/* Site Assignment */}
              <div>
                <label htmlFor="site_id" className="block text-sm font-medium text-gray-700">
                  Assign to Site *
                </label>
                <select
                  id="site_id"
                  required
                  value={formData.site_id}
                  onChange={(e) => handleInputChange('site_id', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select a site...</option>
                  {sites.map((site) => (
                    <option key={site.id} value={site.id}>
                      {site.client_name} ({site.slug})
                    </option>
                  ))}
                </select>
                {selectedSite && (
                  <p className="mt-1 text-sm text-gray-500">
                    Client will have access to: {selectedSite.client_name}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password *
                  </label>
                  <input
                    type="password"
                    id="password"
                    required
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Minimum 8 characters"
                    minLength={8}
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Re-enter password"
                  />
                </div>
              </div>

              {/* Account Status */}
              <div>
                <div className="flex items-center">
                  <input
                    id="is_active"
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => handleInputChange('is_active', e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                    Account is active (client can log in immediately)
                  </label>
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
                  {loading ? 'Creating Client...' : 'Create Client'}
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