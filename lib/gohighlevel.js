import axios from 'axios'

const GHL_API_BASE = 'https://services.leadconnectorhq.com'

// Create axios instance with default config
const ghlAPI = axios.create({
  baseURL: GHL_API_BASE,
  timeout: 30000,
  headers: {
    'Authorization': `Bearer ${process.env.GHL_AGENCY_TOKEN}`,
    'Content-Type': 'application/json',
    'Version': '2021-07-28'
  }
})

// OAuth token management
export async function exchangeCodeForTokens(code, redirectUri) {
  try {
    const response = await axios.post('https://rest.gohighlevel.com/v1/oauth/token', {
      client_id: process.env.GHL_CLIENT_ID,
      client_secret: process.env.GHL_CLIENT_SECRET,
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri
    })

    return response.data
  } catch (error) {
    console.error('Error exchanging code for tokens:', error.response?.data || error.message)
    throw error
  }
}

export async function refreshAccessToken(refreshToken) {
  try {
    const response = await axios.post('https://rest.gohighlevel.com/v1/oauth/token', {
      client_id: process.env.GHL_CLIENT_ID,
      client_secret: process.env.GHL_CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    })

    return response.data
  } catch (error) {
    console.error('Error refreshing access token:', error.response?.data || error.message)
    throw error
  }
}

// Location management  
export async function getLocations() {
  try {
    const response = await ghlAPI.get('/locations')
    return response.data.locations
  } catch (error) {
    console.error('Error getting locations:', error.response?.data || error.message)
    throw error
  }
}

export async function getLocation(locationId) {
  try {
    const response = await ghlAPI.get(`/locations/${locationId}`)
    return response.data.location
  } catch (error) {
    console.error('Error getting location:', error.response?.data || error.message)
    throw error
  }
}

// Pipeline management
export async function getPipelines(locationId) {
  try {
    const response = await ghlAPI.get(`/locations/${locationId}/pipelines`)
    return response.data.pipelines
  } catch (error) {
    console.error('Error getting pipelines:', error.response?.data || error.message)
    throw error
  }
}

export async function getPipelineStages(locationId, pipelineId) {
  try {
    const response = await ghlAPI.get(`/locations/${locationId}/pipelines/${pipelineId}/stages`)
    return response.data.stages
  } catch (error) {
    console.error('Error getting pipeline stages:', error.response?.data || error.message)
    throw error
  }
}

// Contact management
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
      tags: contactData.tags || ['bowlnow-lead'],
      locationId: locationId, // Required for agency-level access
      customFields: []
    }

    // Add custom fields
    if (contactData.customFields) {
      Object.entries(contactData.customFields).forEach(([key, value]) => {
        if (value) {
          payload.customFields.push({
            key: key,
            field_value: value.toString()
          })
        }
      })
    }

    const response = await ghlAPI.post(`/contacts`, payload)

    return response.data.contact
  } catch (error) {
    console.error('Error creating GHL contact:', error.response?.data || error.message)
    throw error
  }
}

export async function updateGHLContact(contactId, contactData, accessToken) {
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

    const response = await ghlAPI.put(`/contacts/${contactId}`, payload, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    return response.data.contact
  } catch (error) {
    console.error('Error updating GHL contact:', error.response?.data || error.message)
    throw error
  }
}

