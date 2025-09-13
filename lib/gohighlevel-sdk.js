import { HighLevel } from '@gohighlevel/api-client'

// Initialize SDK with Private Integration Token
const ghl = new HighLevel({
  privateIntegrationToken: process.env.GHL_AGENCY_TOKEN
})

// Location management
export async function getLocations() {
  try {
    const response = await ghl.locations.get()
    return response.locations
  } catch (error) {
    console.error('Error getting locations:', error)
    throw error
  }
}

export async function getLocation(locationId) {
  try {
    const response = await ghl.locations.getById(locationId)
    return response.location
  } catch (error) {
    console.error('Error getting location:', error)
    throw error
  }
}

// Pipeline management
export async function getPipelines(locationId) {
  try {
    const response = await ghl.pipelines.get({ locationId })
    return response.pipelines
  } catch (error) {
    console.error('Error getting pipelines:', error)
    throw error
  }
}

export async function getPipelineStages(locationId, pipelineId) {
  try {
    const response = await ghl.pipelines.getStages({ 
      locationId,
      pipelineId 
    })
    return response.stages
  } catch (error) {
    console.error('Error getting pipeline stages:', error)
    throw error
  }
}

// Contact management
export async function createGHLContact(locationId, contactData) {
  try {
    const contactPayload = {
      locationId,
      firstName: contactData.name?.split(' ')[0] || '',
      lastName: contactData.name?.split(' ').slice(1).join(' ') || '',
      email: contactData.email,
      phone: contactData.phone,
      address1: contactData.address?.line1 || '',
      city: contactData.address?.city || '',
      state: contactData.address?.state || '',
      postalCode: contactData.address?.postal_code || '',
      country: contactData.address?.country || 'US',
      source: 'BowlNow Funnel',
      tags: contactData.tags || ['bowlnow-lead']
    }

    // Add custom fields
    if (contactData.customFields) {
      contactPayload.customFields = Object.entries(contactData.customFields)
        .filter(([key, value]) => value)
        .map(([key, value]) => ({
          key: key,
          field_value: value.toString()
        }))
    }

    const response = await ghl.contacts.create(contactPayload)
    return response.contact
  } catch (error) {
    console.error('Error creating GHL contact:', error)
    throw error
  }
}

export async function updateGHLContact(contactId, contactData, locationId) {
  try {
    const updatePayload = {
      locationId,
      firstName: contactData.name?.split(' ')[0] || '',
      lastName: contactData.name?.split(' ').slice(1).join(' ') || '',
      email: contactData.email,
      phone: contactData.phone
    }

    // Add custom fields
    if (contactData.customFields) {
      updatePayload.customFields = Object.entries(contactData.customFields)
        .filter(([key, value]) => value)
        .map(([key, value]) => ({
          key: key,
          field_value: value.toString()
        }))
    }

    const response = await ghl.contacts.update(contactId, updatePayload)
    return response.contact
  } catch (error) {
    console.error('Error updating GHL contact:', error)
    throw error
  }
}

// Opportunity management
export async function createGHLOpportunity(locationId, opportunityData) {
  try {
    const opportunityPayload = {
      locationId,
      pipelineId: opportunityData.pipelineId,
      stageId: opportunityData.stageId,
      title: opportunityData.title,
      contactId: opportunityData.contactId,
      monetaryValue: opportunityData.monetaryValue || 0,
      assignedTo: opportunityData.assignedTo,
      status: opportunityData.status || 'open',
      source: 'BowlNow Funnel'
    }

    // Add custom fields for opportunities
    if (opportunityData.customFields) {
      opportunityPayload.customFields = Object.entries(opportunityData.customFields)
        .filter(([key, value]) => value)
        .map(([key, value]) => ({
          key: key,
          field_value: value.toString()
        }))
    }

    const response = await ghl.opportunities.create(opportunityPayload)
    return response.opportunity
  } catch (error) {
    console.error('Error creating GHL opportunity:', error)
    throw error
  }
}

export async function updateGHLOpportunity(opportunityId, opportunityData, locationId) {
  try {
    const updatePayload = {
      locationId,
      title: opportunityData.title,
      stageId: opportunityData.stageId,
      monetaryValue: opportunityData.monetaryValue,
      status: opportunityData.status
    }

    // Add custom fields
    if (opportunityData.customFields) {
      updatePayload.customFields = Object.entries(opportunityData.customFields)
        .filter(([key, value]) => value)
        .map(([key, value]) => ({
          key: key,
          field_value: value.toString()
        }))
    }

    const response = await ghl.opportunities.update(opportunityId, updatePayload)
    return response.opportunity
  } catch (error) {
    console.error('Error updating GHL opportunity:', error)
    throw error
  }
}

// Custom fields management
export async function getCustomFields(locationId) {
  try {
    const response = await ghl.customFields.get({ locationId })
    return response.customFields
  } catch (error) {
    console.error('Error getting custom fields:', error)
    throw error
  }
}

export async function createCustomField(locationId, fieldData) {
  try {
    const fieldPayload = {
      locationId,
      name: fieldData.name,
      fieldKey: fieldData.key,
      dataType: fieldData.dataType, // TEXT, NUMBER, BOOLEAN, etc.
      position: fieldData.position || 0
    }

    const response = await ghl.customFields.create(fieldPayload)
    return response.customField
  } catch (error) {
    console.error('Error creating custom field:', error)
    throw error
  }
}

// Utility functions
export async function validateGHLConnection(locationId) {
  try {
    const location = await getLocation(locationId)
    const pipelines = await getPipelines(locationId)
    
    return {
      valid: true,
      location: location,
      pipelineCount: pipelines.length
    }
  } catch (error) {
    return {
      valid: false,
      error: error.message
    }
  }
}

// Export the SDK instance for direct use if needed
export { ghl }