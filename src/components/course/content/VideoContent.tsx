import React from 'react'
import { VideoContent as VideoContentType } from '@/types/course'

interface VideoContentProps {
  content: VideoContentType
}

export default function VideoContent({ content }: VideoContentProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-gray-800">{content.title}</h4>
      <div className="aspect-video rounded-xl overflow-hidden">
        <iframe
          src={content.embed_link}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  )
}
