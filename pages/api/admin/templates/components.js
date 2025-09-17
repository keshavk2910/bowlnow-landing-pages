import fs from 'fs'
import path from 'path'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const templatesDir = path.join(process.cwd(), 'components', 'templates')
    
    // Check if templates directory exists
    if (!fs.existsSync(templatesDir)) {
      return res.status(200).json({ components: [] })
    }

    // Read all files in the templates directory
    const files = fs.readdirSync(templatesDir)
    
    // Filter for .js files and extract component info
    const components = files
      .filter(file => file.endsWith('.js') && !file.includes('index'))
      .map(file => {
        const componentName = file.replace('.js', '')
        const componentPath = `components/templates/${file}`
        
        // Try to determine type from component name
        let type = 'landing'
        if (componentName.toLowerCase().includes('party') || componentName.toLowerCase().includes('parties')) {
          type = 'parties'
        } else if (componentName.toLowerCase().includes('event')) {
          type = 'events'
        } else if (componentName.toLowerCase().includes('booking')) {
          type = 'bookings'
        } else if (componentName.toLowerCase().includes('checkout')) {
          type = 'checkout'
        } else if (componentName.toLowerCase().includes('thank')) {
          type = 'thank-you'
        } else if (componentName.toLowerCase().includes('bowling')) {
          type = 'bowling'
        }

        // Try to read component file to get more info
        let displayName = componentName
        try {
          const filePath = path.join(templatesDir, file)
          const fileContent = fs.readFileSync(filePath, 'utf8')
          
          // Look for export default or function name
          const exportMatch = fileContent.match(/export default function (\w+)/)
          if (exportMatch) {
            displayName = exportMatch[1]
          }
        } catch (readError) {
          console.warn(`Could not read ${file}:`, readError.message)
        }

        return {
          file: componentName,
          path: componentPath,
          type: type,
          displayName: displayName,
          exists: true,
          lastModified: fs.statSync(path.join(templatesDir, file)).mtime
        }
      })
      .sort((a, b) => a.displayName.localeCompare(b.displayName))

    res.status(200).json({
      success: true,
      components
    })

  } catch (error) {
    console.error('Error reading template components:', error)
    res.status(500).json({ 
      error: 'Failed to read template components',
      details: error.message
    })
  }
}