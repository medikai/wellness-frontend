// src/components/course/content/VideoContent.tsx
import React from 'react'
import { VideoContent as VideoContentType } from '@/types/course'

interface VideoContentProps {
  content: VideoContentType
  onComplete?: () => void
}

export default function VideoContent({ content, onComplete }: VideoContentProps) {
  // Normalize the correct YouTube embed URL
  const embedUrl =
    content.embedUrl ||
    content.embed_url ||
    content.url ||
    content.embed_link || // fallback
    ''

  // Auto-complete video when it ends (for YouTube embeds)
  // Note: In production, you should use YouTube iframe API to detect actual video completion
  React.useEffect(() => {
    if (onComplete && embedUrl) {
      // For now, we'll auto-complete after a delay (allows video to be watched)
      // In production, integrate YouTube iframe API to listen for 'onStateChange' event
      // When state === YT.PlayerState.ENDED, call onComplete()
      const timer = setTimeout(() => {
        // Auto-complete after 5 seconds (placeholder - should be video end event)
        // onComplete() // Commented out for now - uncomment when ready for auto-progression
      }, 5000)
      
      return () => clearTimeout(timer)
    }
  }, [onComplete, embedUrl])

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