// Opportunity management
export async function createGHLOpportunity(locationId, opportunityData, accessToken) {
  try {
    const payload = {
      pipelineId: opportunityData.pipelineId,
      stageId: opportunityData.stageId,
      title: opportunityData.title,
      contactId: opportunityData.contactId,
      monetaryValue: opportunityData.monetaryValue || 0,
      assignedTo: opportunityData.assignedTo,
      status: opportunityData.status || 'open',
      source: 'BowlNow Funnel',
      locationId: locationId // Required for agency-level access
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

    const response = await ghlAPI.post(`/opportunities`, payload, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    return response.data.opportunity
  } catch (error) {
    console.error('Error creating GHL opportunity:', error.response?.data || error.message)
    throw error
  }
}

export async function updateGHLOpportunity(opportunityId, opportunityData, accessToken) {
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

    const response = await ghlAPI.put(`/opportunities/${opportunityId}`, payload, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    return response.data.opportunity
  } catch (error) {
    console.error('Error updating GHL opportunity:', error.response?.data || error.message)
    throw error
  }
}

// Custom fields management
export async function getCustomFields(locationId, accessToken) {
  try {
    const response = await ghlAPI.get(`/locations/${locationId}/customFields`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    return response.data.customFields
  } catch (error) {
    console.error('Error getting custom fields:', error.response?.data || error.message)
    throw error
  }
}

export async function createCustomField(locationId, fieldData, accessToken) {
  try {
    const payload = {
      name: fieldData.name,
      fieldKey: fieldData.key,
      dataType: fieldData.dataType, // TEXT, NUMBER, BOOLEAN, etc.
      position: fieldData.position || 0
    }

    const response = await ghlAPI.post(`/locations/${locationId}/customFields`, payload, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    return response.data.customField
  } catch (error) {
    console.error('Error creating custom field:', error.response?.data || error.message)
    throw error
  }
}

// Custom Menu management using agency token
export async function createCustomMenu(locationId, menuData) {
  try {
    // Check if agency token is available
    if (!process.env.GHL_AGENCY_TOKEN) {
      throw new Error('GHL_AGENCY_TOKEN environment variable is not set')
    }

    console.log('DEBUG: Agency token available:', !!process.env.GHL_AGENCY_TOKEN)
    console.log('DEBUG: Token length:', process.env.GHL_AGENCY_TOKEN?.length)

    // Use the proper GHL API format for custom menus
    const payload = {
      title: menuData.title,
      type: menuData.type || 'app',
      url: menuData.url,
      showOnLocation: menuData.showOnLocation !== false, // default true
      openMode: menuData.openMode || 'iframe',
      locations: menuData.locations || [locationId],
      userRole: menuData.userRole || 'admin',
      icon: menuData.icon || {
        name: 'yin-ang',
        fontFamily: 'fas'
      }
    }

    console.log('DEBUG: Creating custom menu with payload:', JSON.stringify(payload, null, 2))

    // Use axios directly with agency token for custom menus (agency-level operation)
    const response = await axios.post(`${GHL_API_BASE}/custom-menus`, payload, {
      headers: {
        'Authorization': `Bearer ${process.env.GHL_AGENCY_TOKEN}`,
        'Content-Type': 'application/json',
        'Version': '2021-07-28'
      },
      timeout: 30000
    })

    console.log('DEBUG: Custom menu created successfully:', response.data)
    return response.data
  } catch (error) {
    console.error('Error creating custom menu:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers
    })
    throw error
  }
}

export async function getCustomMenus(locationId, accessToken) {
  try {
    const response = await axios.get(`${GHL_API_BASE}/custom-menus`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Version': '2021-07-28'
      },
      params: {
        locationId: locationId
      },
      timeout: 30000
    })

    return response.data.customMenus
  } catch (error) {
    console.error('Error getting custom menus:', error.response?.data || error.message)
    throw error
  }
}

export async function updateCustomMenu(menuId, menuData, accessToken) {
  try {
    const payload = {
      name: menuData.name,
      app_url: menuData.app_url,
      icon_url: menuData.icon_url,
      status: menuData.status,
      position: menuData.position
    }

    const response = await axios.put(`${GHL_API_BASE}/custom-menus/${menuId}`, payload, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Version': '2021-07-28'
      },
      timeout: 30000
    })

    return response.data
  } catch (error) {
    console.error('Error updating custom menu:', error.response?.data || error.message)
    throw error
  }
}

export async function deleteCustomMenu(menuId) {
  try {
    // Use axios directly with agency token for custom menus (agency-level operation)
    const response = await axios.delete(`${GHL_API_BASE}/custom-menus/${menuId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.GHL_AGENCY_TOKEN}`,
        'Content-Type': 'application/json',
        'Version': '2021-07-28'
      },
      timeout: 30000
    })

    return response.data
  } catch (error) {
    console.error('Error deleting custom menu:', error.response?.data || error.message)
    throw error
  }
}

// Utility functions
export function getGHLAuthUrl(state) {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.GHL_CLIENT_ID,
    redirect_uri: process.env.GHL_REDIRECT_URI,
    scope: 'locations.read locations.write contacts.read contacts.write opportunities.read opportunities.write',
    state: state
  })

  return `https://marketplace.gohighlevel.com/oauth/chooselocation?${params.toString()}`
}

export async function validateGHLConnection(locationId, accessToken) {
  try {
    const location = await getLocation(locationId, accessToken)
    const pipelines = await getPipelines(locationId, accessToken)
    
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