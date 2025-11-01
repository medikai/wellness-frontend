'use client'

import React, { useState } from 'react'
import { Chapter } from '@/types/course'
import { Button } from '@/components/ui'
import VideoContent from './content/VideoContent'
import SurveyContent from './content/SurveyContent'
import QuizContent from './content/QuizContent'
import TextContent from './content/TextContent'
import GameContent from './content/GameContent'
import ActivityContent from './content/ActivityContent'
import FeedbackModal from '@/components/FeedbackModal'

interface CourseraStyleLayoutProps {
  chapters: Chapter[]
  sectionTitle: string
  sectionDescription: string
}

export default function CourseraStyleLayout({ chapters, sectionTitle, sectionDescription }: CourseraStyleLayoutProps) {
  const [activeChapter, setActiveChapter] = useState<string>(chapters[0]?.id || '')
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)

  const activeChapterData = chapters.find(ch => ch.id === activeChapter) || chapters[0]

  const getChapterIcon = (contentType: string) => {
    switch (contentType) {
      case 'video': return '🎥'
      case 'quiz': return '🧠'
      case 'survey': return '📋'
      case 'activities': return '💧'
      case 'games': return '🎮'
      case 'text': return '📄'
      default: return '📚'
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Top Header */}
      <div className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-full mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-3xl">🏥</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{sectionTitle}</h1>
                <p className="text-lg text-gray-600">Self-paced Course</p>
              </div>
            </div>
            <Button 
              variant="secondary" 
              onClick={handleLeaveSession}
              className="bg-red-500 hover:bg-red-600 text-white text-lg px-6 py-3 rounded-xl"
            >
              Leave Session
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-100px)]">
        {/* Left Navigation Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 shadow-lg flex flex-col">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-blue-600">
            <h2 className="text-2xl font-bold text-white mb-2">Course Navigation</h2>
            <p className="text-blue-100 text-sm">Chapters in this section</p>
          </div>

          {/* Scrollable Chapter List */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-2">
              {chapters.map((chapter, index) => {
                const isActive = chapter.id === activeChapter
                const icon = getChapterIcon(chapter.content.type)
                
                return (
                  <button
                    key={chapter.id}
                    onClick={() => setActiveChapter(chapter.id)}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-200 flex items-start space-x-3 ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-lg border-2 border-blue-700'
                        : 'bg-gray-50 hover:bg-blue-50 border-2 border-transparent hover:border-blue-200'
                    }`}
                  >
                    <div className={`text-2xl ${isActive ? 'text-white' : 'text-gray-600'}`}>
                      {icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-semibold ${isActive ? 'text-blue-100' : 'text-gray-500'}`}>
                          Chapter {index + 1}
                        </span>
                        {isActive && (
                          <span className="text-xs bg-white text-blue-600 px-2 py-1 rounded-full font-semibold">
                            Current
                          </span>
                        )}
                      </div>
                      <h3 className={`font-bold text-sm mb-1 ${isActive ? 'text-white' : 'text-gray-800'}`}>
                        {chapter.title}
                      </h3>
                      <p className={`text-xs line-clamp-2 ${isActive ? 'text-blue-100' : 'text-gray-600'}`}>
                        {chapter.description}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="mb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Progress</span>
                <span className="text-sm font-bold text-blue-600">
                  {chapters.findIndex(ch => ch.id === activeChapter) + 1} / {chapters.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${((chapters.findIndex(ch => ch.id === activeChapter) + 1) / chapters.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-8">
            {/* Chapter Header */}
            {activeChapterData && (
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-4 border-blue-200">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-3xl">
                      {getChapterIcon(activeChapterData.content.type)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="mb-2">
                      <span className="text-lg font-semibold text-gray-500">
                        Chapter {chapters.findIndex(ch => ch.id === activeChapter) + 1} of {chapters.length}
                      </span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                      {activeChapterData.title}
                    </h2>
                    <p className="text-xl text-gray-600 mb-4">
                      {activeChapterData.description}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Chapter Content */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {renderContent()}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                onClick={() => {
                  const currentIndex = chapters.findIndex(ch => ch.id === activeChapter)
                  if (currentIndex > 0) {
                    setActiveChapter(chapters[currentIndex - 1].id)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }
                }}
                disabled={chapters.findIndex(ch => ch.id === activeChapter) === 0}
                className="bg-gray-500 hover:bg-gray-600 text-white text-lg px-8 py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Previous Chapter
              </Button>

              <Button
                onClick={() => {
                  const currentIndex = chapters.findIndex(ch => ch.id === activeChapter)
                  if (currentIndex < chapters.length - 1) {
                    setActiveChapter(chapters[currentIndex + 1].id)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }
                }}
                disabled={chapters.findIndex(ch => ch.id === activeChapter) === chapters.length - 1}
                className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next Chapter →
              </Button>
            </div>
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
