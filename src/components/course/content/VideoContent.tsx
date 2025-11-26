// src/components/course/content/VideoContent.tsx
import React from 'react'
import { VideoContent as VideoContentType } from '@/types/course'

interface VideoContentProps {
  content: VideoContentType
}

export default function VideoContent({ content }: VideoContentProps) {
  // Normalize the correct YouTube embed URL
  const embedUrl =
    content.embedUrl ||
    content.embed_url ||
    content.url ||
    content.embed_link || // fallback
    ''

  return (
    <div className="space-y-4">
      {content.title && (
        <h4 className="text-lg font-semibold text-gray-800">{content.title}</h4>
      )}

      <div className="aspect-video rounded-xl overflow-hidden bg-black">
        <iframe
          src={embedUrl}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  )
}
