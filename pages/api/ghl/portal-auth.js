import jwt from 'jsonwebtoken'
import { createRouteHandlerClient } from '../../../lib/supabase'
import { getLocation } from '../../../lib/gohighlevel'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { locationId, siteSlug, accessToken, ghlUserId } = req.body

    if (!locationId || !siteSlug) {
      return res.status(400).json({ error: 'Missing required parameters' })
    }

    const supabase = createRouteHandlerClient()

    // Get site info and verify it exists
    const { data: site, error: siteError } = await supabase
      .from('sites')
      .select(`
        id,
        client_name,
        slug,
        status,
        ghl_location_id,
        client_users (
          id,
          email,
          name,
          is_active
        )
      `)
      .eq('slug', siteSlug)
      .eq('status', 'active')
      .single()

    if (siteError || !site) {
      return res.status(404).json({ error: 'Site not found or inactive' })
    }

    // Verify the GHL location matches
    if (site.ghl_location_id && site.ghl_location_id !== locationId) {
      return res.status(403).json({ error: 'Location ID mismatch' })
    }

    // If we have an access token, verify location access
    if (accessToken) {
      try {
        const locationInfo = await getLocation(locationId)
        console.log('Location verified:', locationInfo?.name)
      } catch (error) {
        console.error('Error verifying location:', error)
        return res.status(403).json({ error: 'Invalid location access' })
      }
    }

    // Find or create a client user for this GHL access
    let clientUser = site.client_users?.[0]

    if (!clientUser || !clientUser.is_active) {
      // Create a default client user if none exists
      const { data: newUser, error: userError } = await supabase
        .from('client_users')
        .insert({
          site_id: site.id,
          email: `ghl-user-${locationId}@bowlnow.com`,
          name: site.client_name || 'Client User',
          is_active: true,
          created_via: 'ghl_integration'
        })
        .select()
        .single()

      if (userError) {
        console.error('Error creating client user:', userError)
        return res.status(500).json({ error: 'Failed to create client access' })
      }

      clientUser = newUser
    }

    // Generate portal JWT token
    const portalToken = jwt.sign(
      {
        userId: clientUser.id,
        siteId: site.id,
        type: 'client',
        source: 'ghl',
        locationId: locationId,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
      },
      process.env.NEXTAUTH_SECRET
    )

    // Return the token and user info
    res.status(200).json({
      success: true,
      token: portalToken,
      user: {
        id: clientUser.id,
        name: clientUser.name,
        email: clientUser.email,
        siteId: site.id,
        site: {
          id: site.id,
          name: site.client_name,
          slug: site.slug
        }
      },
      expiresIn: '24h'
    })

  } catch (error) {
    console.error('Error authenticating GHL user for portal:', error)
    res.status(500).json({ 
      error: 'Authentication failed',
      details: error.message
    })
  }
}