import { useState, useEffect } from 'react'
import Head from 'next/head'

export default function GHLPortalLayout({ children, title = 'Client Portal', user, hideHeader = false }) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Set loading to false once component mounts
    setIsLoading(false)

    // Send iframe ready message to parent (GHL)
    if (window.parent !== window) {
      window.parent.postMessage({
        type: 'PORTAL_READY',
        data: {
          title: title,
          user: user?.name || 'Client'
        }
      }, '*')
    }

    // Listen for messages from parent GHL window
    const handleMessage = (event) => {
      if (event.data?.type === 'GHL_THEME_CHANGE') {
        // Handle theme changes from GHL
        document.documentElement.style.setProperty('--ghl-primary-color', event.data.primaryColor)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [title, user])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{title} - {user?.site?.name}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style jsx global>{`
          /* Iframe-specific styles */
          body {
            margin: 0;
            overflow-x: hidden;
          }
          
          /* GHL integration styles */
          .ghl-portal-container {
            background: white;
            border-radius: 8px;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          }

          /* Responsive iframe styles */
          @media (max-width: 768px) {
            .ghl-portal-container {
              border-radius: 0;
              box-shadow: none;
            }
          }
        `}</style>
      </Head>

      {/* Optional header for iframe context */}
      {!hideHeader && (
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-indigo-600 rounded-md flex items-center justify-center">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
                <p className="text-sm text-gray-500">{user?.site?.name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Live Data
              </span>
              {user && (
                <div className="flex items-center space-x-2">
                  <div className="h-6 w-6 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-700">
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600">{user.name}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main content area optimized for iframe */}
      <main className="ghl-portal-container">
        <div className="p-4 md:p-6">
          {children}
        </div>
      </main>

      {/* Footer with integration info */}
      <div className="bg-gray-50 border-t border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-2">
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Connected to GoHighLevel</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>Powered by</span>
            <span className="font-medium text-indigo-600">BowlNow</span>
          </div>
        </div>
      </div>
    </div>
  )
}