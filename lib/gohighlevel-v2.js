import axios from 'axios'

// GoHighLevel API v2 Client with Private Integration Token
const ghlClient = axios.create({
  baseURL: 'https://services.leadconnectorhq.com',
  headers: {
    'Authorization': `Bearer ${process.env.GHL_AGENCY_TOKEN}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Version': '2021-07-28'
  },
  timeout: 30000
})

// Location management
export async function getLocations() {
  try {
    const response = await ghlClient.get('/locations')
    return response.data.locations
  } catch (error) {
    console.error('Error getting locations:', error.response?.data || error.message)
    throw error
  }
}

export async function getLocation(locationId) {
  try {
    const response = await ghlClient.get(`/locations/${locationId}`)
    return response.data.location
  } catch (error) {
    console.error('Error getting location:', error.response?.data || error.message)
    throw error
  }
}

// Pipeline management
export async function getPipelines(locationId) {
  try {
    const response = await ghlClient.get(`/opportunities/pipelines`, {
      params: { locationId }
    })
    return response.data.pipelines
  } catch (error) {
    console.error('Error getting pipelines:', error.response?.data || error.message)
    throw error
  }
}

export async function getPipelineStages(locationId, pipelineId) {
  try {
    const response = await ghlClient.get(`/opportunities/pipelines/${pipelineId}`, {
      params: { locationId }
    })
    return response.data.stages
  } catch (error) {
    console.error('Error getting pipeline stages:', error.response?.data || error.message)
    throw error
  }
}

// Contact management with proper API v2 structure
export async function createGHLContact(locationId, contactData) {
  try {
    const payload = {
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

    // Add custom fields in v2 format
    if (contactData.customFields) {
      payload.customFields = []
      Object.entries(contactData.customFields).forEach(([key, value]) => {
        if (value) {
          payload.customFields.push({
            key: key,
            field_value: value.toString()
          })
        }
      })
    }

    const response = await ghlClient.post(`/contacts/`, payload, {
      params: { locationId }
    })

    return response.data.contact
  } catch (error) {
    console.error('Error creating GHL contact:', error.response?.data || error.message)
    throw error
  }
}

export async function updateGHLContact(contactId, contactData, locationId) {
  try {
    const payload = {
      firstName: contactData.name?.split(' ')[0] || '',
      lastName: contactData.name?.split(' ').slice(1).join(' ') || '',
      email: contactData.email,
      phone: contactData.phone
    }

    // Add custom fields
    if (contactData.customFields) {
      payload.customFields = []
      Object.entries(contactData.customFields).forEach(([key, value]) => {
        if (value) {
          payload.customFields.push({
            key: key,
            field_value: value.toString()
          })
        }
      })
    }

    const response = await ghlClient.put(`/contacts/${contactId}`, payload, {
      params: { locationId }
    })

    return response.data.contact
  } catch (error) {
    console.error('Error updating GHL contact:', error.response?.data || error.message)
    throw error
  }
}

// Opportunity management with proper API v2 structure
export async function createGHLOpportunity(locationId, opportunityData) {
  try {
    const payload = {
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
      payload.customFields = []
      Object.entries(opportunityData.customFields).forEach(([key, value]) => {
        if (value) {
          payload.customFields.push({
            key: key,
            field_value: value.toString()
          })
        }
      })
    }

    const response = await ghlClient.post(`/opportunities/`, payload, {
      params: { locationId }
    })

    return response.data.opportunity
  } catch (error) {
    console.error('Error creating GHL opportunity:', error.response?.data || error.message)
    throw error
  }
}

export async function updateGHLOpportunity(opportunityId, opportunityData, locationId) {
  try {
    const payload = {
      title: opportunityData.title,
      stageId: opportunityData.stageId,
      monetaryValue: opportunityData.monetaryValue,
      status: opportunityData.status
    }

    // Add custom fields
    if (opportunityData.customFields) {
      payload.customFields = []
      Object.entries(opportunityData.customFields).forEach(([key, value]) => {
        if (value) {
          payload.customFields.push({
            key: key,
            field_value: value.toString()
          })
        }
      })
    }

    const response = await ghlClient.put(`/opportunities/${opportunityId}`, payload, {
      params: { locationId }
    })

    return response.data.opportunity
  } catch (error) {
    console.error('Error updating GHL opportunity:', error.response?.data || error.message)
    throw error
  }
}

// Custom fields management
export async function getCustomFields(locationId) {
  try {
    const response = await ghlClient.get(`/custom-fields/`, {
      params: { locationId }
    })
    return response.data.customFields
  } catch (error) {
    console.error('Error getting custom fields:', error.response?.data || error.message)
    throw error
  }
}

export async function createCustomField(locationId, fieldData) {
  try {
    const payload = {
      name: fieldData.name,
      fieldKey: fieldData.key,
      dataType: fieldData.dataType, // TEXT, NUMBER, BOOLEAN, etc.
      position: fieldData.position || 0
    }

    const response = await ghlClient.post(`/custom-fields/`, payload, {
      params: { locationId }
    })

    return response.data.customField
  } catch (error) {
    console.error('Error creating custom field:', error.response?.data || error.message)
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

// Test connection function
export async function testGHLConnection() {
  try {
    const locations = await getLocations()
    return {
      success: true,
      message: 'GHL connection successful',
      locationCount: locations.length,
      locations: locations.map(loc => ({
        id: loc.id,
        name: loc.name,
        companyId: loc.companyId
      }))
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to connect to GHL'
    }
  }
}