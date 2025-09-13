export default function handler(req, res) {
  const { dimensions } = req.query
  
  // Parse dimensions like "800/600" or "1920/1080"
  const [width = '800', height = '600'] = dimensions || []
  
  // Redirect to a placeholder image service
  const placeholderUrl = `https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=${width}&h=${height}&fit=crop&auto=format`
  
  res.redirect(302, placeholderUrl)
}