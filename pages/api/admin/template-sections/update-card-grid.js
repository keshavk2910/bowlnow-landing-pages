import { createRouteHandlerClient } from '../../../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const supabase = createRouteHandlerClient()

    // Update CardGrid section configuration to use proper field types
    const { data: cardGridSection, error: fetchError } = await supabase
      .from('template_sections')
      .select('*')
      .eq('component_name', 'CardGrid')
      .single()

    if (fetchError) {
      console.error('Error fetching CardGrid section:', fetchError)
      return res.status(404).json({ error: 'CardGrid section not found' })
    }

    // Update the config_schema to use proper field types
    const updatedConfigSchema = {
      ...cardGridSection.config_schema,
      fields: cardGridSection.config_schema.fields.map(field => {
        if (field.key === 'cards') {
          // Update the cards table field to use proper column types
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
        return field
      })
    }

    // Update the section in the database
    const { data: updatedSection, error: updateError } = await supabase
      .from('template_sections')
      .update({ config_schema: updatedConfigSchema })
      .eq('component_name', 'CardGrid')
      .select()
      .single()

    if (updateError) {
      console.error('Error updating CardGrid section:', updateError)
      return res.status(500).json({ error: 'Failed to update CardGrid section' })
    }

    // Also update any templates that use this section
    const { data: templates, error: templatesError } = await supabase
      .from('templates')
      .select('*')
      .not('config_schema', 'is', null)

    if (!templatesError && templates) {
      for (const template of templates) {
        if (template.config_schema?.sections) {
          const updatedSections = template.config_schema.sections.map(section => {
            if (section.key === 'card_grid') {
              return {
                ...section,
                fields: section.fields.map(field => {
                  if (field.key === 'cards') {
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
                  return field
                })
              }
            }
            return section
          })

          const updatedConfigSchema = {
            ...template.config_schema,
            sections: updatedSections
          }

          await supabase
            .from('templates')
            .update({ config_schema: updatedConfigSchema })
            .eq('id', template.id)
        }
      }
    }

    res.status(200).json({
      success: true,
      message: 'CardGrid section updated successfully',
      section: updatedSection,
      templatesUpdated: templates?.length || 0
    })

  } catch (error) {
    console.error('Error updating CardGrid section:', error)
    res.status(500).json({ 
      error: 'Failed to update CardGrid section',
      details: error.message
    })
  }
}
