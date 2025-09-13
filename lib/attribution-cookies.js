// Site-specific attribution tracking with cookies
// Handles UTM parameters, click IDs, and referrer tracking

// Get all possible attribution parameters from URL
export function getAttributionFromURL() {
  if (typeof window === 'undefined') return null
  
  const urlParams = new URLSearchParams(window.location.search)
  const attribution = {}
  
  // UTM Parameters
  const utmSource = urlParams.get('utm_source')
  const utmMedium = urlParams.get('utm_medium')
  const utmCampaign = urlParams.get('utm_campaign')
  const utmTerm = urlParams.get('utm_term')
  const utmContent = urlParams.get('utm_content')
  
  // Click IDs and Tracking Parameters
  const gclid = urlParams.get('gclid')
  const gbraid = urlParams.get('gbraid')
  const wbraid = urlParams.get('wbraid')
  const fbclid = urlParams.get('fbclid')
  const msclkid = urlParams.get('msclkid')
  const msclikid = urlParams.get('msclikid') // Alternative spelling
  const dclid = urlParams.get('dclid') // DoubleClick
  const ttclid = urlParams.get('ttclid') // TikTok
  const twclid = urlParams.get('twclid') // Twitter
  const li_fat_id = urlParams.get('li_fat_id') // LinkedIn
  
  // Facebook Browser Parameters
  const fbc = urlParams.get('fbc') // Facebook Browser Cookie
  const fbp = urlParams.get('fbp') // Facebook Browser ID
  const fbEventId = urlParams.get('fbEventId') // Facebook Event ID
  
  // Campaign and Medium IDs
  const campaignId = urlParams.get('campaignId') || urlParams.get('campaign_id')
  const mediumId = urlParams.get('mediumId') || urlParams.get('medium_id')
  const medium = urlParams.get('medium')
  
  // Build attribution object only with available parameters
  if (utmSource) attribution.utmSource = utmSource
  if (utmMedium) attribution.utmMedium = utmMedium
  if (utmCampaign) attribution.utmCampaign = utmCampaign
  if (utmTerm) attribution.utmTerm = utmTerm
  if (utmContent) attribution.utmContent = utmContent
  
  if (gclid) attribution.gclid = gclid
  if (gbraid) attribution.gbraid = gbraid
  if (wbraid) attribution.wbraid = wbraid
  if (fbclid) attribution.fbclid = fbclid
  if (msclkid) attribution.msclikid = msclkid
  if (msclikid) attribution.msclikid = msclikid
  if (dclid) attribution.dclid = dclid
  if (ttclid) attribution.ttclid = ttclid
  if (twclid) attribution.twclid = twclid
  if (li_fat_id) attribution.li_fat_id = li_fat_id
  
  if (fbc) attribution.fbc = fbc
  if (fbp) attribution.fbp = fbp
  if (fbEventId) attribution.fbEventId = fbEventId
  
  if (campaignId) attribution.campaignId = campaignId
  if (mediumId) attribution.mediumId = mediumId
  if (medium) attribution.medium = medium
  
  // Add referrer, landing page, and system info
  attribution.referrer = document.referrer || ''
  attribution.url = window.location.href
  attribution.userAgent = navigator.userAgent
  attribution.ip = null // Will be set server-side
  attribution.timestamp = new Date().toISOString()
  
  return Object.keys(attribution).length > 4 ? attribution : null // Return only if we have more than just referrer, url, userAgent, timestamp
}

// Get cookie name for site-specific attribution
function getAttributionCookieName(siteId) {
  return `bowlnow_attribution_${siteId}`
}

// Get stored attribution data from cookie
export function getStoredAttribution(siteId) {
  if (typeof window === 'undefined') return null
  
  try {
    const cookieName = getAttributionCookieName(siteId)
    const cookieValue = getCookie(cookieName)
    
    if (cookieValue) {
      return JSON.parse(decodeURIComponent(cookieValue))
    }
  } catch (error) {
    console.error('Error parsing stored attribution:', error)
  }
  
  return null
}

// Save attribution data to site-specific cookie
export function saveAttribution(siteId, attributionData) {
  if (typeof window === 'undefined') return
  
  try {
    const cookieName = getAttributionCookieName(siteId)
    const cookieValue = encodeURIComponent(JSON.stringify(attributionData))
    
    // Set cookie for 30 days
    const expirationDate = new Date()
    expirationDate.setDate(expirationDate.getDate() + 30)
    
    document.cookie = `${cookieName}=${cookieValue}; expires=${expirationDate.toUTCString()}; path=/; SameSite=Lax`
    
    console.log('Attribution saved for site:', siteId, attributionData)
  } catch (error) {
    console.error('Error saving attribution:', error)
  }
}

