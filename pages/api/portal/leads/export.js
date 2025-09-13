import jwt from 'jsonwebtoken'
import { createRouteHandlerClient } from '../../../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

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

    // Get all leads for the site
    const { data: leads, error } = await supabase
      .from('customers')
      .select(`
        name,
        email,
        phone,
        funnel_entry_point,
        attribution_data,
        created_at,
        ghl_contact_id
      `)
      .eq('site_id', siteId)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Convert to CSV format
    const headers = [
      'Name',
      'Email', 
      'Phone',
      'Funnel Entry',
      'UTM Source',
      'UTM Medium',
      'UTM Campaign',
      'Created Date',
      'GHL Synced'
    ]

    const csvRows = [headers.join(',')]

    leads?.forEach(lead => {
      const row = [
        `"${lead.name || ''}"`,
        `"${lead.email}"`,
        `"${lead.phone || ''}"`,
        `"${lead.funnel_entry_point || ''}"`,
        `"${lead.attribution_data?.utm_source || ''}"`,
        `"${lead.attribution_data?.utm_medium || ''}"`,
        `"${lead.attribution_data?.utm_campaign || ''}"`,
        `"${new Date(lead.created_at).toLocaleDateString()}"`,
        `"${lead.ghl_contact_id ? 'Yes' : 'No'}"`
      ]
      csvRows.push(row.join(','))
    })

    const csvContent = csvRows.join('\n')

    // Set headers for file download
    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', `attachment; filename="leads-${new Date().toISOString().split('T')[0]}.csv"`)
    
    res.status(200).send(csvContent)

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid authentication token' })
    }
    
    console.error('Error exporting leads:', error)
    res.status(500).json({ 
      error: 'Failed to export leads',
      details: error.message
    })
  }
}