import {
  createFormSubmission,
  createCustomer,
  getCustomerByEmail,
  getPageSession,
  updatePageSession,
  getSitePipelineConfigBySite,
} from '../../../lib/database';
import {
  createGHLContact,
  createGHLOpportunity,
} from '../../../lib/gohighlevel-location';
import { createRouteHandlerClient } from '../../../lib/supabase';
import { safeDecryptToken } from '../../../lib/encryption';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      session_id,
      site_id,
      page_id,
      form_data,
      form_type = 'lead',
      utm_data = {},
      attribution_data = {},
    } = req.body;

    // Validate required fields
    if (!session_id || !site_id || !form_data || !form_data.email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get site for GHL integration
    const site = await getSite(site_id);
    if (!site) {
      return res.status(404).json({ error: 'Site not found' });
    }

    // Get or create customer
    let customer = await getCustomerByEmail(site_id, form_data.email);

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

    const submission = await createFormSubmission(submissionData);

    // Sync to GoHighLevel
    let ghlContactId = null;
    let ghlOpportunityId = null;

    if (site.ghl_location_id && site.ghl_location_token_encrypted) {
      try {
        console.log('DEBUG: Site GHL Config:', {
          locationId: site.ghl_location_id,
          hasToken: !!site.ghl_location_token_encrypted,
          tokenLength: site.ghl_location_token_encrypted?.length,
        });

        // Get page name for readable tagging
        let pageName = 'Unknown';
        if (page_id) {
          const supabase = createRouteHandlerClient();
          const { data: pageData } = await supabase
            .from('site_pages')
            .select('name')
            .eq('id', page_id)
            .single();

          pageName = pageData?.name || 'Unknown';
        }
        console.log('DEBUG: Attribution Data received:', attribution_data);
        console.log('DEBUG: Attribution has attributionSource?', !!attribution_data.attributionSource);
        console.log('DEBUG: Attribution has lastAttributionSource?', !!attribution_data.lastAttributionSource);
        // Create contact in GHL using location-specific token
        const ghlContact = await createGHLContact(
          site.ghl_location_id,
          {
            email: form_data.email,
            name: customer.name,
            phone: form_data.phone,
            address: form_data.address,
            tags: [
              'BowlNow-lead',
              `${pageName} - ${site.client_name} - BowlNow`,
            ],
            attribution: attribution_data, // Pass the complete attribution object
            customFields: {
              page_name: pageName,
              form_type: form_type,
              session_id: session_id,
              visit_count: attribution_data.visitCount || 1,
            },
          },
          site.ghl_location_token_encrypted
        );

        ghlContactId = ghlContact.id;

        // Update customer with GHL contact ID
        await updateCustomer(customer.id, {
          ghl_contact_id: ghlContactId,
        });

        // Get pipeline configuration (page-specific or site default)
        let pipelineId = null
        let stageMappings = {}
        
        // First check if page has specific pipeline configuration
        if (page_id) {
          const supabase = createRouteHandlerClient()
          const { data: pageData } = await supabase
            .from('site_pages')
            .select('pipeline_id, stage_mappings')
            .eq('id', page_id)
            .single()
          
          if (pageData?.pipeline_id) {
            pipelineId = pageData.pipeline_id
            stageMappings = pageData.stage_mappings || {}
            console.log('Using page-specific pipeline:', pipelineId)
          }
        }
        
        // Fallback to site default pipeline if no page-specific config
        if (!pipelineId && site.default_pipeline_id) {
          pipelineId = site.default_pipeline_id
          stageMappings = site.default_stage_mappings || {}
          console.log('Using site default pipeline:', pipelineId)
        }
        
        // Create opportunity in GHL pipeline if configured
        if (pipelineId && stageMappings.form_submitted) {
          console.log('Creating opportunity with pipeline:', pipelineId, 'stage:', stageMappings.form_submitted)
          
          const ghlOpportunity = await createGHLOpportunity(
            site.ghl_location_id,
            {
              pipelineId: pipelineId,
              stageId: stageMappings.form_submitted,
              title: `${customer.name} - ${form_type} Form`,
              contactId: ghlContactId,
              monetaryValue: form_data.estimated_value || 0,
              customFields: {
                form_type: form_type,
                submission_date: new Date().toISOString(),
                page_name: pageName,
                pipeline_source: pipelineId === site.default_pipeline_id ? 'site_default' : 'page_specific',
                session_id: session_id,
              },
            },
            site.ghl_location_token_encrypted
          );

          ghlOpportunityId = ghlOpportunity.id;
        }

        // Update submission as synced
        await updateFormSubmission(submission.id, {
          ghl_contact_id: ghlContactId,
          ghl_opportunity_id: ghlOpportunityId,
          synced_to_ghl: true,
        });
      } catch (ghlError) {
        console.error('Error syncing to GHL:', ghlError);

        // Update submission with error
        await updateFormSubmission(submission.id, {
          sync_error: ghlError.message,
        });
      }
    }

    res.status(200).json({
      success: true,
      submission: submission,
      customer: customer,
      ghl_contact_id: ghlContactId,
      ghl_opportunity_id: ghlOpportunityId,
    });
  } catch (error) {
    console.error('Error processing form submission:', error);
    res.status(500).json({
      error: 'Failed to process form submission',
      details: error.message,
    });
  }
}

// Helper functions
async function getSite(siteId) {
  const supabase = createRouteHandlerClient();

  const { data, error } = await supabase
    .from('sites')
    .select('*')
    .eq('id', siteId)
    .single();

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
