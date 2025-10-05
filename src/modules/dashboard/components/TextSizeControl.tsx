import React from 'react'
import { Card } from '@/components/ui'
import { useFontSize } from '@/contexts/FontSizeContext'

const TextSizeControl = () => {
  const { fontSizePx, minPx, maxPx, setFontSizePx, increase, decrease } = useFontSize()
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = Number(e.target.value)
    if (!Number.isNaN(next)) setFontSizePx(next)
  }
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold text-neutral-dark mb-4">Text Size</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-neutral-medium">{minPx}px</span>
          <span className="text-sm text-neutral-dark font-medium">{fontSizePx}px</span>
          <span className="text-sm text-neutral-medium">{maxPx}px</span>
        </div>
        <div className="flex items-center space-x-3">
          <button type="button" onClick={decrease} className="px-2 py-1 rounded border border-neutral-light text-neutral-dark">-</button>
          <input
            type="range"
            min={minPx}
            max={maxPx}
            step={1}
            value={fontSizePx}
            onChange={handleChange}
            className="w-full"
            aria-label="Adjust text size"
          />
          <button type="button" onClick={increase} className="px-2 py-1 rounded border border-neutral-light text-neutral-dark">+</button>
        </div>
      </div>
    </Card>
  )
}

export default TextSizeControl