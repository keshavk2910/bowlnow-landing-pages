import { useState, useEffect } from 'react'

export default function CopySiteModal({ isOpen, onClose, onSuccess }) {
  const [sites, setSites] = useState([])
  const [selectedSiteId, setSelectedSiteId] = useState('')
  const [newSiteName, setNewSiteName] = useState('')
  const [newSiteSlug, setNewSiteSlug] = useState('')
  const [copying, setCopying] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetchSites()
    }
  }, [isOpen])

  useEffect(() => {
    // Auto-generate slug from name
    if (newSiteName) {
      const slug = newSiteName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      
      setNewSiteSlug(slug)
    }
  }, [newSiteName])

  async function fetchSites() {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/sites')
      if (response.ok) {
        const data = await response.json()
        setSites(data.sites)
      }
    } catch (error) {
      console.error('Error fetching sites:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleCopy() {
    if (!selectedSiteId || !newSiteName || !newSiteSlug) {
      alert('Please fill in all required fields')
      return
    }

    setCopying(true)
    try {
      const response = await fetch('/api/admin/sites/duplicate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceSiteId: selectedSiteId,
          newSiteName: newSiteName,
          newSiteSlug: newSiteSlug
        })
      })

      if (response.ok) {
        const result = await response.json()
        alert(`Site duplicated successfully! New site: ${result.site.client_name}`)
        onSuccess(result.site)
        onClose()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to duplicate site')
      }
    } catch (error) {
      console.error('Error duplicating site:', error)
      alert('Failed to duplicate site')
    } finally {
      setCopying(false)
    }
  }

  const resetForm = () => {
    setSelectedSiteId('')
    setNewSiteName('')
    setNewSiteSlug('')
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const selectedSite = sites.find(site => site.id === selectedSiteId)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Duplicate Site</h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Source Site Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Site to Copy *
            </label>
            {loading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto"></div>
              </div>
            ) : (
              <select
                value={selectedSiteId}
                onChange={(e) => setSelectedSiteId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Choose a site to duplicate...</option>
                {sites.map((site) => (
                  <option key={site.id} value={site.id}>
                    {site.client_name} ({site.slug}) - {site.pageCount || 0} pages
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Selected Site Info */}
          {selectedSite && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">
                Copying from: {selectedSite.client_name}
              </h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p>• {selectedSite.pageCount || 0} pages will be copied</p>
                <p>• Logo and site settings will be duplicated</p>
                <p>• Contact information will be copied</p>
                <p>• Pipeline configuration will be duplicated</p>
              </div>
              <div className="text-xs text-blue-600 mt-2">
                Note: Integrations (Stripe, GHL tokens) will need to be reconfigured
              </div>
            </div>
          )}

          {/* New Site Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Site Name *
              </label>
              <input
                type="text"
                value={newSiteName}
                onChange={(e) => setNewSiteName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="New Client Name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Site URL *
              </label>
              <div className="flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  {process.env.NEXT_PUBLIC_FRONTEND_DOMAIN || 'localhost:3000'}/
                </span>
                <input
                  type="text"
                  value={newSiteSlug}
                  onChange={(e) => setNewSiteSlug(e.target.value)}
                  className="flex-1 block w-full rounded-none rounded-r-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="new-site-slug"
                  pattern="[a-z0-9-]+"
                />
              </div>
            </div>
          </div>

          {/* What Will Be Copied */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">What will be duplicated:</h4>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
              <div className="space-y-1">
                <p>✓ Site configuration</p>
                <p>✓ Logo and branding</p>
                <p>✓ Contact information</p>
                <p>✓ Theme colors</p>
              </div>
              <div className="space-y-1">
                <p>✓ All pages and content</p>
                <p>✓ Templates and sections</p>
                <p>✓ Pipeline configuration</p>
                <p>✓ Payment plans</p>
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-600">
              <strong>Not copied:</strong> Customer data, orders, uploaded files, Stripe/GHL tokens
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleCopy}
            disabled={copying || !selectedSiteId || !newSiteName || !newSiteSlug}
            className={`px-4 py-2 text-white rounded-md ${
              copying || !selectedSiteId || !newSiteName || !newSiteSlug
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {copying ? 'Duplicating...' : 'Duplicate Site'}
          </button>
        </div>
      </div>
    </div>
  )
}

function XIcon(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}