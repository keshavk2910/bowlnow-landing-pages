import { createClient } from '@supabase/supabase-js'
import { createRouteHandlerClient } from './supabase'

// Initialize Supabase Storage
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const storageClient = createClient(supabaseUrl, supabaseServiceKey)

// Generate file path for organized storage
export function generateFilePath(siteName, pageName, fileName, isLogo = false, isTemplate = false) {
  const timestamp = Date.now()
  const sanitizedFileName = `${timestamp}-${fileName.replace(/[^a-z0-9.-]/gi, '-')}`
  
  if (isTemplate) {
    // For template images - store in templates folder
    return `templates/${sanitizedFileName}`
  } else if (isLogo) {
    // For site logos - store in logos folder
    const sanitizedSiteName = siteName.toLowerCase().replace(/[^a-z0-9-]/g, '-')
    return `${sanitizedSiteName}/logos/${sanitizedFileName}`
  } else {
    // For page files
    const sanitizedSiteName = siteName.toLowerCase().replace(/[^a-z0-9-]/g, '-')
    const sanitizedPageName = pageName.toLowerCase().replace(/[^a-z0-9-]/g, '-')
    return `${sanitizedSiteName}/${sanitizedPageName}/${sanitizedFileName}`
  }
}

// Upload file to Supabase Storage
export async function uploadFileToStorage(file, siteName, pageName, isLogo = false, isTemplate = false) {
  try {
    const fileName = file.name || file.originalFilename || 'upload'
    const filePath = generateFilePath(siteName, pageName, fileName, isLogo, isTemplate)
    const bucket = isTemplate ? 'templates' : 'site-files'
    
    // Handle both File objects (browser) and buffer objects (Node.js)
    const fileData = file.buffer || file
    
    const { data, error } = await storageClient.storage
      .from(bucket)
      .upload(filePath, fileData, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type || file.mimetype
      })

    if (error) {
      console.error('Supabase storage error:', error)
      throw error
    }

    // Get public URL
    const { data: urlData } = storageClient.storage
      .from(bucket)
      .getPublicUrl(filePath)

    return {
      path: filePath,
      url: urlData.publicUrl,
      size: file.size || file.length,
      type: file.type || file.mimetype,
      name: fileName
    }
  } catch (error) {
    console.error('Error uploading file:', error)
    throw error
  }
}

// Save file record to database
export async function saveFileRecord(fileData, siteId, pageId, fieldKey, uploadContext = {}) {
  try {
    const supabase = createRouteHandlerClient()
    
    const { data, error } = await supabase
      .from('site_files')
      .insert([{
        site_id: siteId,
        page_id: pageId,
        filename: fileData.name,
        original_filename: fileData.name,
        file_path: fileData.path,
        file_url: fileData.url,
        file_size: fileData.size,
        mime_type: fileData.type,
        file_type: getFileType(fileData.type),
        field_key: fieldKey,
        upload_context: uploadContext
      }])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error saving file record:', error)
    throw error
  }
}

// Get files for a specific page and field
export async function getPageFiles(pageId, fieldKey = null) {
  try {
    const supabase = createRouteHandlerClient()
    
    let query = supabase
      .from('site_files')
      .select('*')
      .eq('page_id', pageId)
      .order('created_at', { ascending: false })

    if (fieldKey) {
      query = query.eq('field_key', fieldKey)
    }

    const { data, error } = await query

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching page files:', error)
    throw error
  }
}

// Delete file from storage and database
export async function deleteFile(fileId) {
  try {
    const supabase = createRouteHandlerClient()
    
    // Get file data first
    const { data: file, error: fetchError } = await supabase
      .from('site_files')
      .select('*')
      .eq('id', fileId)
      .single()

    if (fetchError) throw fetchError

    // Delete from storage
    const { error: storageError } = await storageClient.storage
      .from('site-files')
      .remove([file.file_path])

    if (storageError) {
      console.error('Storage deletion error:', storageError)
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from('site_files')
      .delete()
      .eq('id', fileId)

    if (dbError) throw dbError

    return true
  } catch (error) {
    console.error('Error deleting file:', error)
    throw error
  }
}

// Determine file type based on MIME type
function getFileType(mimeType) {
  if (mimeType.startsWith('image/')) return 'image'
  if (mimeType.startsWith('video/')) return 'video'
  if (mimeType.startsWith('audio/')) return 'audio'
  if (mimeType.includes('pdf')) return 'pdf'
  if (mimeType.includes('word') || mimeType.includes('document')) return 'document'
  if (mimeType.includes('sheet') || mimeType.includes('excel')) return 'spreadsheet'
  return 'other'
}

// Get file extension
export function getFileExtension(filename) {
  return filename.split('.').pop().toLowerCase()
}

// Validate file type
export function validateFileType(file, allowedTypes = ['image']) {
  const fileType = getFileType(file.type)
  return allowedTypes.includes(fileType)
}

// Validate file size
export function validateFileSize(file, maxSizeMB = 10) {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  return file.size <= maxSizeBytes
}