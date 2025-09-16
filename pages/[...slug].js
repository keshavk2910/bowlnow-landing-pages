import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { getSiteBySlug, getSitePageBySlug, getSiteHomePage } from '../lib/database'
import TemplateRenderer from '../components/TemplateRenderer'
import AttributionTracker from '../components/AttributionTracker'
import { initUTMPreservation } from '../lib/utm-preservation'

export default function DynamicPage({ site, page, error }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState(null)

  useEffect(() => {
    // Generate or retrieve session ID for tracking
    let currentSessionId = localStorage.getItem('funnel_session_id')
    if (!currentSessionId) {
      currentSessionId = 'session_' + Math.random().toString(36).substring(2) + Date.now().toString(36)
      localStorage.setItem('funnel_session_id', currentSessionId)
    }
    setSessionId(currentSessionId)
    
    // Initialize UTM parameter preservation for all links
    initUTMPreservation()
  }, [])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Go Home
          </Link>
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
        <title>{page.content.title || page.name || site.client_name}</title>
        <meta name="description" content={page.content.meta_description || `${site.client_name} - ${page.name}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Tracking pixels */}
        {site.tracking_pixels?.facebook && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window,document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${site.tracking_pixels.facebook}');
                fbq('track', 'PageView');
              `
            }}
          />
        )}
        
        {site.tracking_pixels?.google && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${site.tracking_pixels.google}`}></script>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${site.tracking_pixels.google}');
                `
              }}
            />
          </>
        )}
        
        {page.tracking_pixels && Object.entries(page.tracking_pixels).map(([key, pixel]) => (
          <script
            key={key}
            dangerouslySetInnerHTML={{ __html: pixel }}
          />
        ))}
      </Head>

      {/* Attribution Tracker Component */}
      <AttributionTracker 
        siteId={site.id}
        pageId={page.id}
        sessionId={sessionId}
      />

      {/* Template Renderer */}
      <TemplateRenderer
        template={page.templates}
        content={page.content}
        site={site}
        page={page}
        sessionId={sessionId}
      />
    </>
  )
}

export async function getServerSideProps({ params, req, query }) {
  try {
    const { slug } = params
    
    // Parse the slug to determine site and page
    // Expected format: [client-name] or [client-name, page-name]
    if (!slug || slug.length === 0) {
      return {
        notFound: true
      }
    }

    const [clientSlug, pageSlug] = slug
    
    // Get site by client slug
    const site = await getSiteBySlug(clientSlug)
    if (!site) {
      return {
        notFound: true
      }
    }

    // Check if site is active - return 404 for inactive sites
    if (site.status !== 'active') {
      return {
        notFound: true
      }
    }

    let page = null

    if (slug.length === 1) {
      // Root site page - get homepage
      try {
        page = await getSiteHomePage(site.id)
      } catch (err) {
        console.error('Error loading home page:', err)
        return {
          props: {
            error: 'No homepage found for this site'
          }
        }
      }
      
    } else if (slug.length === 2) {
      // Specific page
      try {
        page = await getSitePageBySlug(site.id, pageSlug)
      } catch (err) {
        console.error('Error loading page:', err)
        return {
          props: {
            error: `Page "${pageSlug}" not found`
          }
        }
      }
    } else {
      // Too many slug parts
      return {
        props: {
          error: `Invalid URL: ${slug.join('/')}`
        }
      }
    }

    if (!page) {
      return {
        props: {
          error: `Page not found: ${slug.join('/')}`
        }
      }
    }

    return {
      props: {
        site: JSON.parse(JSON.stringify(site)),
        page: JSON.parse(JSON.stringify(page))
      }
    }

  } catch (error) {
    console.error('Error in getServerSideProps:', error)
    return {
      props: {
        error: 'Internal server error'
      }
    }
  }
}