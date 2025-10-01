-- Create template_sections table
CREATE TABLE IF NOT EXISTS template_sections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  component_name VARCHAR(255) NOT NULL,
  config_schema JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_template_sections_component_name ON template_sections(component_name);
CREATE INDEX IF NOT EXISTS idx_template_sections_is_active ON template_sections(is_active);

-- Insert default template sections
INSERT INTO template_sections (name, description, component_name, config_schema, is_active) VALUES
(
  'Card Grid',
  'Display a grid of service cards with customizable layout',
  'CardGrid',
  '{
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
        "label": "Section Title",
        "required": false,
        "description": "Main title for the card grid section"
      },
      {
        "key": "subtitle",
        "type": "text",
        "label": "Section Subtitle",
        "required": false,
        "description": "Subtitle for the card grid section"
      },
      {
        "key": "columns",
        "type": "text",
        "label": "Number of Columns (1-6)",
        "required": false,
        "description": "Number of columns in the grid (1-6)"
      },
      {
        "key": "rows",
        "type": "text",
        "label": "Number of Rows (optional)",
        "required": false,
        "description": "Limit number of rows (leave empty for auto)"
      },
      {
        "key": "card_style",
        "type": "text",
        "label": "Card Style (default/bordered)",
        "required": false,
        "description": "Visual style for the cards"
      },
      {
        "key": "cards",
        "type": "table",
        "label": "Cards",
        "required": false,
        "description": "Add cards to display in the grid",
        "columns": [
          { "key": "title", "label": "Title", "type": "text" },
          { "key": "description", "label": "Description", "type": "text" },
          { "key": "icon", "label": "Icon (emoji)", "type": "text" },
          { "key": "image", "label": "Image URL", "type": "text" },
          { "key": "cta_text", "label": "CTA Text", "type": "text" },
          { "key": "cta_link", "label": "CTA Link", "type": "text" }
        ],
        "minRows": 0,
        "maxRows": 100
      }
    ]
  }',
  true
),
(
  'Promo Banner',
  'Promotional banner with image background and call-to-action',
  'PromoBannerSection',
  '{
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
        "description": "Main headline for the banner"
      },
      {
        "key": "subtitle",
        "type": "textarea",
        "label": "Subtitle",
        "required": false,
        "description": "Supporting text for the banner"
      },
      {
        "key": "background_image",
        "type": "image",
        "label": "Background Image",
        "required": false,
        "description": "Banner background image"
      },
      {
        "key": "cta_text",
        "type": "text",
        "label": "CTA Text",
        "required": false,
        "description": "Primary button text"
      },
      {
        "key": "cta_link",
        "type": "url",
        "label": "CTA Link",
        "required": false,
        "description": "Primary button link"
      }
    ]
  }',
  true
),
(
  'Book Your Event Left',
  'Two-column layout with content and image for event booking',
  'BookYourEventLeft',
  '{
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
      },
      {
        "key": "background_image",
        "type": "image",
        "label": "Background Image",
        "required": false,
        "description": "Section background image"
      }
    ]
  }',
  true
),
(
  'Register Now Section',
  'Registration section with optional form and urgency messaging',
  'RegisterNowSection',
  '{
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
        "description": "Main headline for registration"
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
        "description": "Registration description text"
      },
      {
        "key": "cta_text",
        "type": "text",
        "label": "CTA Text",
        "required": false,
        "description": "Registration button text"
      },
      {
        "key": "cta_link",
        "type": "url",
        "label": "CTA Link",
        "required": false,
        "description": "Registration button link"
      },
      {
        "key": "show_form",
        "type": "checkbox",
        "label": "Show Registration Form",
        "required": false,
        "description": "Display inline registration form"
      }
    ]
  }',
  true
),
(
  'Review Section',
  'Customer reviews and testimonials with multiple layout options',
  'Review',
  '{
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
        "label": "Section Title",
        "required": false,
        "description": "Main title for reviews section"
      },
      {
        "key": "subtitle",
        "type": "text",
        "label": "Section Subtitle",
        "required": false,
        "description": "Subtitle for reviews section"
      },
      {
        "key": "layout",
        "type": "text",
        "label": "Layout (grid/list/carousel)",
        "required": false,
        "description": "Layout style for reviews"
      },
      {
        "key": "show_ratings",
        "type": "checkbox",
        "label": "Show Star Ratings",
        "required": false,
        "description": "Display star ratings"
      },
      {
        "key": "show_avatars",
        "type": "checkbox",
        "label": "Show Customer Avatars",
        "required": false,
        "description": "Display customer profile images"
      }
    ]
   }',
   true
 ),
 (
   'Book Your Event Half',
   'Half-width event booking section with call-to-action',
   'BookYourEventHalf',
   '{
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
   true
 ),
 (
   'FAQ Section',
   'Frequently Asked Questions with expandable answers',
   'FAQField',
   '{
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
         "label": "Section Title",
         "required": false,
         "description": "Main title for FAQ section"
       },
       {
         "key": "subtitle",
         "type": "text",
         "label": "Section Subtitle",
         "required": false,
         "description": "Subtitle for FAQ section"
       },
       {
         "key": "faqs",
         "type": "table",
         "label": "FAQs",
         "required": false,
         "description": "Add frequently asked questions",
         "columns": [
           { "key": "question", "label": "Question", "type": "text" },
           { "key": "answer", "label": "Answer", "type": "text" }
         ],
         "minRows": 1,
         "maxRows": 50
       }
     ]
   }',
   true
 ),
 (
   'Footer Section',
   'Website footer with links and contact information',
   'Footer',
   '{
     "fields": [
       {
         "key": "enabled",
         "type": "checkbox",
         "label": "Enable",
         "required": false,
         "description": "Show/hide this section"
       },
       {
         "key": "company_name",
         "type": "text",
         "label": "Company Name",
         "required": false,
         "description": "Company or business name"
       },
       {
         "key": "address",
         "type": "textarea",
         "label": "Address",
         "required": false,
         "description": "Business address"
       },
       {
         "key": "phone",
         "type": "text",
         "label": "Phone Number",
         "required": false,
         "description": "Contact phone number"
       },
       {
         "key": "email",
         "type": "text",
         "label": "Email Address",
         "required": false,
         "description": "Contact email address"
       },
       {
         "key": "social_links",
         "type": "table",
         "label": "Social Media Links",
         "required": false,
         "description": "Social media links",
         "columns": [
           { "key": "platform", "label": "Platform", "type": "text" },
           { "key": "url", "label": "URL", "type": "text" }
         ],
         "minRows": 0,
         "maxRows": 10
       }
     ]
   }',
   true
 ),
 (
   'Table Section',
   'Dynamic table with customizable rows and columns',
   'TableSection',
   '{
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
         "label": "Table Title",
         "required": false,
         "description": "Title for the table section"
       },
       {
         "key": "subtitle",
         "type": "textarea",
         "label": "Table Subtitle",
         "required": false,
         "description": "Subtitle or description for the table section"
       },
       {
         "key": "table_data",
         "type": "table",
         "label": "Table Data",
         "required": false,
         "description": "Configure your table with rows and columns",
         "columns": [
           { "key": "column1", "label": "Column 1", "type": "text" },
           { "key": "column2", "label": "Column 2", "type": "text" },
           { "key": "column3", "label": "Column 3", "type": "text" }
         ],
         "minRows": 1,
         "maxRows": 50
       },
       {
         "key": "show_borders",
         "type": "checkbox",
         "label": "Show Table Borders",
         "required": false,
         "description": "Display borders around table cells"
       },
       {
         "key": "striped_rows",
         "type": "checkbox",
         "label": "Striped Rows",
         "required": false,
         "description": "Alternate row colors for better readability"
       },
       {
         "key": "hover_effect",
         "type": "checkbox",
         "label": "Hover Effect",
         "required": false,
         "description": "Highlight rows on hover"
       }
     ]
   }',
   true
 ),
 (
   'Slider Section 1',
   'Image slider with customizable slides and navigation',
   'Slider1Generator',
   '{
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
         "label": "Slider Title",
         "required": false,
         "description": "Title for the slider section"
       },
       {
         "key": "subtitle",
         "type": "text",
         "label": "Slider Subtitle",
         "required": false,
         "description": "Subtitle for the slider section"
       },
       {
         "key": "slides",
         "type": "table",
         "label": "Slides",
         "required": false,
         "description": "Add slides to the slider",
         "columns": [
           { "key": "title", "label": "Slide Title", "type": "text" },
           { "key": "description", "label": "Description", "type": "text" },
           { "key": "image", "label": "Image URL", "type": "text" },
           { "key": "cta_text", "label": "CTA Text", "type": "text" },
           { "key": "cta_link", "label": "CTA Link", "type": "text" }
         ],
         "minRows": 1,
         "maxRows": 20
       }
     ]
   }',
   true
 ),
 (
   'Slider Section 2',
   'Secondary slider with different layout and styling',
   'Slider2Section',
   '{
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
         "label": "Slider Title",
         "required": false,
         "description": "Title for the slider section"
       },
       {
         "key": "subtitle",
         "type": "text",
         "label": "Slider Subtitle",
         "required": false,
         "description": "Subtitle for the slider section"
       },
       {
         "key": "slides",
         "type": "table",
         "label": "Slides",
         "required": false,
         "description": "Add slides to the slider",
         "columns": [
           { "key": "title", "label": "Slide Title", "type": "text" },
           { "key": "description", "label": "Description", "type": "text" },
           { "key": "image", "label": "Image URL", "type": "text" },
           { "key": "cta_text", "label": "CTA Text", "type": "text" },
           { "key": "cta_link", "label": "CTA Link", "type": "text" }
         ],
         "minRows": 1,
         "maxRows": 20
       }
     ]
   }',
   true
 );
