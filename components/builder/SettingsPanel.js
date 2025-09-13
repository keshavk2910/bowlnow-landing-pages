import React from 'react'
import { useEditor } from '@craftjs/core'

export default function SettingsPanel() {
  const { selected, actions, query } = useEditor((state, query) => {
    const currentNodeId = query.getEvent('selected').last()
    let selected

    if (currentNodeId) {
      selected = {
        id: currentNodeId,
        name: state.nodes[currentNodeId].data.name || state.nodes[currentNodeId].data.displayName,
        settings: state.nodes[currentNodeId].related && state.nodes[currentNodeId].related.settings,
        isDeletable: query.node(currentNodeId).isDeletable()
      }
    }

    return {
      selected
    }
  })

  const deleteNode = () => {
    if (selected && selected.isDeletable) {
      actions.delete(selected.id)
    }
  }

  return (
    <div className="p-4 h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Settings</h3>
        {selected && selected.isDeletable && (
          <button
            onClick={deleteNode}
            className="text-red-600 hover:text-red-800 text-sm"
          >
            Delete
          </button>
        )}
      </div>

      {selected ? (
        <div>
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-sm font-medium text-gray-900">{selected.name}</div>
            <div className="text-xs text-gray-500">Selected Component</div>
          </div>

          {selected.settings && (
            <div className="space-y-4">
              {React.createElement(selected.settings)}
            </div>
          )}

          {!selected.settings && (
            <div className="text-sm text-gray-500">
              This component doesn't have configurable settings.
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-gray-400 text-4xl mb-3">⚙️</div>
          <div className="text-sm text-gray-500 mb-2">No component selected</div>
          <div className="text-xs text-gray-400">
            Click on any component in the canvas to configure its properties here.
          </div>
        </div>
      )}

      <div className="mt-8 pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          <div className="font-medium mb-2">📋 Quick Tips:</div>
          <ul className="space-y-1 list-disc list-inside">
            <li>Drag components from the left panel</li>
            <li>Click to select and configure</li>
            <li>Use containers to group elements</li>
            <li>Add spacers for vertical spacing</li>
          </ul>
        </div>
      </div>
    </div>
  )
}