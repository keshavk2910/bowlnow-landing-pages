import {
  createFormSubmission,
  createCustomer,
  getCustomerByEmail,
  getPageSession,
  updatePageSession,
} from '../../../lib/database';
import {
  createGHLContact,
  createGHLOpportunity,
} from '../../../lib/gohighlevel-location';
import { createRouteHandlerClient } from '../../../lib/supabase';

export default async function handler(req, res) {
  console.log('=== FORM SUBMISSION START ===');

  if (req.method !== 'POST') {
    console.log('ERROR: Invalid method:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Request body received:', JSON.stringify(req.body, null, 2));

    const {
      session_id,
      site_id,
      page_id,
      form_data,
      form_type = 'lead',
      utm_data = {},
      attribution_data = {},
    } = req.body;

    console.log('Extracted data:', {
      session_id,
      site_id,
      page_id,
      form_data,
      form_type,
      utm_data,
      attribution_data,
    });

    // Validate required fields
    if (!session_id || !site_id || !form_data || !form_data.email) {
      console.log('ERROR: Missing required fields', {
        session_id: !!session_id,
        site_id: !!site_id,
        form_data: !!form_data,
        email: !!form_data?.email,
      });
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log('Validation passed, proceeding with form submission');

    // Get site and customer data in parallel for better performance
    console.log('Fetching site and customer data...');
    const [site, existingCustomer] = await Promise.all([
      getSite(site_id),
      getCustomerByEmail(site_id, form_data.email),
    ]);

    console.log('Site found:', !!site);
    console.log('Existing customer found:', !!existingCustomer);

    if (!site) {
      console.log('ERROR: Site not found for ID:', site_id);
      return res.status(404).json({ error: 'Site not found' });
    }

    // Create customer if doesn't exist
    let customer = existingCustomer;
    if (!customer) {
      customer = await createCustomer({
        site_id,
        email: form_data.email,
        name:
          form_data.name ||
          `${form_data.firstName || ''} ${form_data.lastName || ''}`.trim(),
        phone: form_data.phone,
        attribution_data,
        funnel_entry_point: page_id,
      });
    }

    // Update page session with customer
    if (session_id) {
      const session = await getPageSession(session_id);
      if (session && !session.customer_id) {
        await updatePageSession(session_id, {
          customer_id: customer.id,
        });
      }
    }

    // Create form submission record
    const submissionData = {
      session_id,
      site_id,
      page_id,
      customer_id: customer.id,
      form_data,
      utm_data,
      synced_to_ghl: false,
    };

    console.log('Creating form submission with data:', submissionData);
    const submission = await createFormSubmission(submissionData);
    console.log('Form submission created successfully:', submission.id);

    // Start GHL sync in background for faster response
    if (site.ghl_location_id && site.ghl_location_token_encrypted) {
      console.log('Starting background GHL sync');
      // Run GHL sync asynchronously to avoid blocking response
      syncToGHLAsync(
        site,
        page_id,
        form_data,
        form_type,
        customer,
        attribution_data,
        session_id,
        submission.id
      ).catch((error) => console.error('Background GHL sync failed:', error));
    } else {
      console.log('GHL sync skipped - missing location ID or token');
    }

    console.log('=== FORM SUBMISSION SUCCESS ===');
    // Return immediately without waiting for GHL sync
    res.status(200).json({
      success: true,
      submission: submission,
      customer: customer,
      message:
        'Form submitted successfully, processing integrations in background',
    });
  } catch (error) {
    console.error('=== FORM SUBMISSION ERROR ===');
    console.error('Error details:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({
      error: 'Failed to process form submission',
      details: error.message,
    });
  }
}

