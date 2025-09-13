import { getSiteBySlug, updateSite } from '../../../../../lib/database'
import { saveToken } from '../../../../../lib/encryption-simple'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return handleGetSite(req, res)
  } else if (req.method === 'PATCH') {
    return handleUpdateSite(req, res)
  } else {
    return res.status(405).json({ error: 'Method not allowed' })
  }
}

async function handleGetSite(req, res) {

  try {
    const { slug } = req.query

    if (!slug) {
      return res.status(400).json({ error: 'Site slug is required' })
    }

    const site = await getSiteBySlug(slug)
    
    if (!site) {
      return res.status(404).json({ error: 'Site not found' })
    }

    res.status(200).json({
      success: true,
      site
    })

  } catch (error) {
    console.error('Error fetching site by slug:', error)
    res.status(500).json({ 
      error: 'Failed to fetch site',
      details: error.message
    })
  }
}

async function handleUpdateSite(req, res) {
  try {
    const { slug } = req.query
    const updates = req.body

    if (!slug) {
      return res.status(400).json({ error: 'Site slug is required' })
    }

    // Get the site first
    const site = await getSiteBySlug(slug)
    if (!site) {
      return res.status(404).json({ error: 'Site not found' })
    }

    // Remove any fields that shouldn't be updated directly
    delete updates.id
    delete updates.created_at
    delete updates.updated_at
    delete updates.slug // Don't allow slug changes

    // Encrypt location token if provided
    if (updates.ghl_location_token) {
      updates.ghl_location_token_encrypted = saveToken(updates.ghl_location_token)
      delete updates.ghl_location_token // Remove plain text token
    }

    // Update the site
    const updatedSite = await updateSite(site.id, updates)

    res.status(200).json({
      success: true,
      message: 'Site updated successfully',
      site: updatedSite
    })

  } catch (error) {
    console.error('Error updating site by slug:', error)
    res.status(500).json({ 
      error: 'Failed to update site',
      details: error.message
    })
  }
}