// Update attribution data (preserves first touch, updates last touch)
export function updateAttribution(siteId, newAttributionData) {
  const stored = getStoredAttribution(siteId)
  
  if (!stored) {
    // First visit
    if (newAttributionData) {
      // Save as both first and last touch
      const attribution = {
        firstTouch: { ...newAttributionData },
        lastTouch: { ...newAttributionData },
        firstTouchTimestamp: newAttributionData.timestamp,
        lastTouchTimestamp: newAttributionData.timestamp,
        visitCount: 1
      }
      saveAttribution(siteId, attribution)
      return attribution
    } else {
      // No attribution data, create minimal tracking
      const timestamp = new Date().toISOString()
      const attribution = {
        firstTouch: { url: typeof window !== 'undefined' ? window.location.href : '', timestamp },
        lastTouch: { url: typeof window !== 'undefined' ? window.location.href : '', timestamp },
        firstTouchTimestamp: timestamp,
        lastTouchTimestamp: timestamp,
        visitCount: 1
      }
      saveAttribution(siteId, attribution)
      return attribution
    }
  } else {
    // Existing attribution - update last touch
    if (newAttributionData) {
      // Check if first touch is missing UTM data and current data has it
      let updatedFirstTouch = stored.firstTouch
      
      // If first touch has no UTM/click data but new data does, backfill first touch
      const firstTouchHasUTM = stored.firstTouch?.utmSource || stored.firstTouch?.gclid || stored.firstTouch?.fbclid
      const newDataHasUTM = newAttributionData.utmSource || newAttributionData.gclid || newAttributionData.fbclid
      
      if (!firstTouchHasUTM && newDataHasUTM) {
        console.log('Backfilling first touch with better attribution data')
        updatedFirstTouch = { ...newAttributionData }
      }
      
      // Update last touch with new data
      const attribution = {
        ...stored,
        firstTouch: updatedFirstTouch,
        lastTouch: { ...newAttributionData },
        lastTouchTimestamp: newAttributionData.timestamp,
        visitCount: (stored.visitCount || 1) + 1
      }
      saveAttribution(siteId, attribution)
      return attribution
    } else {
      // No new data, just increment visit count
      const timestamp = new Date().toISOString()
      const attribution = {
        ...stored,
        lastTouch: {
          ...stored.lastTouch,
          url: typeof window !== 'undefined' ? window.location.href : '',
          timestamp
        },
        lastTouchTimestamp: timestamp,
        visitCount: (stored.visitCount || 1) + 1
      }
      saveAttribution(siteId, attribution)
      return attribution
    }
  }
}

