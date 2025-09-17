import HighLevel from '@gohighlevel/api-client';
import { retrieveToken } from './encryption-simple';

// Create GHL client for location-specific operations
function createLocationGHLClient(locationToken) {
  const decryptedToken = retrieveToken(locationToken);

  console.log('DEBUG: Token decryption:', {
    originalLength: locationToken?.length,
    decryptedLength: decryptedToken?.length,
    decryptedStartsWith: decryptedToken?.substring(0, 10),
    isValidPitToken: decryptedToken?.startsWith('pit-'),
  });

  return new HighLevel({
    privateIntegrationToken: decryptedToken,
    logLevel: 'INFO', // Add logging for debugging
  });
}

// Contact management with location-specific token
export async function createGHLContact(locationId, contactData, locationToken) {
  try {
    const ghlClient = createLocationGHLClient(locationToken);

    const payload = {
      firstName:
        contactData.full_name?.split(' ')[0] ||
        contactData.name?.split(' ')[0] ||
        '',
      lastName:
        contactData.full_name?.split(' ').slice(1).join(' ') ||
        contactData.name?.split(' ').slice(1).join(' ') ||
        '',
      name: contactData.full_name || contactData.name || '',
      email: contactData.email,
      phone: contactData.phone,
      address1: contactData.address?.line1 || '',
      city: contactData.address?.city || '',
      state: contactData.address?.state || '',
      postalCode: contactData.address?.postal_code || '',
      country: contactData.address?.country || 'US',
      source: 'BowlNow Page',
      tags: contactData.tags || ['BowlNow-lead'],
      locationId: locationId,
      companyName: contactData.organization || '',
    };

    // Add native GHL attribution if available
    if (contactData.attribution) {
      console.log(
        'DEBUG: Adding attribution to contact:',
        contactData.attribution
      );

      if (contactData.attribution.attributionSource) {
        // Filter out empty values
        const attributionSource = {};
        Object.entries(contactData.attribution.attributionSource).forEach(
          ([key, value]) => {
            if (value && value !== '') {
              attributionSource[key] = value;
            }
          }
        );

        if (Object.keys(attributionSource).length > 0) {
          payload.attributionSource = attributionSource;
          console.log('DEBUG: Attribution Source added:', attributionSource);
        }
      }

      if (contactData.attribution.lastAttributionSource) {
        // Filter out empty values
        const lastAttributionSource = {};
        Object.entries(contactData.attribution.lastAttributionSource).forEach(
          ([key, value]) => {
            if (value && value !== '') {
              lastAttributionSource[key] = value;
            }
          }
        );

        if (Object.keys(lastAttributionSource).length > 0) {
          payload.lastAttributionSource = lastAttributionSource;
          console.log(
            'DEBUG: Last Attribution Source added:',
            lastAttributionSource
          );
        }
      }
    } else {
      console.log('DEBUG: No attribution data provided');
    }

    // Don't add custom fields to contact - they'll be added to opportunity instead

    console.log('DEBUG: Creating contact with payload:', {
      locationId,
      email: payload.email,
      hasCustomFields: !!payload.customFields?.length,
    });

    const response = await ghlClient.contacts.upsertContact(payload);
    console.log('DEBUG: Contact upserted successfully:', response.contact?.id);

    return response.contact;
  } catch (error) {
    console.error('Error creating GHL contact with location token:', error);
    throw error;
  }
}

export async function updateGHLContact(
  contactId,
  contactData,
  locationId,
  locationToken
) {
  try {
    const ghlClient = createLocationGHLClient(locationToken);

    const payload = {
      firstName: contactData.name?.split(' ')[0] || '',
      lastName: contactData.name?.split(' ').slice(1).join(' ') || '',
      email: contactData.email,
      phone: contactData.phone,
    };

    // Add custom fields
    if (contactData.customFields) {
      payload.customFields = [];
      Object.entries(contactData.customFields).forEach(([key, value]) => {
        if (value) {
          payload.customFields.push({
            key: key,
            field_value: value.toString(),
          });
        }
      });
    }

    const response = await ghlClient.contacts.updateContact(contactId, payload);
    return response.contact;
  } catch (error) {
    console.error(
      'Error updating GHL contact with location token:',
      error.response?.data || error.message
    );
    throw error;
  }
}

