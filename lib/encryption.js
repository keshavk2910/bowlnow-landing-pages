import CryptoJS from 'crypto-js'

// Get encryption key from environment
const ENCRYPTION_KEY = process.env.NEXTAUTH_SECRET || 'bowlnow-default-key-change-in-production'

// Encrypt a token with IV
export function encryptToken(token) {
  try {
    // Generate random IV
    const iv = CryptoJS.lib.WordArray.random(16)
    
    // Encrypt the token
    const encrypted = CryptoJS.AES.encrypt(token, ENCRYPTION_KEY, { iv: iv })
    
    // Return both encrypted data and IV
    return {
      encrypted: encrypted.toString(),
      iv: iv.toString()
    }
  } catch (error) {
    console.error('Error encrypting token:', error)
    throw new Error('Failed to encrypt token')
  }
}

// Decrypt a token with IV
export function decryptToken(encryptedData, iv) {
  try {
    // Convert IV back to WordArray
    const ivWordArray = CryptoJS.enc.Hex.parse(iv)
    
    // Decrypt the token
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY, { iv: ivWordArray })
    const decrypted = bytes.toString(CryptoJS.enc.Utf8)
    
    if (!decrypted) {
      throw new Error('Failed to decrypt token - invalid encrypted data')
    }
    
    return decrypted
  } catch (error) {
    console.error('Error decrypting token:', error)
    throw new Error('Failed to decrypt token')
  }
}

// Validate if a string looks like an encrypted token
export function isEncryptedToken(token) {
  if (!token || typeof token !== 'string') return false
  
  // GHL Private Integration tokens start with 'pit-' and are not encrypted
  if (token.startsWith('pit-')) return false
  
  // Check if it looks like a CryptoJS encrypted string (starts with U2FsdGVkX1)
  if (token.startsWith('U2FsdGVkX1')) return true
  
  // Encrypted tokens are longer and contain base64-like characters
  return token.length > 100 && /^[A-Za-z0-9+/=]+$/.test(token)
}

// Safe token handling - encrypt if not already encrypted
export function safeEncryptToken(token) {
  if (!token) return null
  
  if (isEncryptedToken(token)) {
    return token // Already encrypted
  }
  
  const result = encryptToken(token)
  return result.encrypted // Return just the encrypted part for backward compatibility
}

// Safe token retrieval - decrypt if encrypted (with IV support)
export function safeDecryptToken(encryptedToken, iv = null) {
  if (!encryptedToken) return null
  
  if (isEncryptedToken(encryptedToken)) {
    if (iv) {
      return decryptToken(encryptedToken, iv)
    } else {
      // Try to decrypt without IV (backward compatibility)
      try {
        const bytes = CryptoJS.AES.decrypt(encryptedToken, ENCRYPTION_KEY)
        const decrypted = bytes.toString(CryptoJS.enc.Utf8)
        return decrypted || encryptedToken
      } catch (error) {
        console.error('Error decrypting without IV:', error)
        return encryptedToken
      }
    }
  }
  
  return encryptedToken // Not encrypted, return as-is
}

// New function to handle encryption with IV storage
export function encryptTokenWithIV(token) {
  if (!token) return { encrypted: null, iv: null }
  
  if (isEncryptedToken(token)) {
    return { encrypted: token, iv: null } // Already encrypted
  }
  
  return encryptToken(token) // Returns { encrypted, iv }
}