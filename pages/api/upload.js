import { IncomingForm } from 'formidable'
import { uploadFileToStorage, saveFileRecord } from '../../lib/file-upload'
import { getSiteById } from '../../lib/database'
import { createRouteHandlerClient } from '../../lib/supabase'
import fs from 'fs'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const form = new IncomingForm({
      maxFileSize: 100 * 1024 * 1024, // 100MB limit
      keepExtensions: true,
    })

    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err)
        else resolve({ fields, files })
      })
    })

    const file = Array.isArray(files.file) ? files.file[0] : files.file
    const siteId = Array.isArray(fields.siteId) ? fields.siteId[0] : fields.siteId
    const pageId = Array.isArray(fields.pageId) ? fields.pageId[0] : fields.pageId
    const fieldKey = Array.isArray(fields.fieldKey) ? fields.fieldKey[0] : fields.fieldKey

    if (!file || !siteId || !fieldKey) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Determine upload type
    const isLogo = fieldKey === 'site_logo'
    const isTemplate = fieldKey === 'template_image' || fieldKey === 'template_thumbnail'

    // Get site information (skip for template uploads)
    let site = null
    if (!isTemplate) {
      site = await getSiteById(siteId)
      if (!site) {
        return res.status(404).json({ error: 'Site not found' })
      }
    }

    // Get page name if pageId provided (only for page files, not logos)
    let pageName = 'general'
    if (pageId && !isLogo) {
      const supabase = createRouteHandlerClient()
      const { data: page } = await supabase
        .from('site_pages')
        .select('name')
        .eq('id', pageId)
        .single()
      
      pageName = page?.name || 'unknown-page'
    }

    // Read file data
    const fileBuffer = fs.readFileSync(file.filepath)
    
    // Create File object for upload
    const fileToUpload = new File([fileBuffer], file.originalFilename || file.newFilename, {
      type: file.mimetype
    })

    // Upload to Supabase Storage
    const siteName = isTemplate ? 'template' : site.client_name
    const uploadResult = await uploadFileToStorage(fileToUpload, siteName, pageName, isLogo, isTemplate)

    // Save file record to database (skip for template uploads)
    let fileRecord = null
    if (!isTemplate) {
      fileRecord = await saveFileRecord(
        {
          ...uploadResult,
          name: file.originalFilename || file.newFilename
        },
        siteId,
        pageId || null,
        fieldKey,
        {
          uploadedAt: new Date().toISOString(),
          userAgent: req.headers['user-agent'],
          ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress
        }
      )
    }

    // Clean up temporary file
    fs.unlinkSync(file.filepath)

    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      file: {
        id: fileRecord?.id || 'template_upload',
        url: uploadResult.url,
        filename: file.originalFilename || file.newFilename,
        size: uploadResult.size,
        type: uploadResult.type
      }
    })

  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ 
      error: 'Failed to upload file',
      details: error.message
    })
  }
}