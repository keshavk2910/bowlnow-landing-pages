import jwt from 'jsonwebtoken'

export function verifyAdminToken(req) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  
  if (!token) {
    throw new Error('No authentication token provided')
  }

  try {
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET)
    
    if (decoded.type !== 'admin') {
      throw new Error('Invalid token type')
    }

    return decoded
  } catch (error) {
    throw new Error('Invalid authentication token')
  }
}

export function verifyClientToken(req) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  
  if (!token) {
    throw new Error('No authentication token provided')
  }

  try {
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET)
    
    if (decoded.type !== 'client') {
      throw new Error('Invalid token type')
    }

    return decoded
  } catch (error) {
    throw new Error('Invalid authentication token')
  }
}

export function requireAuth(handler, type = 'admin') {
  return async (req, res) => {
    try {
      const verifyFunction = type === 'admin' ? verifyAdminToken : verifyClientToken
      const decoded = verifyFunction(req)
      
      // Add user info to request
      req.user = decoded
      
      return handler(req, res)
    } catch (error) {
      return res.status(401).json({ error: error.message })
    }
  }
}