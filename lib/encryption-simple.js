import CryptoJS from 'crypto-js'

// Get encryption key from environment
const ENCRYPTION_KEY = process.env.NEXTAUTH_SECRET || 'bowlnow-default-key-change-in-production'

// Simple encrypt function
export function encryptToken(token) {
  if (!token) return null
  
  // Don't encrypt GHL tokens that start with 'pit-'
  if (token.startsWith('pit-')) {
    try {
      const encrypted = CryptoJS.AES.encrypt(token, ENCRYPTION_KEY).toString()
      return encrypted
    } catch (error) {
      console.error('Error encrypting token:', error)
      return null
    }
  }
  
  return token
}

// Simple decrypt function
export function decryptToken(encryptedToken) {
  if (!encryptedToken) return null
  
  // If it starts with U2FsdGVkX1 (Salted__ in base64), it's encrypted
  if (encryptedToken.startsWith('U2FsdGVkX1')) {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedToken, ENCRYPTION_KEY)
      const decrypted = bytes.toString(CryptoJS.enc.Utf8)
      return decrypted || encryptedToken
    } catch (error) {
      console.error('Error decrypting token:', error)
      return encryptedToken
    }
  }
  
  return encryptedToken
}

// Check if token is encrypted
export function isEncrypted(token) {
  return token && token.startsWith('U2FsdGVkX1')
}

// Main functions to use
export function saveToken(token) {
  if (!token) return null
  if (token.startsWith('pit-')) {
    return encryptToken(token)
  }
  return token
}

export function retrieveToken(storedToken) {
  if (!storedToken) return null
  return decryptToken(storedToken)
}