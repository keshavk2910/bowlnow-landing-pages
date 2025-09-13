import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import AdminLayout from '../../../../components/admin/AdminLayout'

export default function EditClientPage() {
  const router = useRouter()
  const { clientId } = router.query
  const [client, setClient] = useState(null)
  const [sites, setSites] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    site_id: '',
    is_active: true
  })

  useEffect(() => {
    if (clientId) {
      fetchClientAndSites()
    }
  }, [clientId])

  async function fetchClientAndSites() {
    try {
      const [clientRes, sitesRes] = await Promise.all([
        fetch(`/api/admin/clients/${clientId}`),
        fetch('/api/admin/sites')
      ])

      if (clientRes.ok) {
        const clientData = await clientRes.json()
        setClient(clientData.client)
        setFormData({
          name: clientData.client.name,
          email: clientData.client.email,
          password: '',
          confirmPassword: '',
          site_id: clientData.client.site_id,
          is_active: clientData.client.is_active
        })
      }

      if (sitesRes.ok) {
        const sitesData = await sitesRes.json()
        setSites(sitesData.sites)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    
    // Validate passwords match if changing password
    if (formData.password && formData.password !== formData.confirmPassword) {
      alert('Passwords do not match')
      return
    }

    setSaving(true)

    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
        is_active: formData.is_active
      }

      // Only include password if it's being changed
      if (formData.password) {
        updateData.password = formData.password
      }

      const response = await fetch(`/api/admin/clients/${clientId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      })

      if (response.ok) {
        alert('Client updated successfully!')
        router.push('/admin/clients')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to update client')
      }
    } catch (error) {
      console.error('Error updating client:', error)
      alert('Failed to update client')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
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

  if (!client) {
    return (
      <AdminLayout title="Client Not Found">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Client Not Found</h1>
          <Link
            href="/admin/clients"
            className="text-indigo-600 hover:text-indigo-800"
          >
            Back to Clients
          </Link>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title={`Edit ${client.name}`}>
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
              <h3 className="text-lg leading-6 font-medium text-gray-900">Edit Client</h3>
              <p className="mt-1 text-sm text-gray-500">
                Update client information and site access.
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
                  />
                </div>
              </div>

              {/* Site Assignment (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Assigned Site
                </label>
                <div className="mt-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md">
                  <div className="text-gray-900">{client.sites?.client_name}</div>
                  <div className="text-sm text-gray-500">/{client.sites?.slug}</div>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Site assignment cannot be changed. Create a new client account for different sites.
                </p>
              </div>

              {/* Password Change */}
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-900">Change Password (Optional)</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Leave blank to keep current password"
                      minLength={8}
                    />
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Re-enter new password"
                    />
                  </div>
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
                    Account is active
                  </label>
                </div>
              </div>

              {/* Login History */}
              {client.last_login && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Account Information</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Last Login: {new Date(client.last_login).toLocaleString()}</div>
                    <div>Account Created: {new Date(client.created_at).toLocaleDateString()}</div>
                  </div>
                </div>
              )}

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
                  disabled={saving}
                  className={`py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    saving 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                  }`}
                >
                  {saving ? 'Saving...' : 'Update Client'}
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