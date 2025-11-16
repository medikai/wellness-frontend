'use client'

import React, { useState, useCallback } from 'react'
import { useFontSize } from '@/contexts/FontSizeContext'
import { CognitiveTestConfig, TestItem, TestResponse } from '@/types/cognitive-test'

interface GridTapModeProps {
  item: TestItem
  config: CognitiveTestConfig
  onResponse: (response: TestResponse) => void
  disabled?: boolean
}

export default function GridTapMode({ item, config, onResponse, disabled }: GridTapModeProps) {
  const { fontSizePx } = useFontSize()
  const [tappedCells, setTappedCells] = useState<Array<{ row: number; col: number; timestamp: number }>>([])

  const gridConfig = config.stimulus?.gridConfig
  const { rows, cols, items } = gridConfig || { rows: 0, cols: 0, items: [] }

  const handleCellTap = useCallback((row: number, col: number) => {
    if (disabled) return

    const timestamp = Date.now()
    const newTap = { row, col, timestamp }
    const newTappedCells = [...tappedCells, newTap]
    
    setTappedCells(newTappedCells)

    // Check if all target cells are tapped (if applicable)
    const targetCells = items.filter(item => item.isTarget)
    const allTargetsTapped = targetCells.every(target => 
      newTappedCells.some(tap => tap.row === target.position.row && tap.col === target.position.col)
    )

    if (allTargetsTapped && targetCells.length > 0) {
      // Auto-complete when all targets are found
      // Flatten the array of [row, col] pairs into a single array
      const flattenedResponse: number[] = newTappedCells.flatMap(t => [t.row, t.col])
      const testResponse: TestResponse = {
        itemId: item.id,
        response: flattenedResponse,
        timestamp,
        metadata: { timestamps: newTappedCells.map(t => t.timestamp) }
      }
      onResponse(testResponse)
    }
  }, [item, items, tappedCells, onResponse, disabled])

  if (!gridConfig) return null

  const isCellTapped = (row: number, col: number) => {
    return tappedCells.some(tap => tap.row === row && tap.col === col)
  }

  const getCellContent = (row: number, col: number) => {
    const gridItem = items.find(item => 
      item.position.row === row && item.position.col === col
    )
    return gridItem?.content || ''
  }

  const isTargetCell = (row: number, col: number) => {
    return items.some(item => 
      item.position.row === row && 
      item.position.col === col && 
      item.isTarget
    )
  }

  return (
    <div className="space-y-6">
      <div 
        className="text-center text-gray-600 mb-4"
        style={{ fontSize: `${fontSizePx}px` }}
      >
        Tap the target cells in the grid
      </div>

      {/* Grid - Primary Interaction Zone */}
      <div className="flex justify-center">
        <div 
          className="grid gap-2 p-4 bg-gray-100 rounded-xl"
          style={{ 
            gridTemplateColumns: `repeat(${cols}, minmax(60px, 1fr))`,
            gridTemplateRows: `repeat(${rows}, minmax(60px, 1fr))`
          }}
        >
          {Array.from({ length: rows * cols }, (_, idx) => {
            const row = Math.floor(idx / cols)
            const col = idx % cols
            const tapped = isCellTapped(row, col)
            const isTarget = isTargetCell(row, col)
            const content = getCellContent(row, col)

            return (
              <button
                key={idx}
                onClick={() => handleCellTap(row, col)}
                disabled={disabled || tapped}
                className={`rounded-lg font-bold shadow-md transition-all duration-200 transform active:scale-95 ${
                  tapped
                    ? isTarget
                      ? 'bg-green-600 text-white'
                      : 'bg-red-500 text-white'
                    : isTarget
                    ? 'bg-blue-600 hover:bg-blue-700 text-white ring-2 ring-blue-300'
                    : 'bg-white hover:bg-gray-200 text-gray-700 border-2 border-gray-300'
                }`}
                style={{ fontSize: `${Math.max(20, fontSizePx * 1.25)}px` }}
              >
                {tapped ? '✓' : content || `${row + 1}-${col + 1}`}
              </button>
            )
          })}
        </div>
      </div>

      {/* Progress */}
      <div className="text-center">
        <span 
          className="text-gray-600"
          style={{ fontSize: `${fontSizePx}px` }}
        >
          Tapped: {tappedCells.length} cells
        </span>
      </div>
    </div>
  )
}

