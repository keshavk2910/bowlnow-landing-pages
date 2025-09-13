import fs from 'fs'
import path from 'path'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { template } = req.query

    if (!template) {
      return res.status(400).json({ error: 'Template type is required' })
    }

    // Map template types to mock data files
    const templateFiles = {
      'landing': 'mock-page-landing.json',
      'parties': 'mock-page-parties.json', 
      'events': 'mock-page-events.json',
      'bookings': 'mock-page-bookings.json',
      'bowling': 'mock-page-bowling.json',
      'template-page-one': 'mock-page-template-page-one.json'
    }

    const fileName = templateFiles[template]
    
    if (!fileName) {
      return res.status(404).json({ error: 'Template not found' })
    }

    // Read mock data file
    const filePath = path.join(process.cwd(), 'data', fileName)
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Mock data file not found' })
    }

    const mockData = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    
    // Also load the mock site data
    const siteFilePath = path.join(process.cwd(), 'data', 'mock-site.json')
    const siteMockData = JSON.parse(fs.readFileSync(siteFilePath, 'utf8'))
    
    // Load funnel data
    const funnelFilePath = path.join(process.cwd(), 'data', 'mock-funnel.json')
    const funnelMockData = JSON.parse(fs.readFileSync(funnelFilePath, 'utf8'))

    // Update the site template type to match requested template
    siteMockData.settings.template_type = template
    funnelMockData.template_type = template

    res.status(200).json({
      success: true,
      site: siteMockData,
      funnel: funnelMockData,
      page: mockData,
      preview: true
    })

  } catch (error) {
    console.error('Error loading preview data:', error)
    res.status(500).json({ 
      error: 'Failed to load preview data',
      details: error.message
    })
  }
}