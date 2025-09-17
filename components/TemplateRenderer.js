import { useState, useEffect } from 'react';
import LandingPageTemplate from './templates/LandingPageTemplate';
import PartiesTemplate from './templates/PartiesTemplate';
import EventsTemplate from './templates/EventsTemplate';
import BookingsTemplate from './templates/BookingsTemplate';
import CheckoutTemplate from './templates/CheckoutTemplate';
import BowlingTemplate from './templates/BowlingTemplate';
import TemplatePageOne from './templates/TemplatePageOne';
import BuilderTemplateRenderer from './builder/BuilderTemplateRenderer';

const TEMPLATE_COMPONENTS = {
  // By component file name (from database mapping)
  'LandingPageTemplate': LandingPageTemplate,
  'PartiesTemplate': PartiesTemplate, 
  'EventsTemplate': EventsTemplate,
  'BookingsTemplate': BookingsTemplate,
  'CheckoutTemplate': CheckoutTemplate,
  'BowlingTemplate': BowlingTemplate,
  'TemplatePageOne': TemplatePageOne,
  
  // Fallback by type (for backward compatibility)
  landing: LandingPageTemplate,
  parties: PartiesTemplate,
  events: EventsTemplate,
  bookings: BookingsTemplate,
  checkout: CheckoutTemplate,
  bowling: BowlingTemplate,
  'template-page-one': TemplatePageOne,
};

