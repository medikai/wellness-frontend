'use client'

import React, { useState } from 'react'
import { Chapter } from '@/types/course'
import { Button, Icon } from '@/components/ui'
import { colors } from '@/design-tokens'
import VideoContent from './content/VideoContent'
import SurveyContent from './content/SurveyContent'
import QuizContent from './content/QuizContent'
import TextContent from './content/TextContent'
import GameContent from './content/GameContent'
import ActivityContent from './content/ActivityContent'
import FeedbackModal from '@/components/FeedbackModal'

// Type definitions for vendor-specific fullscreen APIs
interface DocumentWithFullscreen extends Document {
  webkitFullscreenElement?: Element | null
  mozFullScreenElement?: Element | null
  msFullscreenElement?: Element | null
  webkitExitFullscreen?: () => Promise<void>
  mozCancelFullScreen?: () => Promise<void>
  msExitFullscreen?: () => Promise<void>
}

interface HTMLElementWithFullscreen extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void>
  mozRequestFullScreen?: () => Promise<void>
  msRequestFullscreen?: () => Promise<void>
}

interface CourseraStyleLayoutProps {
  chapters: Chapter[]
  sectionTitle: string
  sectionDescription: string
  onFullscreenChange?: (isFullscreen: boolean) => void
  onToggleFullscreen?: () => void
  isFullscreen?: boolean
}

