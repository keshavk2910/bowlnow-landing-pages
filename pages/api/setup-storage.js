import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    return res.status(403).json({ error: 'This endpoint is only available in development' })
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    // Create storage bucket if it doesn't exist
    const { data: bucket, error: bucketError } = await supabase.storage.createBucket('site-files', {
      public: true,
      allowedMimeTypes: ['image/*', 'video/*', 'application/pdf'],
      fileSizeLimit: 10485760 // 10MB
    })

    if (bucketError && !bucketError.message.includes('already exists')) {
      console.error('Bucket creation error:', bucketError)
      return res.status(500).json({ error: 'Failed to create storage bucket', details: bucketError.message })
    }

    // Set bucket policy to allow public read access
    const { error: policyError } = await supabase.storage.from('site-files').updateBucket({
      public: true
    })

    if (policyError) {
      console.log('Policy update note:', policyError.message)
    }

    res.status(200).json({
      success: true,
      message: 'Storage bucket created and configured successfully',
      bucket: bucket || 'Already exists'
    })

  } catch (error) {
    console.error('Storage setup error:', error)
    res.status(500).json({ 
      error: 'Failed to setup storage',
      details: error.message
    })
  }
}