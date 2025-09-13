import jwt from 'jsonwebtoken'
import { createRouteHandlerClient } from '../../../lib/supabase'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return handleGetSettings(req, res)
  } else if (req.method === 'PUT') {
    return handleUpdateSettings(req, res)
  } else {
    return res.status(405).json({ error: 'Method not allowed' })
  }
}

async function handleGetSettings(req, res) {
  try {
    // Verify JWT token
    const token = req.headers.authorization?.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({ error: 'No authentication token provided' })
    }

    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET)
    
    if (decoded.type !== 'client') {
      return res.status(403).json({ error: 'Invalid token type' })
    }

    const siteId = decoded.siteId
    const supabase = createRouteHandlerClient()

    // Get site settings
    const { data: site, error } = await supabase
      .from('sites')
      .select('settings, tracking_pixels')
      .eq('id', siteId)
      .single()

    if (error) throw error

    // Return current settings
    const settings = {
      site_name: site.settings?.site_name || '',
      theme_color: site.settings?.theme_color || '#4F46E5',
      tracking_pixels: site.tracking_pixels || { facebook: '', google: '' },
      notification_preferences: site.settings?.notification_preferences || {
        email_leads: true,
        email_orders: true,
        sms_notifications: false
      }
    }

    res.status(200).json({
      success: true,
      settings
    })

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid authentication token' })
    }
    
    console.error('Error fetching portal settings:', error)
    res.status(500).json({ 
      error: 'Failed to fetch settings',
      details: error.message
    })
  }
}

async function handleUpdateSettings(req, res) {
  try {
    // Verify JWT token
    const token = req.headers.authorization?.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({ error: 'No authentication token provided' })
    }

    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET)
    
    if (decoded.type !== 'client') {
      return res.status(403).json({ error: 'Invalid token type' })
    }

    const siteId = decoded.siteId
    const newSettings = req.body
    const supabase = createRouteHandlerClient()

    // Get current site data
    const { data: currentSite, error: fetchError } = await supabase
      .from('sites')
      .select('settings, tracking_pixels')
      .eq('id', siteId)
      .single()

    if (fetchError) throw fetchError

    // Update site with new settings
    const updatedSettings = {
      ...currentSite.settings,
      theme_color: newSettings.theme_color,
      notification_preferences: newSettings.notification_preferences
    }

    const { error: updateError } = await supabase
      .from('sites')
      .update({
        settings: updatedSettings,
        tracking_pixels: newSettings.tracking_pixels
      })
      .eq('id', siteId)

    if (updateError) throw updateError

    res.status(200).json({
      success: true,
      message: 'Settings updated successfully'
    })

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid authentication token' })
    }
    
    console.error('Error updating portal settings:', error)
    res.status(500).json({ 
      error: 'Failed to update settings',
      details: error.message
    })
  }
}