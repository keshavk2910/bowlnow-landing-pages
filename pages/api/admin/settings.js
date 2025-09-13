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
    // For now, return default settings since we don't have a settings table
    // In production, you might store these in a dedicated settings table
    const defaultSettings = {
      platform_name: 'BowlNow',
      support_email: 'support@bowlnow.com',
      default_theme_color: '#4F46E5',
      stripe_application_fee: 2.9,
      enable_analytics: true,
      enable_webhooks: true,
      webhook_url: '',
      smtp_settings: {
        host: '',
        port: 587,
        username: '',
        password: ''
      }
    }

    res.status(200).json({
      success: true,
      settings: defaultSettings
    })

  } catch (error) {
    console.error('Error fetching settings:', error)
    res.status(500).json({ 
      error: 'Failed to fetch settings',
      details: error.message
    })
  }
}

async function handleUpdateSettings(req, res) {
  try {
    const settings = req.body

    // Validate settings
    if (!settings.platform_name || !settings.support_email) {
      return res.status(400).json({ error: 'Platform name and support email are required' })
    }

    // In a real implementation, you would save these to a database
    // For now, we'll just acknowledge the save
    console.log('Settings updated:', settings)

    res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      settings
    })

  } catch (error) {
    console.error('Error updating settings:', error)
    res.status(500).json({ 
      error: 'Failed to update settings',
      details: error.message
    })
  }
}