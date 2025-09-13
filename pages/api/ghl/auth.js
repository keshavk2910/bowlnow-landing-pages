import { getGHLAuthUrl } from '../../../lib/gohighlevel'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { siteSlug } = req.query

    if (!siteSlug) {
      return res.status(400).json({ error: 'Site slug is required' })
    }

    // Generate state parameter for OAuth flow
    const state = JSON.stringify({
      siteSlug,
      timestamp: Date.now()
    })

    const authUrl = getGHLAuthUrl(Buffer.from(state).toString('base64'))

    res.status(200).json({
      success: true,
      authUrl
    })

  } catch (error) {
    console.error('Error generating GHL auth URL:', error)
    res.status(500).json({ error: 'Failed to generate auth URL' })
  }
}