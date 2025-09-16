import { useState, useEffect } from 'react'

export default function PagePipelineConfig({ 
  siteSlug, 
  pageId, 
  currentPipeline, 
  currentStageMapping, 
  defaultPipeline,
  defaultStageMapping,
  onChange 
}) {
  const [pipelines, setPipelines] = useState([])
  const [selectedPipelineId, setSelectedPipelineId] = useState(currentPipeline || defaultPipeline || '')
  const [stages, setStages] = useState([])
  const [stageMappings, setStageMappings] = useState(currentStageMapping || defaultStageMapping || {
    form_submitted: '',
    checkout_started: '',
    payment_completed: ''
  })
  const [useDefault, setUseDefault] = useState(!currentPipeline)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!useDefault) {
      fetchPipelines()
    }
  }, [useDefault])

  useEffect(() => {
    if (selectedPipelineId && pipelines.length > 0) {
      const selectedPipeline = pipelines.find(p => p.id === selectedPipelineId)
      setStages(selectedPipeline?.stages || [])
    }
  }, [selectedPipelineId, pipelines])

  // Remove the problematic useEffect that was causing infinite loops
  // Instead, call onChange directly in event handlers

  async function fetchPipelines() {
    setLoading(true)
    try {
      const response = await fetch(`/api/ghl/pipelines?siteSlug=${siteSlug}`)
      if (response.ok) {
        const data = await response.json()
        setPipelines(data.pipelines || [])
      }
    } catch (error) {
      console.error('Error fetching pipelines:', error)
    } finally {
      setLoading(false)
    }
  }


  const handleUseDefaultChange = (checked) => {
    setUseDefault(checked)
    if (checked) {
      // Reset to default values and notify parent
      setSelectedPipelineId(defaultPipeline || '')
      setStageMappings(defaultStageMapping || {
        form_submitted: '',
        checkout_started: '',
        payment_completed: ''
      })
      onChange(null, null) // Use site default
    } else {
      onChange(selectedPipelineId, stageMappings)
    }
  }

  const handlePipelineChange = (pipelineId) => {
    setSelectedPipelineId(pipelineId)
    onChange(pipelineId, stageMappings)
  }

  const handleStageMappingChange = (action, stageId) => {
    const newMappings = { ...stageMappings, [action]: stageId }
    setStageMappings(newMappings)
    onChange(selectedPipelineId, newMappings)
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Pipeline Configuration
        </label>
        
        {/* Use Default Option */}
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={useDefault}
              onChange={(e) => handleUseDefaultChange(e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">
              Use site default pipeline {defaultPipeline ? `(${defaultPipeline})` : '(not configured)'}
            </span>
          </label>
        </div>
        
        {/* Custom Pipeline Configuration */}
        {!useDefault && (
          <div className="space-y-4 pl-6 border-l-2 border-gray-200">
            {loading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">Loading pipelines...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Pipeline Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Pipeline for This Page
                  </label>
                  <select
                    value={selectedPipelineId}
                    onChange={(e) => handlePipelineChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Choose a pipeline...</option>
                    {pipelines.map((pipeline) => (
                      <option key={pipeline.id} value={pipeline.id}>
                        {pipeline.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Stage Mappings */}
                {stages.length > 0 && (
                  <div className="space-y-3">
                    <h5 className="text-sm font-medium text-gray-700">Stage Mappings for This Page:</h5>
                    
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Form Submitted → Stage
                        </label>
                        <select
                          value={stageMappings.form_submitted}
                          onChange={(e) => handleStageMappingChange('form_submitted', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                          <option value="">Select stage...</option>
                          {stages.map((stage) => (
                            <option key={stage.id} value={stage.id}>
                              {stage.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Checkout Started → Stage
                        </label>
                        <select
                          value={stageMappings.checkout_started}
                          onChange={(e) => handleStageMappingChange('checkout_started', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                          <option value="">Select stage...</option>
                          {stages.map((stage) => (
                            <option key={stage.id} value={stage.id}>
                              {stage.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Payment Completed → Stage
                        </label>
                        <select
                          value={stageMappings.payment_completed}
                          onChange={(e) => handleStageMappingChange('payment_completed', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                          <option value="">Select stage...</option>
                          {stages.map((stage) => (
                            <option key={stage.id} value={stage.id}>
                              {stage.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {pipelines.length === 0 && !loading && (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    No pipelines found. Check your GoHighLevel configuration.
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}