import { createRouteHandlerClient } from '../../../../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { templateId } = req.query
  const { duplicatedTemplateId } = req.body

  try {
    const supabase = createRouteHandlerClient()

    // Fetch both templates
    const { data: originalTemplate, error: originalError } = await supabase
      .from('templates')
      .select('*')
      .eq('id', templateId)
      .single()

    const { data: duplicatedTemplate, error: duplicatedError } = await supabase
      .from('templates')
      .select('*')
      .eq('id', duplicatedTemplateId)
      .single()

    if (originalError || duplicatedError) {
      return res.status(404).json({ error: 'Template(s) not found' })
    }

    // Isolation verification tests
    const isolationTests = {
      differentIds: originalTemplate.id !== duplicatedTemplate.id,
      differentNames: originalTemplate.name !== duplicatedTemplate.name,
      differentTimestamps: originalTemplate.created_at !== duplicatedTemplate.created_at,
      configSchemaIsolation: JSON.stringify(originalTemplate.config_schema) !== JSON.stringify(duplicatedTemplate.config_schema) ||
                            originalTemplate.config_schema === null ||
                            duplicatedTemplate.config_schema === null,
      builderDataIsolation: JSON.stringify(originalTemplate.builder_data) !== JSON.stringify(duplicatedTemplate.builder_data) ||
                           originalTemplate.builder_data === null ||
                           duplicatedTemplate.builder_data === null,
      imageUrlsIsolation: {
        templateImage: originalTemplate.template_image_url !== duplicatedTemplate.template_image_url,
        thumbnail: originalTemplate.template_thumbnail_url !== duplicatedTemplate.template_thumbnail_url,
        preview: originalTemplate.preview_image_url !== duplicatedTemplate.preview_image_url
      },
      componentFileIsolation: originalTemplate.component_file !== duplicatedTemplate.component_file ||
                             originalTemplate.component_path !== duplicatedTemplate.component_path
    }

    // Check builder template versions isolation
    let builderVersionsIsolation = { tested: false, isolated: true }
    if (originalTemplate.is_builder_template && duplicatedTemplate.is_builder_template) {
      const { data: originalVersions } = await supabase
        .from('builder_template_versions')
        .select('*')
        .eq('template_id', templateId)

      const { data: duplicatedVersions } = await supabase
        .from('builder_template_versions')
        .select('*')
        .eq('template_id', duplicatedTemplateId)

      builderVersionsIsolation = {
        tested: true,
        isolated: originalVersions?.length !== duplicatedVersions?.length ||
                 !originalVersions?.every((ov, i) =>
                   duplicatedVersions?.[i] &&
                   JSON.stringify(ov.builder_data) !== JSON.stringify(duplicatedVersions[i].builder_data)
                 ),
        originalCount: originalVersions?.length || 0,
        duplicatedCount: duplicatedVersions?.length || 0
      }
    }

    // Overall isolation score
    const isolationScore = Object.values(isolationTests).filter(test =>
      typeof test === 'boolean' ? test :
      typeof test === 'object' ? Object.values(test).every(v => v) : true
    ).length

    const totalTests = Object.keys(isolationTests).length
    const isolationPercentage = Math.round((isolationScore / totalTests) * 100)

    res.status(200).json({
      success: true,
      isolation: {
        score: isolationScore,
        totalTests,
        percentage: isolationPercentage,
        fullyIsolated: isolationPercentage === 100
      },
      tests: {
        ...isolationTests,
        builderVersionsIsolation
      },
      templates: {
        original: {
          id: originalTemplate.id,
          name: originalTemplate.name,
          created_at: originalTemplate.created_at
        },
        duplicated: {
          id: duplicatedTemplate.id,
          name: duplicatedTemplate.name,
          created_at: duplicatedTemplate.created_at
        }
      }
    })

  } catch (error) {
    console.error('Error verifying isolation:', error)
    res.status(500).json({
      error: 'Failed to verify isolation',
      details: error.message
    })
  }
}