import { createRouteHandlerClient } from '../../../../../lib/supabase'
import { DEFAULT_TEMPLATE_CONFIG } from '../../../../../utils/templateHelpers'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { templateId } = req.query
  const { newName, newCategory, duplicateComponent = false, configSchema } = req.body

  // Deep clone utility for complete isolation
  function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj
    if (obj instanceof Date) return new Date(obj.getTime())
    if (obj instanceof Array) return obj.map(item => deepClone(item))
    if (typeof obj === 'object') {
      const clonedObj = {}
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          clonedObj[key] = deepClone(obj[key])
        }
      }
      return clonedObj
    }
    return obj
  }

  try {
    const supabase = createRouteHandlerClient()

    // First, fetch the original template
    const { data: originalTemplate, error: fetchError } = await supabase
      .from('templates')
      .select('*')
      .eq('id', templateId)
      .single()

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return res.status(404).json({ error: 'Template not found' })
      }
      throw fetchError
    }

    // Helper function to copy file from one path to another in Supabase Storage
    async function copyFileInStorage(originalUrl, newPath) {
      if (!originalUrl) return null

      try {
        // Extract bucket and path from URL
        const urlParts = originalUrl.split('/storage/v1/object/public/')
        if (urlParts.length !== 2) return originalUrl

        const [bucketPath, filePath] = urlParts[1].split('/', 2)
        const remainingPath = urlParts[1].substring(bucketPath.length + 1)

        // Download the original file
        const { data: fileData, error: downloadError } = await supabase.storage
          .from(bucketPath)
          .download(remainingPath)

        if (downloadError) {
          console.warn('Could not download original file:', downloadError)
          return originalUrl // Return original URL if download fails
        }

        // Upload to new path
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(bucketPath)
          .upload(newPath, fileData, {
            upsert: true,
            contentType: fileData.type
          })

        if (uploadError) {
          console.warn('Could not upload copied file:', uploadError)
          return originalUrl // Return original URL if upload fails
        }

        // Return the new file URL
        const { data: { publicUrl } } = supabase.storage
          .from(bucketPath)
          .getPublicUrl(newPath)

        return publicUrl
      } catch (error) {
        console.warn('Error copying file:', error)
        return originalUrl // Return original URL if copy fails
      }
    }

    // Generate unique identifiers for the copied template with guaranteed uniqueness
    const timestamp = Date.now()
    const randomSuffix = Math.random().toString(36).substring(2, 8)
    const templateSlug = (newName || `${originalTemplate.name} (Copy)`)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 50) // Limit length
    const uniquePrefix = `${templateSlug}-${timestamp}-${randomSuffix}`

    // Helper function to duplicate component file
    async function duplicateComponentFile(originalComponentFile, newComponentFile) {
      if (!originalComponentFile || !duplicateComponent) return { component_file: originalComponentFile, component_path: originalTemplate.component_path }

      try {
        const fs = require('fs')
        const path = require('path')

        const templatesDir = path.join(process.cwd(), 'components', 'templates')
        const originalPath = path.join(templatesDir, `${originalComponentFile}.js`)
        const newPath = path.join(templatesDir, `${newComponentFile}.js`)

        // Check if original file exists
        if (!fs.existsSync(originalPath)) {
          return { component_file: originalComponentFile, component_path: originalTemplate.component_path }
        }

        // Read original file content
        const originalContent = fs.readFileSync(originalPath, 'utf8')

        // Replace component name in the content
        const newContent = originalContent
          .replace(new RegExp(`export default function ${originalComponentFile}`, 'g'), `export default function ${newComponentFile}`)
          .replace(new RegExp(`function ${originalComponentFile}`, 'g'), `function ${newComponentFile}`)

        // Write new file
        fs.writeFileSync(newPath, newContent)

        return {
          component_file: newComponentFile,
          component_path: `components/templates/${newComponentFile}.js`,
          fileCreated: true
        }
      } catch (error) {
        console.warn('Error duplicating component file:', error)
        return { component_file: originalComponentFile, component_path: originalTemplate.component_path }
      }
    }

    // Copy template images if they exist
    let copiedTemplateImageUrl = originalTemplate.template_image_url
    let copiedThumbnailUrl = originalTemplate.template_thumbnail_url
    let copiedPreviewImageUrl = originalTemplate.preview_image_url

    if (originalTemplate.template_image_url) {
      const newImagePath = `templates/${uniquePrefix}-template-image.png`
      copiedTemplateImageUrl = await copyFileInStorage(originalTemplate.template_image_url, newImagePath)
    }

    if (originalTemplate.template_thumbnail_url) {
      const newThumbnailPath = `templates/${uniquePrefix}-thumbnail.png`
      copiedThumbnailUrl = await copyFileInStorage(originalTemplate.template_thumbnail_url, newThumbnailPath)
    }

    if (originalTemplate.preview_image_url) {
      const newPreviewPath = `templates/${uniquePrefix}-preview.png`
      copiedPreviewImageUrl = await copyFileInStorage(originalTemplate.preview_image_url, newPreviewPath)
    }

    // Duplicate component file if requested with unique naming
    const newComponentName = `${templateSlug.replace(/-/g, '').replace(/copy/g, 'Copy')}${randomSuffix}`
    const componentDuplication = await duplicateComponentFile(originalTemplate.component_file, newComponentName)

    // Ensure complete isolation by deep cloning all data
    const isolatedConfigSchema = configSchema ? deepClone(configSchema) : deepClone(originalTemplate.config_schema)
    const isolatedBuilderData = deepClone(originalTemplate.builder_data)

    // Ensure config schema has proper structure to prevent runtime errors
    function ensureConfigSchemaStructure(schema) {
      if (!schema || Object.keys(schema).length === 0) {
        return deepClone(DEFAULT_TEMPLATE_CONFIG)
      }

      // If it's a modern structure with sections, ensure each section has fields
      if (schema.sections && Array.isArray(schema.sections)) {
        schema.sections = schema.sections.map(section => ({
          ...section,
          fields: section.fields || []
        }))
      }

      // If it's a legacy structure with direct fields, ensure fields exist
      if (schema.fields && !schema.sections) {
        schema.fields = schema.fields || []
      }

      return schema
    }

    const safeConfigSchema = ensureConfigSchemaStructure(isolatedConfigSchema)

    // Prepare the duplicate template data with complete isolation
    const duplicateData = {
      name: newName || `${originalTemplate.name} (Copy)`,
      type: originalTemplate.type,
      category: newCategory || originalTemplate.category,
      config_schema: safeConfigSchema,
      preview_image_url: copiedPreviewImageUrl,
      template_image_url: copiedTemplateImageUrl,
      template_thumbnail_url: copiedThumbnailUrl,
      is_active: originalTemplate.is_active,
      is_builder_template: originalTemplate.is_builder_template,
      builder_data: isolatedBuilderData,
      component_file: componentDuplication.component_file,
      component_path: componentDuplication.component_path,
      status: originalTemplate.status,
      // Ensure new timestamps
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Validation: Ensure no reference sharing
    if (isolatedConfigSchema === originalTemplate.config_schema) {
      console.warn('Warning: Config schema may share references')
    }
    if (isolatedBuilderData === originalTemplate.builder_data) {
      console.warn('Warning: Builder data may share references')
    }

    // Create the duplicate template
    const { data: duplicatedTemplate, error: createError } = await supabase
      .from('templates')
      .insert([duplicateData])
      .select()
      .single()

    if (createError) throw createError

    // If the original template has builder template versions, duplicate those too
    if (originalTemplate.is_builder_template) {
      const { data: templateVersions, error: versionsError } = await supabase
        .from('builder_template_versions')
        .select('*')
        .eq('template_id', templateId)

      if (versionsError) {
        console.warn('Error fetching template versions:', versionsError)
      } else if (templateVersions && templateVersions.length > 0) {
        // Duplicate all template versions with complete isolation
        const duplicateVersionsData = templateVersions.map(version => ({
          template_id: duplicatedTemplate.id,
          version_number: version.version_number,
          builder_data: deepClone(version.builder_data), // Ensure isolation
          version_name: version.version_name ? `${version.version_name} (Copy)` : null,
          created_by: version.created_by,
          is_published: false, // Set to false for safety
          created_at: new Date().toISOString() // New timestamp
        }))

        const { error: versionCreateError } = await supabase
          .from('builder_template_versions')
          .insert(duplicateVersionsData)

        if (versionCreateError) {
          console.warn('Error duplicating template versions:', versionCreateError)
        }
      }
    }

    res.status(201).json({
      success: true,
      message: 'Template duplicated successfully',
      originalTemplate,
      duplicatedTemplate,
      filesCopied: {
        template_image: copiedTemplateImageUrl !== originalTemplate.template_image_url,
        thumbnail: copiedThumbnailUrl !== originalTemplate.template_thumbnail_url,
        preview_image: copiedPreviewImageUrl !== originalTemplate.preview_image_url,
        component_file: componentDuplication.fileCreated || false
      },
      configurationUpdated: !!(configSchema && JSON.stringify(configSchema) !== JSON.stringify(originalTemplate.config_schema))
    })

  } catch (error) {
    console.error('Error duplicating template:', error)
    res.status(500).json({
      error: 'Failed to duplicate template',
      details: error.message
    })
  }
}