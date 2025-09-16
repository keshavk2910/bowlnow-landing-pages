import { useState, useRef, useEffect } from 'react'

export default function FileUpload({ 
  value = null, // Current file URL or file object
  onFileUploaded, 
  siteId, 
  pageId, 
  fieldKey, 
  allowedTypes = ['image'], 
  maxSizeMB = 10,
  multiple = false,
  className = ""
}) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [currentFile, setCurrentFile] = useState(value)
  const fileInputRef = useRef(null)

  useEffect(() => {
    setCurrentFile(value)
  }, [value])

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return

    setUploading(true)
    
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        // Validate file type
        const fileType = file.type.split('/')[0]
        if (!allowedTypes.includes(fileType) && !allowedTypes.includes('*')) {
          throw new Error(`File type ${file.type} not allowed. Allowed: ${allowedTypes.join(', ')}`)
        }

        // Validate file size
        const maxSizeBytes = maxSizeMB * 1024 * 1024
        if (file.size > maxSizeBytes) {
          throw new Error(`File size must be less than ${maxSizeMB}MB`)
        }

        // Create form data
        const formData = new FormData()
        formData.append('file', file)
        formData.append('siteId', siteId)
        formData.append('pageId', pageId || '')
        formData.append('fieldKey', fieldKey)

        // Upload file
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.error('Upload error response:', errorText)
          
          try {
            const error = JSON.parse(errorText)
            throw new Error(error.error || `Upload failed (${response.status})`)
          } catch (parseError) {
            throw new Error(`Upload failed (${response.status}): ${errorText}`)
          }
        }

        const result = await response.json()
        return result.file
      })

      const uploadedFiles = await Promise.all(uploadPromises)
      
      // Update current file state
      if (multiple) {
        setCurrentFile(uploadedFiles)
        onFileUploaded(uploadedFiles)
      } else {
        setCurrentFile(uploadedFiles[0])
        onFileUploaded(uploadedFiles[0])
      }

    } catch (error) {
      console.error('Upload error:', error)
      alert(error.message || 'Failed to upload file')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFiles(files)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleFileSelect = (e) => {
    const files = e.target.files
    if (files.length > 0) {
      handleFiles(files)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const removeFile = () => {
    setCurrentFile(null)
    // Only call onFileUploaded with null for single file uploads, not for sliders
    if (!multiple) {
      onFileUploaded(null)
    }
  }

  // Show current file if exists
  if (currentFile && !uploading) {
    const fileUrl = typeof currentFile === 'string' ? currentFile : currentFile.url
    const fileName = typeof currentFile === 'string' ? 'Uploaded file' : currentFile.filename

    return (
      <div className={`${className}`}>
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              {allowedTypes.includes('image') && fileUrl ? (
                <img
                  src={fileUrl}
                  alt={fileName}
                  className="w-16 h-16 object-cover rounded"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                  <DocumentIcon className="h-8 w-8 text-gray-400" />
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{fileName}</p>
              <p className="text-xs text-gray-500">Uploaded successfully</p>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={handleClick}
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                Replace
              </button>
              <button
                onClick={removeFile}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={allowedTypes.includes('*') ? '*/*' : allowedTypes.map(type => `${type}/*`).join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    )
  }

  return (
    <div className={`${className}`}>
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          dragOver 
            ? 'border-indigo-500 bg-indigo-50' 
            : uploading 
            ? 'border-gray-300 bg-gray-50' 
            : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={!uploading ? handleClick : undefined}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={allowedTypes.includes('*') ? '*/*' : allowedTypes.map(type => `${type}/*`).join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />

        {uploading ? (
          <div className="space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="text-sm text-gray-600">Uploading...</p>
          </div>
        ) : (
          <div className="space-y-2">
            <UploadIcon className="h-8 w-8 text-gray-400 mx-auto" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                {dragOver ? 'Drop files here' : 'Click to upload or drag and drop'}
              </p>
              <p className="text-xs text-gray-500">
                {allowedTypes.includes('*') 
                  ? `Max ${maxSizeMB}MB per file`
                  : `${allowedTypes.join(', ').toUpperCase()} files, max ${maxSizeMB}MB each`
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function UploadIcon(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
  )
}

function DocumentIcon(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  )
}