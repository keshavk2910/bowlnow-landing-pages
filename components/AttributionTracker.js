import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { getAttributionFromURL, updateAttribution, getAttributionForGHL } from '../lib/attribution-cookies'

export default function AttributionTracker({ siteId, pageId, sessionId }) {
  const router = useRouter()

  useEffect(() => {
    if (!sessionId || !siteId) return

    const trackAttribution = async () => {
      try {
        // Get attribution from URL if present
        const urlAttribution = getAttributionFromURL()
        console.log('URL Attribution found:', urlAttribution)
        
        // Update cookie-based attribution (preserves first touch, updates last touch)
        const attribution = updateAttribution(siteId, urlAttribution)
        console.log('Attribution after update:', attribution)
        
        // Get the complete attribution data for tracking
        const ghlAttribution = getAttributionForGHL(siteId)
        console.log('GHL Attribution formatted:', ghlAttribution)
        
        // Only track if we have attribution data
        if (ghlAttribution) {
          // Store in localStorage for TemplateRenderer access
          localStorage.setItem('attribution_data', JSON.stringify({
            ...ghlAttribution,
            utm_params: ghlAttribution.lastAttributionSource
          }))
          
          // Send attribution data to our API for database storage
          const attributionData = {
            session_id: sessionId,
            page_id: pageId,
            utm_source: ghlAttribution.lastAttributionSource.utmSource,
            utm_medium: ghlAttribution.lastAttributionSource.utmMedium,
            utm_campaign: ghlAttribution.lastAttributionSource.utmCampaign,
            utm_term: ghlAttribution.lastAttributionSource.utmTerm,
            utm_content: ghlAttribution.lastAttributionSource.utmContent,
            gclid: ghlAttribution.lastAttributionSource.gclid,
            fbclid: ghlAttribution.lastAttributionSource.fbclid,
            referrer_url: ghlAttribution.lastAttributionSource.referrer,
            landing_page_url: ghlAttribution.lastAttributionSource.url,
            ip_address: null, // Will be set server-side
            user_agent: navigator.userAgent,
            first_touch: !attribution || attribution.visitCount === 1,
            last_touch: true
          }

          // Remove null/undefined values
          Object.keys(attributionData).forEach(key => {
            if (attributionData[key] === null || attributionData[key] === undefined || attributionData[key] === '') {
              delete attributionData[key]
            }
          })

          // Send to API only if we have meaningful data
          if (Object.keys(attributionData).length > 3) { // More than just session_id, page_id, user_agent
            await fetch('/api/tracking/attribution', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(attributionData)
            })
          }
        }

        // Track page session
        const sessionData = {
          session_id: sessionId,
          page_id: pageId,
          utm_params: ghlAttribution?.lastAttributionSource || {}
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