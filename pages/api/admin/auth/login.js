import jwt from 'jsonwebtoken'

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

    // Get authorized emails from environment
    const authorizedEmails = process.env.ADMIN_EMAIL?.split(',').map(e => e.trim()) || []
    const adminPassword = process.env.ADMIN_PASS

    if (!adminPassword) {
      return res.status(500).json({ error: 'Admin authentication not configured' })
    }

    // Check if email is authorized
    if (!authorizedEmails.includes(email)) {
      return res.status(401).json({ error: 'Email not authorized for admin access' })
    }

    // Verify password
    if (password !== adminPassword) {
      return res.status(401).json({ error: 'Invalid password' })
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        email: email,
        type: 'admin',
        authorizedAt: new Date().toISOString()
      },
      process.env.NEXTAUTH_SECRET,
      { expiresIn: '24h' }
    )

    // Create user response
    const userResponse = {
      email: email,
      type: 'admin',
      name: email.split('@')[0], // Use email prefix as name
      authorizedAt: new Date().toISOString()
    }

    res.status(200).json({
      success: true,
      token,
      user: userResponse,
      message: 'Admin login successful'
    })

  } catch (error) {
    console.error('Admin login error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}