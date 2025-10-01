import { createRouteHandlerClient } from '../../../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const supabase = createRouteHandlerClient()

    // Get all templates that might have card_grid sections
    const { data: templates, error: fetchError } = await supabase
      .from('templates')
      .select('*')
      .not('config_schema', 'is', null)

    if (fetchError) {
      console.error('Error fetching templates:', fetchError)
      return res.status(500).json({ error: 'Failed to fetch templates' })
    }

    let updatedCount = 0

    for (const template of templates) {
      if (template.config_schema?.sections) {
        let needsUpdate = false
        const updatedSections = template.config_schema.sections.map(section => {
          if (section.key === 'card_grid') {
            const updatedFields = section.fields.map(field => {
              if (field.key === 'cards') {
                // Check if the columns already have the correct types
                const hasCorrectTypes = field.columns?.some(col => 
                  (col.key === 'description' && col.type === 'richtext') ||
                  (col.key === 'image' && col.type === 'image')
                )
                
                if (!hasCorrectTypes) {
                  needsUpdate = true
                  return {
                    ...field,
                    columns: [
                      { key: 'title', label: 'Card Title', type: 'text' },
                      { key: 'description', label: 'Description', type: 'richtext' },
                      { key: 'icon', label: 'Icon (Emoji)', type: 'text' },
                      { key: 'image', label: 'Image', type: 'image' },
                      { key: 'cta_text', label: 'CTA Text', type: 'text' },
                      { key: 'cta_link', label: 'CTA Link', type: 'text' }
                    ]
                  }
                }
              }
              return field
            })
            
            return {
              ...section,
              fields: updatedFields
            }
          }
          return section
        })

        if (needsUpdate) {
          const updatedConfigSchema = {
            ...template.config_schema,
            sections: updatedSections
          }

          const { error: updateError } = await supabase
            .from('templates')
            .update({ config_schema: updatedConfigSchema })
            .eq('id', template.id)

          if (updateError) {
            console.error(`Error updating template ${template.id}:`, updateError)
          } else {
            updatedCount++
            console.log(`Updated template: ${template.name} (${template.id})`)
          }
        }
      }
    }

    res.status(200).json({
      success: true,
      message: `Updated ${updatedCount} templates with correct Card Grid field types`,
      templatesUpdated: updatedCount,
      totalTemplates: templates.length
    })

  } catch (error) {
    console.error('Error updating Card Grid configuration:', error)
    res.status(500).json({ 
      error: 'Failed to update Card Grid configuration',
      details: error.message
    })
  }
}
