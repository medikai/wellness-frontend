import React from 'react'
import { TextContent as TextContentType } from '@/types/course'

interface TextContentProps {
  content: TextContentType
  onComplete?: () => void
}

export default function TextContent({ content, onComplete }: TextContentProps) {
  // Text content auto-completes after being viewed (for auto-progression)
  React.useEffect(() => {
    if (onComplete) {
      // Auto-complete text content after a short delay (user has seen it)
      const timer = setTimeout(() => {
        onComplete()
      }, 2000)
      
      return () => clearTimeout(timer)
    }
  }, [onComplete])
  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-gray-800">{content.title}</h4>
      <div 
        className="prose prose-sm max-w-none text-gray-700"
        dangerouslySetInnerHTML={{ __html: content.html || content.body || content.content || '' }}
      />
    </div>
  )
}
