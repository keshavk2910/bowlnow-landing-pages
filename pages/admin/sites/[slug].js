import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import AdminLayout from '../../../components/admin/AdminLayout'

export default function SiteManagePage() {
  const router = useRouter()
  const { slug } = router.query
  const [site, setSite] = useState(null)
  const [pages, setPages] = useState([])
  const [paymentPlans, setPaymentPlans] = useState([])
  const [ghlPipelines, setGhlPipelines] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (slug) {
      fetchSiteData()
    }
  }, [slug])

  async function fetchSiteData() {
    try {
      const [siteRes, pagesRes, plansRes] = await Promise.all([
        fetch(`/api/admin/sites/by-slug/${slug}`),
        fetch(`/api/sites/${slug}/pages`),
        fetch(`/api/sites/${slug}/payment-plans`)
      ])

      if (siteRes.ok) {
        const siteData = await siteRes.json()
        setSite(siteData.site)
      }

      if (pagesRes.ok) {
        const pagesData = await pagesRes.json()
        setPages(pagesData.pages)
      }

      if (plansRes.ok) {
        const plansData = await plansRes.json()
        setPaymentPlans(plansData.plans)
      }

    } catch (error) {
      console.error('Error fetching site data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function connectStripe() {
    try {
      const response = await fetch('/api/stripe/create-connect-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteSlug: slug,
          email: 'admin@example.com' // This should come from a form
        })
      })

      if (response.ok) {
        const data = await response.json()
        window.open(data.onboarding_url, '_blank')
      }
    } catch (error) {
      console.error('Error connecting Stripe:', error)
    }
  }

  async function deletePage(pageId, pageName, isHomepage) {
    // Prevent deletion of homepage
    if (isHomepage) {
      alert('Cannot delete the homepage. Set another page as homepage first.')
      return
    }

    if (!confirm(`Are you sure you want to delete the page "${pageName}"? This action cannot be undone.`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/pages/${pageId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchSiteData() // Refresh the data
        alert('Page deleted successfully')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to delete page')
      }
    } catch (error) {
      console.error('Error deleting page:', error)
      alert('Failed to delete page')
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
          <p className="text-gray-600 mb-6">The site &quot;{slug}&quot; could not be found.</p>
          <Link
            href="/admin/sites"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Back to Sites
          </Link>
        </div>
      </AdminLayout>
    )
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: HomeIcon },
    { id: 'pages', name: 'Pages', icon: CollectionIcon },
    { id: 'payments', name: 'Payments', icon: CreditCardIcon },
    { id: 'integrations', name: 'Integrations', icon: LinkIcon },
    { id: 'analytics', name: 'Analytics', icon: ChartBarIcon },
  ]

  return (
    <AdminLayout title={`${site.client_name} - Management`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link 
              href="/admin/sites"
              className="text-gray-500 hover:text-gray-700"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{site.client_name}</h1>
              <p className="text-gray-600">{site.slug} • {site.status}</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Link
              href={`${process.env.NEXT_PUBLIC_FRONTEND_DOMAIN || 'https://partners.bowlnow.com'}/${site.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
            >
              View Site
            </Link>
            <Link
              href={`/admin/sites/${slug}/edit`}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors inline-block"
            >
              Edit Site
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Site Info */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Site Information</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Client Name</label>
                    <p className="text-gray-900">{site.client_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Site Slug</label>
                    <p className="text-gray-900">{site.slug}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      site.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {site.status}
                    </span>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Created</label>
                    <p className="text-gray-900">{new Date(site.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Pages</span>
                  <span className="font-semibold">{pages.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Plans</span>
                  <span className="font-semibold">{paymentPlans.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Stripe Connected</span>
                  <span className={`font-semibold ${site.stripe_account_id ? 'text-green-600' : 'text-red-600'}`}>
                    {site.stripe_account_id ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">GHL Connected</span>
                  <span className={`font-semibold ${site.ghl_location_id ? 'text-green-600' : 'text-red-600'}`}>
                    {site.ghl_location_id ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pages' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Site Pages</h3>
              <Link
                href={`/admin/sites/${slug}/pages/new`}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700 inline-block"
              >
                Create New Page
              </Link>
            </div>
            <div className="p-6">
              {pages.length > 0 ? (
                <div className="space-y-4">
                  {pages.map((page) => (
                    <div key={page.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold text-gray-900">{page.name}</h4>
                          <p className="text-sm text-gray-600">/{page.slug} • {page.page_type}</p>
                          {page.is_homepage && (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 mt-1">
                              Homepage
                            </span>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            page.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {page.is_published ? 'Published' : 'Draft'}
                          </span>
                          <Link 
                            href={`/admin/sites/${slug}/pages/${page.id}/edit`}
                            className="text-indigo-600 hover:text-indigo-800 text-sm"
                          >
                            Edit
                          </Link>
                          <Link 
                            href={`${process.env.NEXT_PUBLIC_FRONTEND_DOMAIN || 'http://localhost:3000'}/${site.slug}/${page.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Preview
                          </Link>
                          <button
                            onClick={() => deletePage(page.id, page.name, page.is_homepage)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No pages created yet</p>
                  <Link
                    href={`/admin/sites/${slug}/pages/new`}
                    className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 inline-block"
                  >
                    Create Your First Page
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'integrations' && (
          <div className="space-y-6">
            {/* Stripe Integration */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                    <CreditCardIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Stripe Connect</h3>
                    <p className="text-sm text-gray-600">Payment processing integration</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`h-2 w-2 rounded-full ${site.stripe_account_id ? 'bg-green-400' : 'bg-gray-300'}`}></div>
                  <span className="text-sm text-gray-600">
                    {site.stripe_account_id ? 'Connected' : 'Not Connected'}
                  </span>
                </div>
              </div>
              
              {site.stripe_account_id ? (
                <div className="text-sm text-gray-600">
                  <p>Account ID: {site.stripe_account_id}</p>
                  <button className="mt-2 text-indigo-600 hover:text-indigo-800">
                    View Stripe Dashboard
                  </button>
                </div>
              ) : (
                <button
                  onClick={connectStripe}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Connect Stripe Account
                </button>
              )}
            </div>

            {/* GHL Integration */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                    <LinkIcon className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">GoHighLevel</h3>
                    <p className="text-sm text-gray-600">CRM and pipeline integration</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`h-2 w-2 rounded-full ${site.ghl_location_id ? 'bg-green-400' : 'bg-gray-300'}`}></div>
                  <span className="text-sm text-gray-600">
                    {site.ghl_location_id ? 'Connected' : 'Not Connected'}
                  </span>
                </div>
              </div>
              
              <div className="space-y-4">
                <GHLLocationForm 
                  siteSlug={slug} 
                  currentLocationId={site.ghl_location_id}
                  hasLocationToken={!!site.ghl_location_token_encrypted}
                  onSuccess={fetchSiteData} 
                />
                {site.ghl_location_id && (
                  <div className="border-t pt-4">
                    <PipelineConfigForm 
                      siteSlug={slug}
                      locationId={site.ghl_location_id}
                      onSuccess={fetchSiteData}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Payment Plans</h3>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700">
                Create Payment Plan
              </button>
            </div>
            <div className="p-6">
              {paymentPlans.length > 0 ? (
                <div className="space-y-4">
                  {paymentPlans.map((plan) => (
                    <div key={plan.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold text-gray-900">{plan.name}</h4>
                          <p className="text-sm text-gray-600">{plan.description}</p>
                          <p className="text-lg font-bold text-gray-900 mt-1">
                            ${plan.price} {plan.type === 'subscription' && `/${plan.billing_interval}`}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            plan.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {plan.is_active ? 'Active' : 'Inactive'}
                          </span>
                          <button className="text-indigo-600 hover:text-indigo-800 text-sm">Edit</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No payment plans created yet</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

// Icons
function HomeIcon(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  )
}

function CollectionIcon(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  )
}

function CreditCardIcon(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  )
}

function LinkIcon(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  )
}

function ChartBarIcon(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  )
}

// GHL Location Form Component
function GHLLocationForm({ siteSlug, currentLocationId, hasLocationToken, onSuccess }) {
  const [isEditing, setIsEditing] = useState(!currentLocationId) // Show form if no location ID
  const [locationId, setLocationId] = useState(currentLocationId || '')
  const [locationToken, setLocationToken] = useState('')
  const [saving, setSaving] = useState(false)
  const [availableLocations, setAvailableLocations] = useState([])
  const [loadingLocations, setLoadingLocations] = useState(false)

  useEffect(() => {
    setLocationId(currentLocationId || '')
    setIsEditing(!currentLocationId) // Auto-open form if no location set
  }, [currentLocationId])

  const fetchAvailableLocations = async () => {
    setLoadingLocations(true)
    try {
      const response = await fetch('/api/ghl/get-agency-info')
      if (response.ok) {
        const data = await response.json()
        setAvailableLocations(data.locations || [])
      }
    } catch (error) {
      console.error('Error fetching locations:', error)
    } finally {
      setLoadingLocations(false)
    }
  }

  const handleSave = async () => {
    if (!locationId) {
      alert('Please enter a Location ID')
      return
    }

    setSaving(true)
    try {
      const updateData = { ghl_location_id: locationId }
      
      // Add location token if provided
      if (locationToken.trim()) {
        updateData.ghl_location_token = locationToken.trim()
      }

      const response = await fetch(`/api/admin/sites/by-slug/${siteSlug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      })

      if (response.ok) {
        setLocationToken('') // Clear the token input for security
        setIsEditing(false) // Close edit mode
        onSuccess()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to save GHL configuration')
      }
    } catch (error) {
      console.error('Error saving GHL configuration:', error)
      alert('Failed to save GHL configuration')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setLocationId(currentLocationId || '')
    setLocationToken('')
    setIsEditing(false)
  }

  if (!isEditing && currentLocationId) {
    // View mode - show saved configuration
    return (
      <div className="space-y-3">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-sm font-semibold text-green-800 mb-2">GoHighLevel Connected</h4>
              <div className="space-y-1 text-sm text-green-700">
                <div><strong>Location ID:</strong> {currentLocationId}</div>
                <div><strong>Private Integration Token:</strong> {hasLocationToken ? '✅ Saved (Encrypted)' : '❌ Not Configured'}</div>
                {process.env.NODE_ENV === 'development' && hasLocationToken && (
                  <ShowDecryptedToken siteSlug={siteSlug} />
                )}
              </div>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-white border border-green-300 text-green-700 px-3 py-1 rounded text-sm hover:bg-green-50"
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Edit mode - show form
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-semibold text-gray-900">
          {currentLocationId ? 'Edit GoHighLevel Configuration' : 'Connect GoHighLevel'}
        </h4>
        {currentLocationId && (
          <button
            onClick={handleCancel}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        )}
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            GoHighLevel Location ID
          </label>
          <button
            onClick={fetchAvailableLocations}
            disabled={loadingLocations}
            className="text-xs text-indigo-600 hover:text-indigo-800"
          >
            {loadingLocations ? 'Loading...' : 'View Available Locations'}
          </button>
        </div>
        
        <input
          type="text"
          value={locationId}
          onChange={(e) => setLocationId(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Enter GHL Location ID (e.g., ve9EPM428h8vShlRW1KT)"
        />
        <p className="text-xs text-gray-500 mt-1">
          Get Location IDs from your GoHighLevel account or use the button above
        </p>
      </div>

      {/* Location Private Integration Token */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Location Private Integration Token {hasLocationToken && <span className="text-green-600">(Currently Saved)</span>}
        </label>
        <input
          type="password"
          value={locationToken}
          onChange={(e) => setLocationToken(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder={hasLocationToken ? "Enter new token to update..." : "pit-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"}
        />
        <p className="text-xs text-gray-500 mt-1">
          Location-specific Private Integration Token for this GHL location (encrypted when saved)
        </p>
      </div>

      {availableLocations.length > 0 && (
        <div className="border border-gray-200 rounded-md p-3">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Available Locations:</h4>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {availableLocations.map((location) => (
              <button
                key={location.id}
                onClick={() => setLocationId(location.id)}
                className="w-full text-left px-2 py-1 text-xs hover:bg-gray-50 rounded flex justify-between"
              >
                <span>{location.name}</span>
                <span className="text-gray-500 font-mono">{location.id}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex space-x-2">
        <button
          onClick={handleSave}
          disabled={saving || !locationId}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : currentLocationId ? 'Update Configuration' : 'Save Configuration'}
        </button>
        
        {currentLocationId && (
          <button
            onClick={handleCancel}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  )
}

// Show Decrypted Token Component (Development Only)
function ShowDecryptedToken({ siteSlug }) {
  const [decryptedToken, setDecryptedToken] = useState('')
  const [showToken, setShowToken] = useState(false)
  const [loading, setLoading] = useState(false)

  const fetchDecryptedToken = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/sites/by-slug/${siteSlug}/decrypt-token`)
      if (response.ok) {
        const data = await response.json()
        setDecryptedToken(data.decryptedToken)
        setShowToken(true)
      }
    } catch (error) {
      console.error('Error fetching decrypted token:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-2 pt-2 border-t border-green-200">
      <div className="text-xs text-green-600">
        <strong>DEV MODE:</strong>{' '}
        {!showToken ? (
          <button
            onClick={fetchDecryptedToken}
            disabled={loading}
            className="underline hover:no-underline"
          >
            {loading ? 'Loading...' : 'Show Decrypted Token'}
          </button>
        ) : (
          <div className="mt-1">
            <div className="bg-green-100 p-2 rounded font-mono text-xs break-all">
              {decryptedToken}
            </div>
            <button
              onClick={() => setShowToken(false)}
              className="underline hover:no-underline mt-1"
            >
              Hide Token
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// Pipeline Configuration Form Component
function PipelineConfigForm({ siteSlug, locationId, onSuccess }) {
  const [isEditing, setIsEditing] = useState(false)
  const [pipelines, setPipelines] = useState([])
  const [selectedPipelineId, setSelectedPipelineId] = useState('')
  const [stages, setStages] = useState([])
  const [stageMappings, setStageMappings] = useState({
    form_submitted: '',
    checkout_started: '',
    payment_completed: ''
  })
  const [currentConfig, setCurrentConfig] = useState(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (locationId) {
      fetchCurrentConfig()
    }
  }, [locationId])

  useEffect(() => {
    if (selectedPipelineId && pipelines.length > 0) {
      const selectedPipeline = pipelines.find(p => p.id === selectedPipelineId)
      setStages(selectedPipeline?.stages || [])
    }
  }, [selectedPipelineId, pipelines])

  async function fetchCurrentConfig() {
    setLoading(true)
    try {
      // Only fetch existing pipeline configuration - no GHL API call
      const configResponse = await fetch(`/api/admin/sites/${siteSlug}/pipeline-config`)
      if (configResponse.ok) {
        const configData = await configResponse.json()
        if (configData.config) {
          setCurrentConfig(configData.config)
          setSelectedPipelineId(configData.config.pipeline_id)
          setStageMappings(configData.config.stage_mappings)
          setIsEditing(false) // Show view mode if config exists
        } else {
          setIsEditing(true) // Show edit mode if no config
        }
      }
    } catch (error) {
      console.error('Error fetching pipeline config:', error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchPipelinesForEditing() {
    setLoading(true)
    try {
      // Only call GHL API when user clicks edit
      const pipelinesResponse = await fetch(`/api/ghl/pipelines?siteSlug=${siteSlug}`)
      if (pipelinesResponse.ok) {
        const pipelinesData = await pipelinesResponse.json()
        setPipelines(pipelinesData.pipelines || [])
      }
    } catch (error) {
      console.error('Error fetching pipelines:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
    fetchPipelinesForEditing() // Only call GHL API when editing
  }

  const handleCancel = () => {
    setSelectedPipelineId(currentConfig?.pipeline_id || '')
    setStageMappings(currentConfig?.stage_mappings || {
      form_submitted: '',
      checkout_started: '',
      payment_completed: ''
    })
    setIsEditing(false)
  }

  async function handleSavePipeline() {
    if (!selectedPipelineId) {
      alert('Please select a pipeline')
      return
    }

    setSaving(true)
    try {
      const selectedPipeline = pipelines.find(p => p.id === selectedPipelineId)
      
      const response = await fetch('/api/ghl/configure-pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteSlug,
          pipelineId: selectedPipelineId,
          pipelineName: selectedPipeline?.name || 'Selected Pipeline',
          stageMappings
        })
      })

      if (response.ok) {
        setIsEditing(false) // Close edit mode
        fetchCurrentConfig() // Refresh the config display
        alert('Pipeline configuration saved!')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to save pipeline configuration')
      }
    } catch (error) {
      console.error('Error saving pipeline config:', error)
      alert('Failed to save pipeline configuration')
    } finally {
      setSaving(false)
    }
  }

  const handleStageMapping = (action, stageId) => {
    setStageMappings(prev => ({ ...prev, [action]: stageId }))
  }

  if (!isEditing && currentConfig) {
    // View mode - show saved configuration
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-md font-semibold text-gray-900">Pipeline Configuration</h4>
          <button
            onClick={handleEdit}
            className="bg-white border border-blue-300 text-blue-700 px-3 py-1 rounded text-sm hover:bg-blue-50"
          >
            Edit
          </button>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h5 className="text-sm font-semibold text-blue-900">Active Pipeline: {currentConfig.pipeline_name}</h5>
              <p className="text-xs text-blue-700">Pipeline ID: {currentConfig.pipeline_id}</p>
            </div>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              Configured
            </span>
          </div>
          
          <div className="space-y-2 text-sm text-blue-800">
            <div className="flex justify-between">
              <span>📝 <strong>Form Submitted</strong></span>
              <span>{currentConfig.stage_mappings.form_submitted ? 'Mapped' : 'Not mapped'}</span>
            </div>
            <div className="flex justify-between">
              <span>🛒 <strong>Checkout Started</strong></span>
              <span>{currentConfig.stage_mappings.checkout_started ? 'Mapped' : 'Not mapped'}</span>
            </div>
            <div className="flex justify-between">
              <span>💰 <strong>Payment Completed</strong></span>
              <span>{currentConfig.stage_mappings.payment_completed ? 'Mapped' : 'Not mapped'}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Edit mode - show form
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-md font-semibold text-gray-900">
          {currentConfig ? 'Edit Pipeline Configuration' : 'Configure Pipeline'}
        </h4>
        {currentConfig && (
          <button
            onClick={handleCancel}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        )}
      </div>
      
      {loading ? (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">Loading pipelines...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Pipeline Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Pipeline
            </label>
            <select
              value={selectedPipelineId}
              onChange={(e) => setSelectedPipelineId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Choose a pipeline...</option>
              {pipelines.map((pipeline) => (
                <option key={pipeline.id} value={pipeline.id}>
                  {pipeline.name}
                </option>
              ))}
            </select>
          </div>

          {/* Stage Mappings */}
          {stages.length > 0 && (
            <div className="space-y-3">
              <h5 className="text-sm font-medium text-gray-700">Map Page Actions to Pipeline Stages:</h5>
              
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Form Submitted → Stage
                  </label>
                  <select
                    value={stageMappings.form_submitted}
                    onChange={(e) => handleStageMapping('form_submitted', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  >
                    <option value="">Select stage...</option>
                    {stages.map((stage) => (
                      <option key={stage.id} value={stage.id}>
                        {stage.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Checkout Started → Stage
                  </label>
                  <select
                    value={stageMappings.checkout_started}
                    onChange={(e) => handleStageMapping('checkout_started', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  >
                    <option value="">Select stage...</option>
                    {stages.map((stage) => (
                      <option key={stage.id} value={stage.id}>
                        {stage.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Payment Completed → Stage
                  </label>
                  <select
                    value={stageMappings.payment_completed}
                    onChange={(e) => handleStageMapping('payment_completed', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  >
                    <option value="">Select stage...</option>
                    {stages.map((stage) => (
                      <option key={stage.id} value={stage.id}>
                        {stage.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={handleSavePipeline}
                  disabled={saving || !selectedPipelineId}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
                >
                  {saving ? 'Saving...' : 'Save Configuration'}
                </button>
                
                {currentConfig && (
                  <button
                    onClick={handleCancel}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          )}

          {pipelines.length === 0 && !loading && (
            <div className="text-center py-4 text-gray-500 text-sm">
              No pipelines found for this location. Check your Location ID.
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function ArrowLeftIcon(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  )
}