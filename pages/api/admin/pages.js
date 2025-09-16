import { createSitePage, getSitePages, getSiteById } from '../../../lib/database'
import { createRouteHandlerClient } from '../../../lib/supabase'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    return handleCreatePage(req, res)
  } else if (req.method === 'GET') {
    return handleGetPages(req, res)
  } else {
    return res.status(405).json({ error: 'Method not allowed' })
  }
}

async function handleCreatePage(req, res) {
  try {
    const {
      site_id,
      name,
      slug,
      page_type,
      template_id,
      is_homepage = false,
      is_published = false,
      content = {},
      pipeline_id = null,
      stage_mappings = {}
    } = req.body

    // Validate required fields
    if (!site_id || !name || !slug || !page_type || !template_id) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Validate slug format
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return res.status(400).json({ error: 'Slug can only contain lowercase letters, numbers, and hyphens' })
    }

    const supabase = createRouteHandlerClient()

    // Check if slug already exists for this site
    const { data: existingPage } = await supabase
      .from('site_pages')
      .select('id')
      .eq('site_id', site_id)
      .eq('slug', slug)
      .single()

    if (existingPage) {
      return res.status(400).json({ error: 'Page with this slug already exists for this site' })
    }

    // If setting as homepage, unset other homepages
    if (is_homepage) {
      await supabase
        .from('site_pages')
        .update({ is_homepage: false })
        .eq('site_id', site_id)
    }

    // Get template to set default content
    const { data: template } = await supabase
      .from('templates')
      .select('*')
      .eq('id', template_id)
      .single()

    let defaultContent = content
    if (template && Object.keys(content).length === 0) {
      // Set default content based on template
      defaultContent = {
        title: name,
        meta_description: `${name} - Professional page`,
        ...getDefaultContentForTemplate(template, name)
      }
    }

    // Create the page
    const pageData = {
      site_id,
      template_id,
      name,
      slug,
      page_type,
      content: defaultContent,
      is_homepage,
      is_published,
      pipeline_id,
      stage_mappings
    }

    const page = await createSitePage(pageData)

    res.status(201).json({
      success: true,
      message: 'Page created successfully',
      page
    })

  } catch (error) {
    console.error('Error creating page:', error)
    res.status(500).json({ 
      error: 'Failed to create page',
      details: error.message
    })
  }
}

async function handleGetPages(req, res) {
  try {
    const { site_id } = req.query

    if (!site_id) {
      return res.status(400).json({ error: 'Site ID is required' })
    }

    const pages = await getSitePages(site_id)

    res.status(200).json({
      success: true,
      pages: pages || []
    })

  } catch (error) {
    console.error('Error fetching pages:', error)
    res.status(500).json({ 
      error: 'Failed to fetch pages',
      details: error.message
    })
  }
}

function getDefaultContentForTemplate(template, pageName) {
  const defaultContent = {}
  
  if (template.config_schema.fields) {
    template.config_schema.fields.forEach(field => {
      switch (field.key) {
        case 'hero_title':
          defaultContent[field.key] = `Welcome to ${pageName}`
          break
        case 'hero_subtitle':
          defaultContent[field.key] = 'Experience excellence with our services'
          break
        case 'title':
          defaultContent[field.key] = pageName
          break
        case 'cta_text':
          defaultContent[field.key] = 'Get Started'
          break
        case 'cta_link':
          defaultContent[field.key] = '#contact'
          break
        default:
          if (field.required) {
            defaultContent[field.key] = `Default ${field.label}`
          }
      }
    })
  }
  
  return defaultContent
}