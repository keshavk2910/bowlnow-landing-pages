export default function handler(req, res) {
  res.status(200).json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    platform: 'BowlNow Multi-Tenant Funnel Builder',
    version: '1.0.0'
  })
}