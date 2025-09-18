import { useState, useEffect } from 'react'

export default function CopyPageModal({ isOpen, onClose, targetSiteSlug, onSuccess }) {
  const [step, setStep] = useState(1)
  const [selectedSite, setSelectedSite] = useState('')
  const [selectedPage, setSelectedPage] = useState('')
  const [sites, setSites] = useState([])
  const [pages, setPages] = useState([])
  const [loading, setLoading] = useState(false)
  const [copying, setCopying] = useState(false)
  const [copyOptions, setCopyOptions] = useState({
    copyPaymentPlans: true,
    copyFiles: true,
    copyPipelineConfig: true,
    makeHomepage: false
  })

  useEffect(() => {
    if (isOpen) {
      fetchSites()
      setStep(1)
      setSelectedSite('')
      setSelectedPage('')
      setPages([])
    }
  }, [isOpen])

  useEffect(() => {
    if (selectedSite) {
      fetchPages(selectedSite)
    }
  }, [selectedSite])

  async function fetchSites() {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/sites')
      if (response.ok) {
        const data = await response.json()
        // Filter out the current site
        const otherSites = data.sites.filter(site => site.slug !== targetSiteSlug)
        setSites(otherSites)
      }
    } catch (error) {
      console.error('Error fetching sites:', error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchPages(siteSlug) {
    setLoading(true)
    try {
      const response = await fetch(`/api/sites/${siteSlug}/pages`)
      if (response.ok) {
        const data = await response.json()
        setPages(data.pages)
      }
    } catch (error) {
      console.error('Error fetching pages:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleCopyPage() {
    if (!selectedSite || !selectedPage) {
      alert('Please select both a site and a page')
      return
    }

    setCopying(true)
    try {
      const response = await fetch(`/api/admin/sites/${targetSiteSlug}/copy-page`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sourceSiteSlug: selectedSite,
          sourcePageId: selectedPage,
          copyOptions
        })
      })

      if (response.ok) {
        const data = await response.json()
        alert('Page copied successfully!')
        onSuccess()
        onClose()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to copy page')
      }
    } catch (error) {
      console.error('Error copying page:', error)
      alert('Failed to copy page')
    } finally {
      setCopying(false)
    }
  }

  if (!isOpen) return null

  const selectedPageData = pages.find(p => p.id === selectedPage)

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              Copy Page from Another Site
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Step 1: Select Site */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Source Site
                </label>
                <select
                  value={selectedSite}
                  onChange={(e) => setSelectedSite(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={loading}
                >
                  <option value="">Choose a site to copy from...</option>
                  {sites.map((site) => (
                    <option key={site.id} value={site.slug}>
                      {site.client_name} ({site.slug})
                    </option>
                  ))}
                </select>
                {loading && (
                  <p className="text-sm text-gray-500 mt-1">Loading sites...</p>
                )}
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setStep(2)}
                  disabled={!selectedSite || loading}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Next: Select Page
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Select Page */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Page to Copy
                  <span className="text-gray-500 font-normal">
                    (from {sites.find(s => s.slug === selectedSite)?.client_name})
                  </span>
                </label>
                
                {loading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="text-sm text-gray-500 mt-2">Loading pages...</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto border border-gray-200 rounded-md p-2">
                    {pages.map((page) => (
                      <div
                        key={page.id}
                        className={`p-3 rounded-md cursor-pointer border ${
                          selectedPage === page.id
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedPage(page.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-900">{page.name}</h4>
                            <p className="text-sm text-gray-600">/{page.slug} • {page.page_type}</p>
                          </div>
                          <div className="flex flex-col items-end space-y-1">
                            {page.is_homepage && (
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                Homepage
                              </span>
                            )}
                            <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                              page.is_published 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {page.is_published ? 'Published' : 'Draft'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {pages.length === 0 && !loading && (
                  <p className="text-center py-4 text-gray-500">
                    No pages found in selected site
                  </p>
                )}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                >
                  Back
                </button>
                <div className="flex space-x-3">
                  <button
                    onClick={onClose}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={!selectedPage}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Next: Configure Copy
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Copy Options */}
          {step === 3 && selectedPageData && (
            <div className="space-y-6">
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">
                  Copy Configuration
                </h4>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h5 className="font-medium text-blue-900 mb-1">Selected Page:</h5>
                  <p className="text-sm text-blue-800">
                    <strong>{selectedPageData.name}</strong> from {sites.find(s => s.slug === selectedSite)?.client_name}
                  </p>
                  <p className="text-xs text-blue-700">
                    Type: {selectedPageData.page_type} • Status: {selectedPageData.is_published ? 'Published' : 'Draft'}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  What to copy along with the page:
                </label>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={copyOptions.copyPaymentPlans}
                      onChange={(e) => setCopyOptions(prev => ({
                        ...prev,
                        copyPaymentPlans: e.target.checked
                      }))}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Copy Payment Plans associated with this page
                    </span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={copyOptions.copyFiles}
                      onChange={(e) => setCopyOptions(prev => ({
                        ...prev,
                        copyFiles: e.target.checked
                      }))}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Copy uploaded files (images, documents, etc.)
                    </span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={copyOptions.copyPipelineConfig}
                      onChange={(e) => setCopyOptions(prev => ({
                        ...prev,
                        copyPipelineConfig: e.target.checked
                      }))}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Copy GoHighLevel pipeline configuration
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={copyOptions.makeHomepage}
                      onChange={(e) => setCopyOptions(prev => ({
                        ...prev,
                        makeHomepage: e.target.checked
                      }))}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Set as homepage (will unset current homepage)
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                >
                  Back
                </button>
                <div className="flex space-x-3">
                  <button
                    onClick={onClose}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCopyPage}
                    disabled={copying}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {copying ? 'Copying Page...' : 'Copy Page'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}