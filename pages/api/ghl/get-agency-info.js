import { testGHLConnection } from '../../../lib/gohighlevel-v2'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const connectionTest = await testGHLConnection()
    
    if (connectionTest.success) {
      // Extract agency ID from first location's companyId
      const agencyId = process.env.GHL_AGENCY_ID || 
                     (connectionTest.locations?.[0]?.companyId) || 
                     'Not found'

      res.status(200).json({
        success: true,
        agencyId: agencyId,
        locations: connectionTest.locations,
        message: `Agency ID: ${agencyId} | ${connectionTest.locationCount} locations found`,
        totalLocations: connectionTest.locationCount,
        instruction: 'Copy any Location ID to use when creating sites. No OAuth needed!',
        tokenStatus: 'Valid - Private Integration Active'
      })
    } else {
      res.status(400).json({
        success: false,
        error: connectionTest.error,
        suggestion: 'Check your GHL_AGENCY_TOKEN in .env.local'
      })
    }

  } catch (error) {
    console.error('Error fetching agency info:', error.response?.data || error.message)
    res.status(500).json({ 
      error: 'Failed to fetch agency info',
      details: error.response?.data?.message || error.message,
      suggestion: 'Make sure your GHL_AGENCY_TOKEN is correct and has proper permissions'
    })
  }
}