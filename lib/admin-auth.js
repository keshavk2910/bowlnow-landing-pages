import jwt from 'jsonwebtoken'

// Verify admin token and return user data
export function verifyAdminToken(req) {
  const token = req.headers.authorization?.replace('Bearer ', '') || 
                req.cookies?.admin_token ||
                req.headers.cookie?.split('admin_token=')[1]?.split(';')[0]
  
  if (!token) {
    throw new Error('No authentication token provided')
  }

  try {
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET)
    
    if (decoded.type !== 'admin') {
      throw new Error('Invalid token type')
    }

    // Verify email is still authorized
    const authorizedEmails = process.env.ADMIN_EMAIL?.split(',').map(e => e.trim()) || []
    if (!authorizedEmails.includes(decoded.email)) {
      throw new Error('Email no longer authorized')
    }

    return {
      email: decoded.email,
      type: 'admin',
      authorizedAt: decoded.authorizedAt
    }
  } catch (error) {
    throw new Error('Invalid authentication token')
  }
}

// Middleware function to protect admin routes
export function requireAdminAuth(handler) {
  return async (req, res) => {
    try {
      const user = verifyAdminToken(req)
      
      // Add user info to request
      req.adminUser = user
      
      return handler(req, res)
    } catch (error) {
      return res.status(401).json({ error: error.message })
    }
  }
}

// Check if user is authenticated (for client-side)
export function isAdminAuthenticated() {
  if (typeof window === 'undefined') return false
  
  const token = localStorage.getItem('admin_token')
  const user = localStorage.getItem('admin_user')
  
  if (!token || !user) return false
  
  try {
    const decoded = jwt.decode(token)
    if (!decoded || decoded.exp * 1000 < Date.now()) {
      // Token expired
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')
      return false
    }
    
    return true
  } catch (error) {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    return false
  }
}

// Logout function
export function adminLogout() {
  localStorage.removeItem('admin_token')
  localStorage.removeItem('admin_user')
  window.location.href = '/admin/login'
}

// Get current admin user
export function getCurrentAdminUser() {
  if (typeof window === 'undefined') return null
  
  try {
    const user = localStorage.getItem('admin_user')
    return user ? JSON.parse(user) : null
  } catch (error) {
    return null
  }
}