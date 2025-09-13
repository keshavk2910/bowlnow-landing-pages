import { encryptToken, decryptToken, safeEncryptToken, safeDecryptToken } from '../../lib/encryption'

export default function handler(req, res) {
  if (process.env.NODE_ENV !== 'development') {
    return res.status(403).json({ error: 'This endpoint is only available in development mode' })
  }

  try {
    const testToken = 'pit-test-1234-5678-9012-abcdefghijkl'
    
    // Test encryption
    const encrypted = encryptToken(testToken)
    console.log('Encrypted:', encrypted)
    
    // Test decryption
    const decrypted = decryptToken(encrypted)
    console.log('Decrypted:', decrypted)
    
    // Test safe functions
    const safeEncrypted = safeEncryptToken(testToken)
    const safeDecrypted = safeDecryptToken(safeEncrypted)
    
    res.status(200).json({
      success: true,
      test: {
        original: testToken,
        encrypted,
        decrypted,
        safeEncrypted,
        safeDecrypted,
        match: testToken === decrypted && testToken === safeDecrypted
      },
      encryptionKey: process.env.NEXTAUTH_SECRET ? 'Set' : 'Not set'
    })

  } catch (error) {
    console.error('Encryption test error:', error)
    res.status(500).json({ 
      error: 'Encryption test failed',
      details: error.message
    })
  }
}