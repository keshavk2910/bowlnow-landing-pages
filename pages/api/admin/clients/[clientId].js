import bcrypt from 'bcrypt'
import { createRouteHandlerClient } from '../../../../lib/supabase'

export default async function handler(req, res) {
  const { clientId } = req.query

  if (req.method === 'GET') {
    return handleGetClient(req, res, clientId)
  } else if (req.method === 'PATCH') {
    return handleUpdateClient(req, res, clientId)
  } else if (req.method === 'DELETE') {
    return handleDeleteClient(req, res, clientId)
  } else {
    return res.status(405).json({ error: 'Method not allowed' })
  }
}

async function handleGetClient(req, res, clientId) {
  try {
    const supabase = createRouteHandlerClient()
    
    const { data: client, error } = await supabase
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
      .eq('id', clientId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Client not found' })
      }
      throw error
    }

    // Remove password hash from response
    const { password_hash, ...clientData } = client

    res.status(200).json({
      success: true,
      client: clientData
    })

  } catch (error) {
    console.error('Error fetching client:', error)
    res.status(500).json({ 
      error: 'Failed to fetch client',
      details: error.message
    })
  }
}

async function handleUpdateClient(req, res, clientId) {
  try {
    const updates = req.body
    const supabase = createRouteHandlerClient()

    // Remove any fields that shouldn't be updated directly
    delete updates.id
    delete updates.created_at
    delete updates.updated_at
    delete updates.site_id // Prevent changing site assignment

    // Hash new password if provided
    if (updates.password) {
      if (updates.password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters long' })
      }
      
      const saltRounds = 12
      updates.password_hash = await bcrypt.hash(updates.password, saltRounds)
      delete updates.password // Remove plain text password
    }

    // Check if email is being changed and validate uniqueness
    if (updates.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(updates.email)) {
        return res.status(400).json({ error: 'Invalid email format' })
      }

      // Get current client to check site_id
      const { data: currentClient } = await supabase
        .from('client_users')
        .select('site_id')
        .eq('id', clientId)
        .single()

      if (currentClient) {
        // Check if email exists for this site
        const { data: existingClient } = await supabase
          .from('client_users')
          .select('id')
          .eq('email', updates.email)
          .eq('site_id', currentClient.site_id)
          .neq('id', clientId)
          .single()

        if (existingClient) {
          return res.status(400).json({ error: 'Email already exists for this site' })
        }
      }
    }

    const { data: updatedClient, error } = await supabase
      .from('client_users')
      .update(updates)
      .eq('id', clientId)
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

    if (error) throw error

    // Remove password hash from response
    const { password_hash, ...clientResponse } = updatedClient

    res.status(200).json({
      success: true,
      message: 'Client updated successfully',
      client: clientResponse
    })

  } catch (error) {
    console.error('Error updating client:', error)
    res.status(500).json({ 
      error: 'Failed to update client',
      details: error.message
    })
  }
}

async function handleDeleteClient(req, res, clientId) {
  try {
    const supabase = createRouteHandlerClient()
    
    // First check if client exists and get info
    const { data: client, error: fetchError } = await supabase
      .from('client_users')
      .select('name, email, sites(client_name)')
      .eq('id', clientId)
      .single()

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return res.status(404).json({ error: 'Client not found' })
      }
      throw fetchError
    }

    // Delete the client
    const { error: deleteError } = await supabase
      .from('client_users')
      .delete()
      .eq('id', clientId)

    if (deleteError) throw deleteError

    res.status(200).json({
      success: true,
      message: `Client "${client.name}" deleted successfully`
    })

  } catch (error) {
    console.error('Error deleting client:', error)
    res.status(500).json({ 
      error: 'Failed to delete client',
      details: error.message
    })
  }
}