export default function CourseraStyleLayout({ chapters, onFullscreenChange, onToggleFullscreen, isFullscreen: externalIsFullscreen }: CourseraStyleLayoutProps) {
  const [activeChapter, setActiveChapter] = useState<string>(chapters[0]?.id || '')
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [internalFullscreen, setInternalFullscreen] = useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)
  
  // Use external fullscreen state if provided, otherwise use internal
  const isFullscreen = externalIsFullscreen !== undefined ? externalIsFullscreen : internalFullscreen

  const activeChapterData = chapters.find(ch => ch.id === activeChapter) || chapters[0]
  const currentChapterIndex = chapters.findIndex(ch => ch.id === activeChapter)

  const getChapterIcon = (contentType: string) => {
    switch (contentType) {
      case 'video': return 'video'
      case 'quiz': return 'helpCircle'
      case 'survey': return 'fileText'
      case 'activities': return 'heart'
      case 'games': return 'gamepad'
      case 'text': return 'fileText'
      default: return 'fileText'
    }
  }

  const renderContent = () => {
    if (!activeChapterData) return null
    
    switch (activeChapterData.content.type) {
      case 'video':
        return <VideoContent content={activeChapterData.content} />
      case 'survey':
        return <SurveyContent content={activeChapterData.content} />
      case 'quiz':
        return <QuizContent content={activeChapterData.content} />
      case 'text':
        return <TextContent content={activeChapterData.content} />
      case 'games':
        return <GameContent content={activeChapterData.content} />
      case 'activities':
        return <ActivityContent content={activeChapterData.content} />
      default:
        return null
    }
  }

  const handleLeaveSession = () => {
    setShowFeedbackModal(true)
  }

  const handleCloseFeedbackModal = () => {
    setShowFeedbackModal(false)
  }

  const handleSubmitFeedback = () => {
    handleCloseFeedbackModal()
  }

  // Check if fullscreen is active
  const checkFullscreen = () => {
    const doc = document as DocumentWithFullscreen
    return !!(
      document.fullscreenElement ||
      doc.webkitFullscreenElement ||
      doc.mozFullScreenElement ||
      doc.msFullscreenElement
    )
  }

  // Handle fullscreen change events (only if not controlled externally)
  React.useEffect(() => {
    if (externalIsFullscreen !== undefined) return // Skip if controlled externally

    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = checkFullscreen()
      setInternalFullscreen(isCurrentlyFullscreen)
      if (onFullscreenChange) {
        onFullscreenChange(isCurrentlyFullscreen)
      }
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.addEventListener('mozfullscreenchange', handleFullscreenChange)
    document.addEventListener('MSFullscreenChange', handleFullscreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange)
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange)
    }
  }, [onFullscreenChange, externalIsFullscreen])

  const handleToggleFullscreen = () => {
    if (onToggleFullscreen) {
      // Use parent's fullscreen handler
      onToggleFullscreen()
    } else {
      // Fallback to local fullscreen handling
      handleLocalFullscreen()
    }
  }

  const handleLocalFullscreen = async () => {
    try {
      if (!containerRef.current) return

      const isCurrentlyFullscreen = checkFullscreen()
      const doc = document as DocumentWithFullscreen
      const element = containerRef.current as HTMLElementWithFullscreen

      if (isCurrentlyFullscreen) {
        // Exit fullscreen
        if (document.exitFullscreen) {
          await document.exitFullscreen()
        } else if (doc.webkitExitFullscreen) {
          await doc.webkitExitFullscreen()
        } else if (doc.mozCancelFullScreen) {
          await doc.mozCancelFullScreen()
        } else if (doc.msExitFullscreen) {
          await doc.msExitFullscreen()
        }
      } else {
        // Enter fullscreen - make the entire component fullscreen
        if (element.requestFullscreen) {
          await element.requestFullscreen()
        } else if (element.webkitRequestFullscreen) {
          await element.webkitRequestFullscreen()
        } else if (element.mozRequestFullScreen) {
          await element.mozRequestFullScreen()
        } else if (element.msRequestFullscreen) {
          await element.msRequestFullscreen()
        }
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col h-full">
      {/* Top Header with Chapter Navigation */}
      <div className="bg-white shadow-sm border-b border-neutral-light/50 sticky top-0 z-30">
        <div className="max-w-full mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
             
              <div className="w-12 h-12 bg-gradient-to-br from-teal-primary to-teal-dark rounded-2xl flex items-center justify-center shadow-lg">
                <Icon name="heart" size="md" color="white" />
              </div>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-neutral-dark">{activeChapterData?.title}</h1>
                <p className="text-sm text-teal-primary font-medium">{activeChapterData.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                onClick={handleToggleFullscreen}
                className="flex items-center space-x-2 text-neutral-dark hover:bg-teal-light border-teal-light"
                title={isFullscreen ? "Exit Fullscreen" : "Maximize Screen"}
              >
                <Icon 
                  name={isFullscreen ? "x" : "maximize"} 
                  size="sm" 
                  color={colors.neutral.dark}
                />
                <span className="text-sm">{isFullscreen ? "Exit" : "Maximize"}</span>
              </Button>
              <Button 
                variant="secondary" 
                onClick={handleLeaveSession}
                className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-xl"
              >
                Leave Session
              </Button>
            </div>
          </div>

          {/* Chapter Navigation in Header */}
          {!isFullscreen && (
            <div className="border-t border-neutral-light/50 pt-4">
              <div className="flex items-center justify-between gap-4">
                {/* Chapter Tabs */}
                <div className="flex items-center space-x-2 flex-1 overflow-x-auto pb-2 scrollbar-hide">
                  {chapters.map((chapter, index) => {
                    const isActive = chapter.id === activeChapter
                    const iconName = getChapterIcon(chapter.content.type)
                    
                    return (
                      <button
                        key={chapter.id}
                        onClick={() => {
                          setActiveChapter(chapter.id)
                          window.scrollTo({ top: 0, behavior: 'smooth' })
                        }}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                          isActive
                            ? 'bg-gradient-to-r from-teal-primary to-teal-dark text-white shadow-md'
                            : 'bg-teal-light/30 hover:bg-teal-light/50 text-neutral-dark border-2 border-teal-light'
                        }`}
                      >
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          isActive 
                            ? 'bg-white/20' 
                            : 'bg-white'
                        }`}>
                          <Icon 
                            name={iconName} 
                            size="sm" 
                            color={isActive ? 'white' : colors.neutral.medium}
                          />
                        </div>
                        <span className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-neutral-dark'}`}>
                          Chapter {index + 1}
                        </span>
                        {isActive && (
                          <span className="text-xs bg-white text-teal-primary px-2 py-0.5 rounded-full font-semibold">
                            Current
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>

                {/* Progress Bar */}
                <div className="flex-shrink-0  w-full min-w-[200px]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-neutral-medium">Progress</span>
                    <span className="text-xs font-bold text-teal-primary">
                      {currentChapterIndex + 1} / {chapters.length}
                    </span>
                  </div>
                  <div className="w-full bg-neutral-light rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-teal-primary to-teal-dark h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentChapterIndex + 1) / chapters.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area - Full Width */}
      <div className="flex-1 overflow-y-auto bg-background">
        <div className={`${isFullscreen ? 'w-full max-w-full px-6 lg:px-12 py-6 lg:py-8' : 'max-w-5xl mx-auto p-6 lg:p-8'}`}>
            {/* Chapter Header */}
            

            {/* Chapter Content */}
            <div className="bg-white rounded-2xl shadow-md p-6 lg:p-8 border border-neutral-light/50">
              {renderContent()}
            </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6 gap-4">
            <Button
              onClick={() => {
                if (currentChapterIndex > 0) {
                  setActiveChapter(chapters[currentChapterIndex - 1].id)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }
              }}
              disabled={currentChapterIndex === 0}
              variant="outline"
              className="flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icon name="chevronLeft" size="sm" color={colors.neutral.dark} />
              <span>Previous Chapter</span>
            </Button>

            <Button
              onClick={() => {
                if (currentChapterIndex < chapters.length - 1) {
                  setActiveChapter(chapters[currentChapterIndex + 1].id)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }
              }}
              disabled={currentChapterIndex === chapters.length - 1}
              variant="primary"
              className="flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Next Chapter</span>
              <Icon name="chevronRight" size="sm" color="white" />
            </Button>
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <FeedbackModal
          isOpen={showFeedbackModal}
          onSubmit={handleSubmitFeedback}
        />
      )}
    </div>
  )
}
