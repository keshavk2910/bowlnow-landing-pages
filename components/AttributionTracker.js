import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function AttributionTracker({ siteId, pageId, sessionId }) {
  const router = useRouter()

  useEffect(() => {
    if (!sessionId) return

    const trackAttribution = async () => {
      try {
        // Get URL parameters
        const urlParams = new URLSearchParams(window.location.search)
        const referrer = document.referrer
        
        // Collect attribution data
        const attributionData = {
          session_id: sessionId,
          page_id: pageId,
          utm_source: urlParams.get('utm_source'),
          utm_medium: urlParams.get('utm_medium'),
          utm_campaign: urlParams.get('utm_campaign'),
          utm_term: urlParams.get('utm_term'),
          utm_content: urlParams.get('utm_content'),
          gclid: urlParams.get('gclid'),
          fbclid: urlParams.get('fbclid'),
          referrer_url: referrer,
          landing_page_url: window.location.href,
          user_agent: navigator.userAgent,
          timestamp: new Date().toISOString()
        }

        // Remove null/undefined values
        Object.keys(attributionData).forEach(key => {
          if (attributionData[key] === null || attributionData[key] === undefined) {
            delete attributionData[key]
          }
        })

        // Only track if we have meaningful attribution data
        const hasAttributionData = attributionData.utm_source || 
                                 attributionData.utm_medium || 
                                 attributionData.gclid || 
                                 attributionData.fbclid || 
                                 attributionData.referrer_url

        if (hasAttributionData) {
          // Send attribution data to our API
          await fetch('/api/tracking/attribution', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(attributionData)
          })

          // Store attribution data in localStorage for session persistence
          const existingAttribution = localStorage.getItem('attribution_data')
          if (!existingAttribution) {
            localStorage.setItem('attribution_data', JSON.stringify(attributionData))
          }
        }

        // Track page session
        const sessionData = {
          session_id: sessionId,
          page_id: pageId,
          utm_params: {
            utm_source: attributionData.utm_source,
            utm_medium: attributionData.utm_medium,
            utm_campaign: attributionData.utm_campaign,
            utm_term: attributionData.utm_term,
            utm_content: attributionData.utm_content,
            gclid: attributionData.gclid,
            fbclid: attributionData.fbclid
          }
        }

        await fetch('/api/tracking/page-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(sessionData)
        })

      } catch (error) {
        console.error('Error tracking attribution:', error)
      }
    }

    // Track on page load
    trackAttribution()

  }, [siteId, pageId, sessionId])

  // Track page views for analytics
  useEffect(() => {
    const handleRouteChange = (url) => {
      // Track page view
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('config', 'GA_TRACKING_ID', {
          page_path: url,
        })
      }

      // Track Facebook pixel page view
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'PageView')
      }
    }

    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  return null // This component doesn't render anything visible
}