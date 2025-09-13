import jwt from 'jsonwebtoken'
import { createRouteHandlerClient } from './supabase'

// Verify portal client token and return user data
export async function verifyPortalToken(req) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  
  if (!token) {
    throw new Error('No authentication token provided')
  }

  try {
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET)
    
    if (decoded.type !== 'client') {
      throw new Error('Invalid token type')
    }

    // Get fresh user data to ensure access is still valid
    const supabase = createRouteHandlerClient()
    const { data: client, error } = await supabase
      .from('client_users')
      .select(`
        *,
        sites (
          id,
          client_name,
          slug,
          status
        )
      `)
      .eq('id', decoded.userId)
      .eq('is_active', true)
      .single()

    if (error || !client) {
      throw new Error('Client account not found or inactive')
    }

    if (!client.sites || client.sites.status !== 'active') {
      throw new Error('Site is inactive')
    }

    return {
      userId: client.id,
      siteId: client.site_id,
      email: client.email,
      name: client.name,
      site: client.sites
    }
  } catch (error) {
    throw new Error('Invalid authentication token')
  }
}

// Middleware function to protect portal routes
export function requirePortalAuth(handler) {
  return async (req, res) => {
    try {
      const user = await verifyPortalToken(req)
      
      // Add user info to request
      req.user = user
      
      return handler(req, res)
    } catch (error) {
      return res.status(401).json({ error: error.message })
    }
  }
}

// Check if user has access to specific site
export function requireSiteAccess(handler) {
  return requirePortalAuth(async (req, res) => {
    const { siteId } = req.query
    
    // If siteId is provided in query, verify access
    if (siteId && req.user.siteId !== siteId) {
      return res.status(403).json({ error: 'Access denied: You do not have access to this site' })
    }
    
    return handler(req, res)
  })
}

// Restrict portal API to only return data for user's site
export function filterBySite(query, userSiteId) {
  return query.eq('site_id', userSiteId)
}

// Validate that data belongs to user's site
export async function validateSiteOwnership(siteId, userSiteId) {
  if (siteId !== userSiteId) {
    throw new Error('Access denied: Resource does not belong to your site')
  }
  return true
}