// Async GHL sync function for background processing
async function syncToGHLAsync(
  site,
  page_id,
  form_data,
  form_type,
  customer,
  attribution_data,
  session_id,
  submissionId
) {
  try {
    console.log('Starting async GHL sync for customer:', customer.email);

    // Get page name and pipeline config in single query
    let pageName = 'Unknown';
    let pageSpecificPipeline = null;
    let pageSpecificMappings = {};

    if (page_id) {
      const supabase = createRouteHandlerClient();
      const { data: pageData } = await supabase
        .from('site_pages')
        .select('name, pipeline_id, stage_mappings')
        .eq('id', page_id)
        .single();

      pageName = pageData?.name || 'Unknown';
      pageSpecificPipeline = pageData?.pipeline_id;
      pageSpecificMappings = pageData?.stage_mappings || {};
    }

    // Create contact in GHL using location-specific token
    const ghlContact = await createGHLContact(
      site.ghl_location_id,
      {
        email: form_data.email,
        name: customer.name,
        phone: form_data.phone,
        organization: form_data.organization, // Organization field for contact
        address: form_data.address,
        tags: ['BowlNow-lead', `${pageName} - ${site.client_name} - BowlNow`],
        attribution: attribution_data,
      },
      site.ghl_location_token_encrypted
    );

    const ghlContactId = ghlContact.id;

    // Update customer with GHL contact ID
    await updateCustomer(customer.id, {
      ghl_contact_id: ghlContactId,
    });

    // Determine pipeline configuration
    let pipelineId = pageSpecificPipeline || site.default_pipeline_id;
    let stageMappings = {};
    if (Object.keys(pageSpecificMappings).length > 0) {
      stageMappings = pageSpecificMappings;
    } else {
      stageMappings = site.default_stage_mappings;
    }

    console.log('Stage mappings:', stageMappings);
    // console.log('Pipeline configuration:', {
    //   pageSpecificPipeline,
    //   pageSpecificMappings,
    //   siteDefaultPipeline: site.default_pipeline_id,
    //   siteDefaultStageMappings: site.default_stage_mappings,
    // });

    let ghlOpportunityId = null;

    // Create opportunity if pipeline configured
    if (pipelineId && stageMappings.form_submitted) {
      console.log('Creating GHL opportunity with:', {
        pipelineId,
        stageId: stageMappings.form_submitted,
        contactId: ghlContactId,
      });

      try {
        const ghlOpportunity = await createGHLOpportunity(
          site.ghl_location_id,
          {
            pipelineId: pipelineId,
            stageId: stageMappings.form_submitted,
            title: `${customer.name} - ${form_type} Form`,
            contactId: ghlContactId,
            monetaryValue: 0,
            // Pass all form data for custom fields mapping
            organization: form_data.organization,
            type_of_event: form_data.type_of_event,
            preferred_date: form_data.preferred_date,
            preferred_time: form_data.preferred_time,
            number_of_guests: form_data.number_of_guests,
            additional_information: form_data.additional_information,
            estimated_value: form_data.estimated_value,
            page_name: pageName,
            form_type: form_type,
            session_id: session_id,
          },
          site.ghl_location_token_encrypted
        );

        ghlOpportunityId = ghlOpportunity.id;
        console.log('GHL opportunity created successfully:', ghlOpportunityId);
      } catch (opportunityError) {
        console.error('Failed to create GHL opportunity:', opportunityError);
        // Continue without failing the entire sync
      }
    } else {
      console.log('Opportunity creation skipped:', {
        hasPipelineId: !!pipelineId,
        hasFormSubmittedStage: !!stageMappings.form_submitted,
        pipelineId,
        formSubmittedStage: stageMappings.form_submitted,
      });
    }

    // Update submission as synced
    await updateFormSubmission(submissionId, {
      ghl_contact_id: ghlContactId,
      ghl_opportunity_id: ghlOpportunityId,
      synced_to_ghl: true,
    });

    console.log('Async GHL sync completed successfully');
  } catch (error) {
    console.error('Async GHL sync error:', error);

    // Update submission with error
    await updateFormSubmission(submissionId, {
      sync_error: error.message,
    });
  }
}

// Helper functions
async function getSite(siteId) {
  const supabase = createRouteHandlerClient();

  const { data, error } = await supabase
    .from('sites')
    .select(
      '*, default_stage_mappings, default_pipeline_id, default_pipeline_name'
    )
    .eq('id', siteId)
    .single();

  console.log('Site data retrieved:', {
    id: data?.id,
    slug: data?.slug,
    default_pipeline_id: data?.default_pipeline_id,
    default_stage_mappings: data?.default_stage_mappings,
  });

  if (error) return null;
  return data;
}

async function updateCustomer(customerId, updates) {
  const supabase = createRouteHandlerClient();

  const { data, error } = await supabase
    .from('customers')
    .update(updates)
    .eq('id', customerId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function updateFormSubmission(submissionId, updates) {
  const supabase = createRouteHandlerClient();

  const { data, error } = await supabase
    .from('form_submissions')
    .update(updates)
    .eq('id', submissionId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
