import bcrypt from 'bcrypt'
import { createRouteHandlerClient } from '../../../../lib/supabase'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return handleGetClients(req, res)
  } else if (req.method === 'POST') {
    return handleCreateClient(req, res)
  } else {
    return res.status(405).json({ error: 'Method not allowed' })
  }
}

async function handleGetClients(req, res) {
  try {
    const supabase = createRouteHandlerClient()
    
    const { data: clients, error } = await supabase
      .from('client_users')
      .select(`
        *,
        sites (
          id,
          client_name,
          slug,
          status,
          created_at
        )
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Remove password hashes from response
    const sanitizedClients = clients.map(client => {
      const { password_hash, ...clientData } = client
      return clientData
    })

    res.status(200).json({
      success: true,
      clients: sanitizedClients
    })

  } catch (error) {
    console.error('Error fetching clients:', error)
    res.status(500).json({ 
      error: 'Failed to fetch clients',
      details: error.message
    })
  }
}

async function handleCreateClient(req, res) {
  try {
    const {
      name,
      email,
      password,
      site_id,
      is_active = true
    } = req.body

    // Validate required fields
    if (!name || !email || !password || !site_id) {
      return res.status(400).json({ error: 'Name, email, password, and site are required' })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' })
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' })
    }

    const supabase = createRouteHandlerClient()

    // Check if client with this email already exists for this site
    const { data: existingClient } = await supabase
      .from('client_users')
      .select('id')
      .eq('email', email)
      .eq('site_id', site_id)
      .single()

    if (existingClient) {
      return res.status(400).json({ error: 'Client with this email already exists for this site' })
    }

    // Verify site exists
    const { data: site, error: siteError } = await supabase
      .from('sites')
      .select('id, client_name')
      .eq('id', site_id)
      .single()

    if (siteError || !site) {
      return res.status(404).json({ error: 'Site not found' })
    }

    // Hash password
    const saltRounds = 12
    const password_hash = await bcrypt.hash(password, saltRounds)

    // Create client user
    const { data: client, error: createError } = await supabase
      .from('client_users')
      .insert([{
        name,
        email,
        password_hash,
        site_id,
        is_active
      }])
      .select(`
        *,
        sites (
          id,
          client_name,
          slug,
          status
        )
      `)
      .single()

    if (createError) throw createError

    // Remove password hash from response
    const { password_hash: _, ...clientResponse } = client

    res.status(201).json({
      success: true,
      message: 'Client created successfully',
      client: clientResponse
    })

  } catch (error) {
    console.error('Error creating client:', error)
    res.status(500).json({ 
      error: 'Failed to create client',
      details: error.message
    })
  }
}