// Get complete attribution data for GHL contact creation
export function getAttributionForGHL(siteId) {
  // First try to get from URL
  const urlAttribution = getAttributionFromURL()
  
  // Update stored attribution if we have URL data
  if (urlAttribution) {
    updateAttribution(siteId, urlAttribution)
  }
  
  // Get the stored attribution (includes both first and last touch)
  let stored = getStoredAttribution(siteId)
  
  // If no stored attribution, create one even without URL params (for return visitors)
  if (!stored) {
    const timestamp = new Date().toISOString()
    const currentUrl = typeof window !== 'undefined' ? window.location.href : ''
    const referrer = typeof window !== 'undefined' ? document.referrer : ''
    
    const basicAttribution = {
      url: currentUrl,
      referrer: referrer,
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : '',
      timestamp: timestamp
    }
    
    const attribution = {
      firstTouch: { ...basicAttribution },
      lastTouch: { ...basicAttribution },
      firstTouchTimestamp: timestamp,
      lastTouchTimestamp: timestamp,
      visitCount: 1
    }
    
    saveAttribution(siteId, attribution)
    stored = attribution
  }
  
  if (!stored) return null
  
  // Ensure both first and last touch have complete data
  const firstTouch = stored.firstTouch || stored.lastTouch || {}
  const lastTouch = stored.lastTouch || stored.firstTouch || {}
  
  // Helper function to determine session source based on attribution data
  function determineSessionSource(touchData) {
    if (touchData.gclid || touchData.gbraid || touchData.wbraid) return 'Google Ads'
    if (touchData.fbclid || touchData.fbc || touchData.fbp) return 'Facebook Ads'
    if (touchData.msclikid) return 'Microsoft Ads'
    if (touchData.ttclid) return 'TikTok Ads'
    if (touchData.twclid) return 'Twitter Ads'
    if (touchData.li_fat_id) return 'LinkedIn Ads'
    if (touchData.dclid) return 'DoubleClick'
    if (touchData.utmSource) {
      // Map common UTM sources to session sources
      const source = touchData.utmSource.toLowerCase()
      if (source.includes('google')) return 'Google Ads'
      if (source.includes('facebook') || source.includes('meta')) return 'Facebook Ads'
      if (source.includes('instagram')) return 'Instagram'
      if (source.includes('youtube')) return 'YouTube'
      if (source.includes('linkedin')) return 'LinkedIn'
      if (source.includes('twitter')) return 'Twitter'
      if (source.includes('tiktok')) return 'TikTok'
      if (source.includes('email')) return 'Email'
      if (source.includes('sms')) return 'SMS'
      return 'Organic'
    }
    if (touchData.referrer && touchData.referrer !== '') return 'Referral'
    return 'Direct'
  }
  
  // Return in GHL format with both first and last touch (all required fields)
  return {
    attributionSource: {
      sessionSource: determineSessionSource(firstTouch),
      url: firstTouch.url || null,
      campaign: firstTouch.utmCampaign || null,
      utmSource: firstTouch.utmSource || null,
      utmMedium: firstTouch.utmMedium || null,
      utmContent: firstTouch.utmContent || null,
      utmTerm: firstTouch.utmTerm || null,
      utmKeyword: firstTouch.utmTerm || null, // Same as utmTerm
      utmMatchtype: null, // Not captured from URL
      referrer: firstTouch.referrer || null,
      campaignId: firstTouch.campaignId || null,
      fbclid: firstTouch.fbclid || null,
      gclid: firstTouch.gclid || null,
      msclikid: firstTouch.msclikid || null,
      dclid: firstTouch.dclid || null,
      fbc: firstTouch.fbc || null,
      fbp: firstTouch.fbp || null,
      fbEventId: firstTouch.fbEventId || null,
      userAgent: firstTouch.userAgent || null,
      ip: null, // Will be set server-side
      gaClientId: null, // Not captured
      gaSessionId: null, // Not captured
      medium: firstTouch.medium || firstTouch.utmMedium || 'form',
      mediumId: firstTouch.mediumId || null,
      adName: null, // Not captured from URL
      adGroupId: null, // Not captured from URL
      adId: null, // Not captured from URL
      gbraid: firstTouch.gbraid || null,
      wbraid: firstTouch.wbraid || null
    },
    lastAttributionSource: {
      sessionSource: determineSessionSource(lastTouch),
      url: lastTouch.url || null,
      campaign: lastTouch.utmCampaign || null,
      utmSource: lastTouch.utmSource || null,
      utmMedium: lastTouch.utmMedium || null,
      utmContent: lastTouch.utmContent || null,
      utmTerm: lastTouch.utmTerm || null,
      utmKeyword: lastTouch.utmTerm || null, // Same as utmTerm
      utmMatchtype: null, // Not captured from URL
      referrer: lastTouch.referrer || null,
      campaignId: lastTouch.campaignId || null,
      fbclid: lastTouch.fbclid || null,
      gclid: lastTouch.gclid || null,
      msclikid: lastTouch.msclikid || null,
      dclid: lastTouch.dclid || null,
      fbc: lastTouch.fbc || null,
      fbp: lastTouch.fbp || null,
      fbEventId: lastTouch.fbEventId || null,
      userAgent: lastTouch.userAgent || null,
      ip: null, // Will be set server-side
      gaClientId: null, // Not captured
      gaSessionId: null, // Not captured
      medium: lastTouch.medium || lastTouch.utmMedium || 'form',
      mediumId: lastTouch.mediumId || null,
      adName: null, // Not captured from URL
      adGroupId: null, // Not captured from URL
      adId: null, // Not captured from URL
      gbraid: lastTouch.gbraid || null,
      wbraid: lastTouch.wbraid || null
    },
    visitCount: stored.visitCount || 1,
    firstTouchTimestamp: stored.firstTouchTimestamp,
    lastTouchTimestamp: stored.lastTouchTimestamp
  }
}

// Helper function to get cookie value
function getCookie(name) {
  if (typeof document === 'undefined') return null
  
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  
  if (parts.length === 2) {
    return parts.pop().split(';').shift()
  }
  
  return null
}

// Clear attribution data for a site (useful for testing)
export function clearAttribution(siteId) {
  if (typeof window === 'undefined') return
  
  const cookieName = getAttributionCookieName(siteId)
  document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
  
  console.log('Attribution cleared for site:', siteId)
}

// Debug function to view all attribution data
export function debugAttribution(siteId) {
  if (typeof window === 'undefined') return null
  
  const urlAttribution = getAttributionFromURL()
  const storedAttribution = getStoredAttribution(siteId)
  const ghlFormatted = getAttributionForGHL(siteId)
  
  console.log('=== ATTRIBUTION DEBUG ===')
  console.log('Site ID:', siteId)
  console.log('URL Attribution:', urlAttribution)
  console.log('Stored Attribution:', storedAttribution)
  console.log('GHL Formatted:', ghlFormatted)
  console.log('Cookie Name:', getAttributionCookieName(siteId))
  console.log('Current URL:', window.location.href)
  console.log('=========================')
  
  return {
    siteId,
    urlAttribution,
    storedAttribution,
    ghlFormatted,
    cookieName: getAttributionCookieName(siteId),
    currentUrl: window.location.href
  }
}

// Force update attribution (useful for testing)
export function forceUpdateAttribution(siteId) {
  const urlAttribution = getAttributionFromURL()
  
  if (urlAttribution) {
    console.log('Forcing attribution update with URL data:', urlAttribution)
    return updateAttribution(siteId, urlAttribution)
  } else {
    console.log('No URL attribution found to force update')
    return getStoredAttribution(siteId)
  }
}