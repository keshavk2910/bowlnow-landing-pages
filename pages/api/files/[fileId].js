import { deleteFile } from '../../../lib/file-upload'

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { fileId } = req.query

    if (!fileId) {
      return res.status(400).json({ error: 'File ID is required' })
    }

    await deleteFile(fileId)

    res.status(200).json({
      success: true,
      message: 'File deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting file:', error)
    res.status(500).json({ 
      error: 'Failed to delete file',
      details: error.message
    })
  }
}