// Opportunity management with location-specific token
export async function createGHLOpportunity(
  locationId,
  opportunityData,
  locationToken
) {
  try {
    const ghlClient = createLocationGHLClient(locationToken);

    const payload = {
      pipelineId: opportunityData.pipelineId,
      locationId: locationId,
      name: opportunityData.title,
      pipelineStageId: opportunityData.stageId,
      status: opportunityData.status || 'open',
      contactId: opportunityData.contactId,
      // monetaryValue: opportunityData.monetaryValue || 0,
      assignedTo: opportunityData.assignedTo,
    };

    // Add all custom fields to opportunity instead of contact
    payload.customFields = [];

    // Standard custom fields
    if (opportunityData.customFields) {
      Object.entries(opportunityData.customFields).forEach(([key, value]) => {
        if (value) {
          payload.customFields.push({
            key: key,
            field_value: value.toString(),
          });
        }
      });
    }

    // Map only specified custom fields to GHL opportunity
    const ghlFieldMapping = {
      // Only these 7 fields in opportunities as requested
      preferred_time_of_event: opportunityData.preferred_time,
      guest_count: opportunityData.number_of_guests,
      preferred_date_of_event: opportunityData.preferred_date,
      type_of_event: opportunityData.type_of_event,
      companyorganization: opportunityData.organization,
      additional_comments: opportunityData.additional_information,
      source: 'BowlNow Page',
    };

    Object.entries(ghlFieldMapping).forEach(([key, value]) => {
      if (value) {
        payload.customFields.push({
          key: key,
          field_value: value.toString(),
        });
      }
    });

    console.log('DEBUG: Creating opportunity with payload:', {
      locationId,
      pipelineId: payload.pipelineId,
      stageId: payload.stageId,
      contactId: payload.contactId,
      CustomFields: payload.customFields || [],
    });

    const response = await ghlClient.opportunities.createOpportunity(payload);
    console.log(
      'DEBUG: Opportunity created successfully:',
      response.opportunity?.id
    );

    return response.opportunity;
  } catch (error) {
    console.error('Error creating GHL opportunity with location token:', error);
    throw error;
  }
}

export async function updateGHLOpportunity(
  opportunityId,
  opportunityData,
  locationId,
  locationToken
) {
  try {
    const ghlClient = createLocationGHLClient(locationToken);

    const payload = {
      title: opportunityData.title,
      stageId: opportunityData.stageId,
      // monetaryValue: opportunityData.monetaryValue,
      status: opportunityData.status,
    };

    // Add custom fields
    if (opportunityData.customFields) {
      payload.customFields = [];
      Object.entries(opportunityData.customFields).forEach(([key, value]) => {
        if (value) {
          payload.customFields.push({
            key: key,
            field_value: value.toString(),
          });
        }
      });
    }

    const response = await ghlClient.opportunities.upsertOpportunity(
      opportunityId,
      payload
    );
    return response.opportunity;
  } catch (error) {
    console.error(
      'Error updating GHL opportunity with location token:',
      error.response?.data || error.message
    );
    throw error;
  }
}

// Pipeline management (uses location token)
export async function getPipelines(locationId, locationToken) {
  try {
    const ghlClient = createLocationGHLClient(locationToken);

    console.log('DEBUG: Fetching pipelines for location:', locationId);

    const response = await ghlClient.opportunities.getPipelines({ locationId });
    console.log(
      'DEBUG: Pipelines fetched successfully:',
      response.pipelines?.length || 0
    );

    return response.pipelines || [];
  } catch (error) {
    console.error('Error getting pipelines with location token:', error);
    throw error;
  }
}

export async function getPipelineStages(locationId, pipelineId, locationToken) {
  try {
    // Get all pipelines and find the specific one with stages
    const pipelines = await getPipelines(locationId, locationToken);
    const pipeline = pipelines.find((p) => p.id === pipelineId);

    if (!pipeline) {
      throw new Error(`Pipeline with ID ${pipelineId} not found`);
    }

    return pipeline.stages || [];
  } catch (error) {
    console.error(
      'Error getting pipeline stages with location token:',
      error.response?.data || error.message
    );
    throw error;
  }
}

// Test location token functionality
export async function testLocationToken(locationId, locationToken) {
  try {
    const ghlClient = createLocationGHLClient(locationToken);

    // Test with a simple API call
    const response = await ghlClient.contacts.getContacts({
      locationId,
      limit: 1,
    });

    return {
      success: true,
      message: 'Location token is valid',
      contactCount: response.meta?.total || 0,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
}
