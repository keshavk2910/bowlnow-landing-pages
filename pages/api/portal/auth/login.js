import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { createRouteHandlerClient } from '../../../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email, password } = req.body

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const supabase = createRouteHandlerClient()

    // Find client user by email
    const { data: clientUser, error } = await supabase
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
      .eq('email', email)
      .eq('is_active', true)
      .single()

    if (error || !clientUser) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    // Verify password
    const passwordValid = await bcrypt.compare(password, clientUser.password_hash)
    
    if (!passwordValid) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    // Check if associated site is active
    if (!clientUser.sites || clientUser.sites.status !== 'active') {
      return res.status(401).json({ error: 'Account is inactive. Please contact support.' })
    }

    // Update last login
    await supabase
      .from('client_users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', clientUser.id)

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: clientUser.id,
        siteId: clientUser.site_id,
        email: clientUser.email,
        type: 'client'
      },
      process.env.NEXTAUTH_SECRET,
      { expiresIn: '7d' }
    )

    // Remove sensitive data
    const userResponse = {
      id: clientUser.id,
      email: clientUser.email,
      name: clientUser.name,
      siteId: clientUser.site_id,
      site: {
        id: clientUser.sites.id,
        name: clientUser.sites.client_name,
        slug: clientUser.sites.slug,
        status: clientUser.sites.status
      }
    }

    res.status(200).json({
      success: true,
      token,
      user: userResponse
    })

  } catch (error) {
    console.error('Portal login error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Install bcrypt and jsonwebtoken packages
// npm install bcrypt @types/bcrypt jsonwebtoken @types/jsonwebtoken