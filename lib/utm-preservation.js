// UTM Parameter Preservation Script
// Automatically adds current UTM parameters to all internal links

// Standard UTM parameters (module scope to avoid redeclaration)
const utmKeys = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
];

// Click IDs and tracking parameters (module scope to avoid redeclaration)
const trackingKeys = [
  'gclid',
  'gbraid',
  'wbraid',
  'fbclid',
  'msclkid',
  'msclikid',
  'dclid',
  'ttclid',
  'twclid',
  'li_fat_id',
  'fbc',
  'fbp',
  'fbEventId',
  'campaignId',
  'campaign_id',
  'mediumId',
  'medium_id',
];

// Get all UTM and tracking parameters from current URL
function getCurrentUTMParams() {
  if (typeof window === 'undefined') return '';

  const urlParams = new URLSearchParams(window.location.search);
  const utmParams = new URLSearchParams();

  // Collect all available parameters
  [...utmKeys, ...trackingKeys].forEach((key) => {
    const value = urlParams.get(key);
    if (value) {
      utmParams.set(key, value);
    }
  });

  return utmParams.toString();
}

// Check if a URL should have UTM parameters added
function shouldAddUTMParams(url, href) {
  if (!url || !href) return false;

  // Skip mailto and tel links
  if (href.startsWith('mailto:') || href.startsWith('tel:')) {
    return false;
  }

  // Skip anchor links on same page
  if (href.startsWith('#')) {
    return false;
  }

  // Skip javascript: links
  if (href.startsWith('javascript:')) {
    return false;
  }

  // Skip if it's not a valid URL and not a relative/anchor/query link
  try {
    new URL(href);
  } catch (e) {
    if (
      !href.startsWith('/') &&
      !href.startsWith('#') &&
      !href.startsWith('?')
    ) {
      return false;
    }
  }

  // Include ALL other links (both internal and external)
  return true;
}

// Add UTM parameters to a URL
function addUTMParamsToURL(href, utmParams) {
  if (!utmParams) return href;

  try {
    // Handle both relative and absolute URLs
    let url;

    if (href.startsWith('http://') || href.startsWith('https://')) {
      // Absolute URL
      url = new URL(href);
    } else if (href.startsWith('/')) {
      // Relative URL from root
      url = new URL(href, window.location.origin);
    } else {
      // Relative URL from current path
      url = new URL(href, window.location.href);
    }

    const existingParams = new URLSearchParams(url.search);
    const newParams = new URLSearchParams(utmParams);

    // Add new UTM params, preserving existing ones (don't overwrite)
    newParams.forEach((value, key) => {
      if (!existingParams.has(key)) {
        existingParams.set(key, value);
      }
    });

    // Rebuild the URL
    url.search = existingParams.toString();

    // Return appropriate format
    if (href.startsWith('http://') || href.startsWith('https://')) {
      // Return full URL for external links
      return url.toString();
    } else {
      // Return relative URL for internal links
      return url.pathname + url.search + url.hash;
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error adding UTM params to URL:', error);
    return href;
  }
}

// Process all links on the page
function preserveUTMParams() {
  const utmParams = getCurrentUTMParams();

  if (!utmParams) {
    // eslint-disable-next-line no-console
    // console.log('No UTM parameters to preserve');
    return;
  }

  // eslint-disable-next-line no-console
  // console.log('Preserving UTM parameters:', utmParams);

  // Get all anchor tags
  const links = document.querySelectorAll('a[href]');
  let internalCount = 0;
  let externalCount = 0;
  let skippedCount = 0;

  links.forEach((link) => {
    const href = link.getAttribute('href');

    if (shouldAddUTMParams(window.location.href, href)) {
      const newHref = addUTMParamsToURL(href, utmParams);
      if (newHref !== href) {
        link.setAttribute('href', newHref);

        // Track internal vs external updates
        if (href.startsWith('http://') || href.startsWith('https://')) {
          externalCount++;
        } else {
          internalCount++;
        }
      }
    } else {
      skippedCount++;
    }
  });

  // eslint-disable-next-line no-console
  // console.log(`UTM Parameters added to:`);
  // console.log(`- ${internalCount} internal links`);
  // console.log(`- ${externalCount} external links`);
  // console.log(`- ${skippedCount} links skipped (mailto/tel/anchor)`);
}

// Initialize UTM preservation
export function initUTMPreservation() {
  if (typeof window === 'undefined') return;

  // Run on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', preserveUTMParams);
  } else {
    preserveUTMParams();
  }

  // Re-run when new content is added dynamically
  const observer = new MutationObserver((mutations) => {
    let hasNewLinks = false;

    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (
            node.tagName === 'A' ||
            (typeof node.querySelector === 'function' &&
              node.querySelector('a[href]'))
          ) {
            hasNewLinks = true;
          }
        }
      });
    });

    if (hasNewLinks) {
      setTimeout(preserveUTMParams, 100); // Small delay to ensure DOM is updated
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // eslint-disable-next-line no-console
  // console.log('UTM preservation initialized');
}

// Manual function to update specific links (useful for React components)
export function updateLinkWithUTM(href) {
  const utmParams = getCurrentUTMParams();
  if (!utmParams || !shouldAddUTMParams(window.location.href, href)) {
    return href;
  }
  return addUTMParamsToURL(href, utmParams);
}

// Clean up function
export function cleanupUTMPreservation() {
  // Remove event listeners if needed
  // Currently using MutationObserver which doesn't need manual cleanup
}

export default {
  init: initUTMPreservation,
  updateLink: updateLinkWithUTM,
  cleanup: cleanupUTMPreservation,
};