export default function TemplateRenderer({
  template,
  content,
  site,
  page,
  sessionId,
}) {
  const [loading, setLoading] = useState(false);
  const [TemplateComponent, setTemplateComponent] = useState(null);
  const [componentLoading, setComponentLoading] = useState(true);

  // Dynamic template component loading
  useEffect(() => {
    async function loadTemplateComponent() {
      try {
        let ComponentToUse = null;

        // First try to use component_file from database for dynamic loading
        if (template?.component_file) {
          try {
            const dynamicImport = await import(`./templates/${template.component_file}`);
            ComponentToUse = dynamicImport.default || dynamicImport[template.component_file];
            console.log(`Dynamically loaded component: ${template.component_file}`);
          } catch (importError) {
            console.warn(`Failed to dynamically import ${template.component_file}:`, importError);
            // Fall back to static mapping
          }
        }

        // Fallback to static mapping if dynamic import failed
        if (!ComponentToUse) {
          // Try static mapping by component_file first, then by type
          if (template?.component_file && TEMPLATE_COMPONENTS[template.component_file]) {
            ComponentToUse = TEMPLATE_COMPONENTS[template.component_file];
            console.log(`Using static mapping for component: ${template.component_file}`);
          } else {
            const templateType = template?.type || page?.page_type || 'landing';
            ComponentToUse = TEMPLATE_COMPONENTS[templateType] || LandingPageTemplate;
            console.log(`Using type-based fallback for type: ${templateType}`);
          }
        }

        setTemplateComponent(() => ComponentToUse);
      } catch (error) {
        console.error('Error loading template component:', error);
        // Ultimate fallback
        setTemplateComponent(() => LandingPageTemplate);
      } finally {
        setComponentLoading(false);
      }
    }

    loadTemplateComponent();
  }, [template, page]);

  async function handleFormSubmit(formData, formType = 'lead') {
    setLoading(true);

    try {
      // Get attribution data from cookies (site-specific)
      const { getAttributionForGHL } = await import(
        '../lib/attribution-cookies'
      );
      const ghlAttribution = getAttributionForGHL(site.id);

      const submissionData = {
        session_id: sessionId,
        site_id: site.id,
        page_id: page.id,
        form_data: formData,
        form_type: formType,
        utm_data: ghlAttribution?.lastAttributionSource || {},
        attribution_data: ghlAttribution || {},
      };

      const response = await fetch('/api/forms/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      const result = await response.json();

      // Track conversion event (non-blocking)
      fetch('/api/tracking/conversion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          conversion_type: 'form_submit',
          page_id: page.id,
          attribution_data: ghlAttribution || {},
        }),
      }).catch(error => console.error('Conversion tracking error:', error));

      // Fire tracking pixels for form submission
      if (typeof window !== 'undefined') {
        // Facebook Pixel
        if (window.fbq) {
          window.fbq('track', 'Lead', {
            content_name: page?.name || site.client_name,
            content_category: template?.type || 'page',
          });
        }

        // Google Analytics
        if (window.gtag) {
          window.gtag('event', 'generate_lead', {
            currency: 'USD',
            value: 0,
            content_name: page?.name || site.client_name,
          });
        }
      }

      return result;
    } catch (error) {
      console.error('Error submitting form:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function handleCheckoutClick(planId, planData) {
    // Checkout functionality for builder templates
    setLoading(true);

    try {
      const attributionData = JSON.parse(
        localStorage.getItem('attribution_data') || '{}'
      );

      const checkoutResponse = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan_id: planId,
          session_id: sessionId,
          site_id: site.id,
          attribution_data: ghlAttribution || {},
          success_url: `${window.location.origin}/${site.slug}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: window.location.href,
        }),
      });

      if (!checkoutResponse.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await checkoutResponse.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error starting checkout:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  // Check if this is a builder template
  if (template?.is_builder_template && template?.builder_data) {
    return (
      <BuilderTemplateRenderer
        builderData={template.builder_data}
        site={site}
        page={page}
        sessionId={sessionId}
        onFormSubmit={handleFormSubmit}
        onCheckoutClick={handleCheckoutClick}
      />
    );
  }

  // Common props passed to all templates
  const templateProps = {
    content,
    site,
    page,
    sessionId,
    onFormSubmit: handleFormSubmit,
    onCheckoutClick: handleCheckoutClick,
    loading,
  };

  // Show loading state while component is being loaded
  if (componentLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading template...</p>
        </div>
      </div>
    );
  }

  async function handleFormSubmit(formData, formType = 'lead') {
    setLoading(true);

    try {
      // Get attribution data from cookies (site-specific)
      const { getAttributionForGHL } = await import(
        '../lib/attribution-cookies'
      );
      const ghlAttribution = getAttributionForGHL(site.id);

      const submissionData = {
        session_id: sessionId,
        site_id: site.id,
        page_id: page.id,
        form_data: formData,
        form_type: formType,
        utm_data: ghlAttribution?.lastAttributionSource || {},
        attribution_data: ghlAttribution || {},
      };

      const response = await fetch('/api/forms/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      const result = await response.json();

      // Track conversion event (non-blocking)
      fetch('/api/tracking/conversion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          conversion_type: 'form_submit',
          page_id: page.id,
          attribution_data: ghlAttribution || {},
        }),
      }).catch(error => console.error('Conversion tracking error:', error));

      // Fire tracking pixels for form submission
      if (typeof window !== 'undefined') {
        const currentTemplateType = template?.type || page?.page_type || 'landing'
        
        // Facebook Pixel
        if (window.fbq) {
          window.fbq('track', 'Lead', {
            content_name: page?.name || site.client_name,
            content_category: currentTemplateType,
          });
        }

        // Google Analytics
        if (window.gtag) {
          window.gtag('event', 'generate_lead', {
            currency: 'USD',
            value: 0,
            content_name: page?.name || site.client_name,
          });
        }
      }

      return result;
    } catch (error) {
      console.error('Error submitting form:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function handleCheckoutClick(planId, planData) {
    setLoading(true);

    try {
      // Get attribution data
      const attributionData = JSON.parse(
        localStorage.getItem('attribution_data') || '{}'
      );

      // Track checkout start conversion
      await fetch('/api/tracking/conversion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          conversion_type: 'checkout_start',
          conversion_value: planData.price,
          page_id: page.id,
          attribution_data: ghlAttribution || {},
          metadata: { plan_id: planId, plan_name: planData.name },
        }),
      });

      // Fire tracking pixels for checkout start
      if (typeof window !== 'undefined') {
        const currentTemplateType = template?.type || page?.page_type || 'landing'
        
        // Facebook Pixel
        if (window.fbq) {
          window.fbq('track', 'InitiateCheckout', {
            value: planData.price,
            currency: planData.currency || 'USD',
            content_name: planData.name,
            content_category: currentTemplateType,
          });
        }

        // Google Analytics
        if (window.gtag) {
          window.gtag('event', 'begin_checkout', {
            currency: planData.currency || 'USD',
            value: planData.price,
            items: [
              {
                item_id: planId,
                item_name: planData.name,
                category: currentTemplateType,
                quantity: 1,
                price: planData.price,
              },
            ],
          });
        }
      }

      // Create checkout session
      const checkoutResponse = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan_id: planId,
          session_id: sessionId,
          site_id: site.id,
          attribution_data: ghlAttribution || {},
          success_url: `${window.location.origin}/${site.slug}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: window.location.href,
        }),
      });

      if (!checkoutResponse.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await checkoutResponse.json();

      // Redirect to Stripe checkout
      window.location.href = url;
    } catch (error) {
      console.error('Error starting checkout:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  if (!TemplateComponent) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-gray-900 mb-4'>
            Template Not Found
          </h1>
          <p className='text-gray-600'>
            Template type &quot;{templateType}&quot; is not supported.
          </p>
        </div>
      </div>
    );
  }

  return <TemplateComponent {...templateProps} />;
}
