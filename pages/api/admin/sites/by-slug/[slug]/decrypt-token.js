import { getSiteBySlug } from '../../../../../../lib/database'
import { retrieveToken } from '../../../../../../lib/encryption-simple'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Only allow in development mode
  if (process.env.NODE_ENV !== 'development') {
    return res.status(403).json({ error: 'This endpoint is only available in development mode' })
  }

  try {
    const { slug } = req.query

    if (!slug) {
      return res.status(400).json({ error: 'Site slug is required' })
    }

    // Get the site
    const site = await getSiteBySlug(slug)
    if (!site) {
      return res.status(404).json({ error: 'Site not found' })
    }

    if (!site.ghl_location_token_encrypted) {
      return res.status(404).json({ error: 'No encrypted token found' })
    }

    // Decrypt the token
    const decryptedToken = retrieveToken(site.ghl_location_token_encrypted)

    res.status(200).json({
      success: true,
      decryptedToken,
      note: 'This endpoint only works in development mode'
    })

  } catch (error) {
    console.error('Error decrypting token:', error)
    res.status(500).json({ 
      error: 'Failed to decrypt token',
      details: error.message
    })
  }
}