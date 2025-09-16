import { useState, useEffect } from 'react'

export default function FAQField({ 
  value = [], 
  onChange, 
  label = "Frequently Asked Questions",
  description = "Add questions and answers for your FAQ section",
  minFAQs = 1,
  maxFAQs = 20,
  required = false
}) {
  const [faqs, setFAQs] = useState(Array.isArray(value) ? value : [])

  useEffect(() => {
    setFAQs(Array.isArray(value) ? value : [])
  }, [value])

  const addFAQ = () => {
    if (faqs.length >= maxFAQs) {
      alert(`Maximum ${maxFAQs} FAQs allowed`)
      return
    }

    const newFAQ = {
      id: Date.now(),
      question: '',
      answer: '',
      order: faqs.length
    }
    
    const updatedFAQs = [...faqs, newFAQ]
    setFAQs(updatedFAQs)
    onChange(updatedFAQs)
  }

  const updateFAQ = (index, field, value) => {
    const updatedFAQs = faqs.map((faq, i) => 
      i === index ? { ...faq, [field]: value } : faq
    )
    setFAQs(updatedFAQs)
    onChange(updatedFAQs)
  }

  const removeFAQ = (index) => {
    if (!confirm('Are you sure you want to remove this FAQ?')) return

    const updatedFAQs = faqs.filter((_, i) => i !== index)
    // Update order values
    updatedFAQs.forEach((faq, index) => {
      faq.order = index
    })
    
    setFAQs(updatedFAQs)
    onChange(updatedFAQs)
  }

  const moveFAQ = (fromIndex, toIndex) => {
    const updatedFAQs = [...faqs]
    const [movedFAQ] = updatedFAQs.splice(fromIndex, 1)
    updatedFAQs.splice(toIndex, 0, movedFAQ)
    
    // Update order values
    updatedFAQs.forEach((faq, index) => {
      faq.order = index
    })
    
    setFAQs(updatedFAQs)
    onChange(updatedFAQs)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
        
        {faqs.length < maxFAQs && (
          <button
            type="button"
            onClick={addFAQ}
            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
          >
            Add FAQ
          </button>
        )}
      </div>

      {/* Validation Status */}
      <div className={`p-3 rounded-lg text-sm ${
        faqs.length < minFAQs 
          ? 'bg-yellow-50 border border-yellow-200 text-yellow-800'
          : faqs.length >= maxFAQs
          ? 'bg-blue-50 border border-blue-200 text-blue-800' 
          : 'bg-green-50 border border-green-200 text-green-800'
      }`}>
        <div className="flex justify-between items-center">
          <span>
            {faqs.length < minFAQs 
              ? `Need ${minFAQs - faqs.length} more FAQs (minimum ${minFAQs})`
              : faqs.length >= maxFAQs
              ? `Maximum FAQs reached (${maxFAQs})`
              : `${faqs.length}/${maxFAQs} FAQs added`
            }
          </span>
          {required && faqs.length < minFAQs && (
            <span className="text-red-600 font-medium">Required</span>
          )}
        </div>
      </div>

      {/* FAQ List */}
      {faqs.length > 0 && (
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={faq.id || index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-gray-700">FAQ #{index + 1}</span>
                <div className="flex space-x-2">
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => moveFAQ(index, index - 1)}
                      className="text-xs text-indigo-600 hover:text-indigo-800"
                    >
                      ↑ Up
                    </button>
                  )}
                  {index < faqs.length - 1 && (
                    <button
                      type="button"
                      onClick={() => moveFAQ(index, index + 1)}
                      className="text-xs text-indigo-600 hover:text-indigo-800"
                    >
                      ↓ Down
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeFAQ(index)}
                    className="text-xs text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Question
                  </label>
                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="What is your question?"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Answer
                  </label>
                  <textarea
                    rows={3}
                    value={faq.answer}
                    onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Provide a detailed answer..."
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {faqs.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <QuestionMarkCircleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-sm text-gray-500 mb-4">
            No FAQs added yet. Click "Add FAQ" to get started.
          </p>
          {required && (
            <span className="text-red-600 text-sm font-medium">This field is required.</span>
          )}
        </div>
      )}
    </div>
  )
}

function QuestionMarkCircleIcon(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}