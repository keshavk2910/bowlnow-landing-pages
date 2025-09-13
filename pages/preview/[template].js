import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import TemplateRenderer from '../../components/TemplateRenderer'
import AttributionTracker from '../../components/AttributionTracker'

export default function TemplatePage({ site, funnel, page, error }) {
  const router = useRouter()
  const [sessionId, setSessionId] = useState(null)

  useEffect(() => {
    // Generate session ID for preview
    const previewSessionId = 'preview_' + Math.random().toString(36).substring(2) + Date.now().toString(36)
    setSessionId(previewSessionId)
  }, [])

  // Mock form submission for preview
  const handleFormSubmit = async (formData) => {
    console.log('Preview form submission:', formData)
    alert('This is a preview - form submission would create a lead in the real system')
    return { success: true }
  }

  // Mock checkout for preview
  const handleCheckoutClick = async (planId, planData) => {
    console.log('Preview checkout:', planId, planData)
    alert('This is a preview - checkout would redirect to Stripe in the real system')
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Preview Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  if (!site || !page) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Preview: {page.content.title || funnel?.name || site.client_name}</title>
        <meta name="description" content={page.content.meta_description || `Preview of ${site.client_name}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      {/* Preview Banner */}
      <div className="bg-yellow-500 text-yellow-900 px-4 py-2 text-center text-sm font-medium sticky top-0 z-50">
        🔍 PREVIEW MODE - This is a template preview with mock data
      </div>

      {/* Attribution Tracker Component (Preview Mode) */}
      <AttributionTracker 
        siteId={site.id}
        funnelId={funnel?.id}
        pageId={page.id}
        sessionId={sessionId}
      />

      {/* Template Renderer */}
      <TemplateRenderer
        template={page.templates}
        content={page.content}
        site={site}
        funnel={funnel}
        page={page}
        sessionId={sessionId}
        onFormSubmit={handleFormSubmit}
        onCheckoutClick={handleCheckoutClick}
      />
    </>
  )
}

export async function getServerSideProps({ params }) {
  try {
    const { template } = params

    if (!template) {
      return {
        props: {
          error: 'Template type is required'
        }
      }
    }

    // Fetch mock data from our API
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/preview/${template}`)

    if (!response.ok) {
      throw new Error(`Failed to load preview data: ${response.statusText}`)
    }

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error || 'Failed to load preview data')
    }

    return {
      props: {
        site: data.site,
        funnel: data.funnel,
        page: data.page
      }
    }

  } catch (error) {
    console.error('Error in preview getServerSideProps:', error)
    return {
      props: {
        error: error.message || 'Failed to load preview'
      }
    }
  }
}