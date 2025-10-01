-- Update BookYourEventHalf section to include image fields
UPDATE template_sections 
SET config_schema = '{
  "fields": [
    {
      "key": "enabled",
      "type": "checkbox",
      "label": "Enable",
      "required": false,
      "description": "Show/hide this section"
    },
    {
      "key": "title",
      "type": "text",
      "label": "Title",
      "required": false,
      "description": "Main headline for the section"
    },
    {
      "key": "subtitle",
      "type": "text",
      "label": "Subtitle",
      "required": false,
      "description": "Secondary headline"
    },
    {
      "key": "description",
      "type": "textarea",
      "label": "Description",
      "required": false,
      "description": "Detailed description text"
    },
    {
      "key": "background_image",
      "type": "image",
      "label": "Background Image",
      "required": false,
      "description": "Background image for the section"
    },
    {
      "key": "image_alt",
      "type": "text",
      "label": "Image Alt Text",
      "required": false,
      "description": "Alternative text for the image (for accessibility)"
    },
    {
      "key": "secondary_image",
      "type": "image",
      "label": "Secondary Image",
      "required": false,
      "description": "Optional secondary image for additional visual content"
    },
    {
      "key": "cta_text",
      "type": "text",
      "label": "CTA Text",
      "required": false,
      "description": "Call to action button text"
    },
    {
      "key": "cta_link",
      "type": "url",
      "label": "CTA Link",
      "required": false,
      "description": "Call to action button link"
    }
  ]
}',
updated_at = NOW()
WHERE component_name = 'BookYourEventHalf';

-- Update BookYourEventLeft section to include additional image fields
UPDATE template_sections 
SET config_schema = '{
  "fields": [
    {
      "key": "enabled",
      "type": "checkbox",
      "label": "Enable",
      "required": false,
      "description": "Show/hide this section"
    },
    {
      "key": "title",
      "type": "text",
      "label": "Title",
      "required": false,
      "description": "Main headline for the section"
    },
    {
      "key": "subtitle",
      "type": "text",
      "label": "Subtitle",
      "required": false,
      "description": "Secondary headline"
    },
    {
      "key": "description",
      "type": "textarea",
      "label": "Description",
      "required": false,
      "description": "Detailed description text"
    },
    {
      "key": "background_image",
      "type": "image",
      "label": "Background Image",
      "required": false,
      "description": "Background image for the section"
    },
    {
      "key": "image_alt",
      "type": "text",
      "label": "Image Alt Text",
      "required": false,
      "description": "Alternative text for the image (for accessibility)"
    },
    {
      "key": "image_position",
      "type": "text",
      "label": "Image Position (left/right)",
      "required": false,
      "description": "Position of the image relative to content"
    },
    {
      "key": "show_image",
      "type": "checkbox",
      "label": "Show Image",
      "required": false,
      "description": "Show or hide the image"
    },
    {
      "key": "secondary_image",
      "type": "image",
      "label": "Secondary Image",
      "required": false,
      "description": "Optional secondary image for additional visual content"
    },
    {
      "key": "cta_text",
      "type": "text",
      "label": "CTA Text",
      "required": false,
      "description": "Call to action button text"
    },
    {
      "key": "cta_link",
      "type": "url",
      "label": "CTA Link",
      "required": false,
      "description": "Call to action button link"
    }
  ]
}',
updated_at = NOW()
WHERE component_name = 'BookYourEventLeft';

-- Verify the updates
SELECT 
  name,
  component_name,
  config_schema->>'fields' as fields_json
FROM template_sections 
WHERE component_name IN ('BookYourEventHalf', 'BookYourEventLeft');
