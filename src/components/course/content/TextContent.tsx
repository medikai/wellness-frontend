import React from 'react'
import { TextContent as TextContentType } from '@/types/course'

interface TextContentProps {
  content: TextContentType
}

export default function TextContent({ content }: TextContentProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-gray-800">{content.title}</h4>
      <div 
        className="prose prose-sm max-w-none text-gray-700"
        dangerouslySetInnerHTML={{ __html: content.content }}
      />
    </div>
  )
}
