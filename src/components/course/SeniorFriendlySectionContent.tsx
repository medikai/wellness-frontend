'use client'

import React, { useState } from 'react'
import { Chapter, CourseContent } from '@/types/course'
import { Button } from '@/components/ui'
import VideoContent from './content/VideoContent'
import SurveyContent from './content/SurveyContent'
import QuizContent from './content/QuizContent'
import TextContent from './content/TextContent'
import GameContent from './content/GameContent'
import ActivityContent from './content/ActivityContent'
import FeedbackModal from '@/components/FeedbackModal'

interface SeniorFriendlySectionContentProps {
  chapters: Chapter[]
  title: string
}

function isStaticContent(
  content: Chapter['content']
): content is CourseContent {
  return !Array.isArray(content)
}


export default function SeniorFriendlySectionContent({ chapters, title }: SeniorFriendlySectionContentProps) {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-lg">
                <span className="text-4xl">🏥</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-2">{title}</h1>
                <p className="text-2xl text-gray-600">Self-paced Session</p>
              </div>
            </div>
            <Button
              variant="secondary"
              onClick={handleLeaveSession}
              className="bg-red-500 hover:bg-red-600 text-white text-xl px-8 py-4 rounded-2xl shadow-lg"
            >
              Leave Session
            </Button>
          </div>
        </div>

        {/* Simple Card-Based Layout for Seniors */}
        <div className="space-y-6">
          {chapters.map((chapter, index) => {
            if (!isStaticContent(chapter.content)) {
              // Skip dynamic multi-item content until normalized (same as Coursera layout)
              return null
            }

            const content = chapter.content

            const isVideo = content.type === 'video'
            const isQuiz = content.type === 'quiz'
            const isSurvey = content.type === 'survey'
            const isActivity = content.type === 'activities'
            const isGame = content.type === 'games'
            const isText = content.type === 'text'

            let icon = '📚'
            let bgColor = 'from-blue-500 to-blue-600'
            let cardBgColor = 'bg-blue-50'

            if (isVideo) {
              icon = '🎥'
              bgColor = 'from-red-500 to-red-600'
              cardBgColor = 'bg-red-50'
            } else if (isQuiz) {
              icon = '🧠'
              bgColor = 'from-green-500 to-green-600'
              cardBgColor = 'bg-green-50'
            } else if (isSurvey) {
              icon = '📋'
              bgColor = 'from-yellow-500 to-yellow-600'
              cardBgColor = 'bg-yellow-50'
            } else if (isActivity) {
              icon = '💧'
              bgColor = 'from-cyan-500 to-cyan-600'
              cardBgColor = 'bg-cyan-50'
            } else if (isGame) {
              icon = '🎮'
              bgColor = 'from-purple-500 to-purple-600'
              cardBgColor = 'bg-purple-50'
            } else if (isText) {
              icon = '📄'
              bgColor = 'from-indigo-500 to-indigo-600'
              cardBgColor = 'bg-indigo-50'
            }

            return (
              <div
                key={chapter.id}
                className="bg-white rounded-3xl shadow-xl p-8 border-4 border-transparent hover:border-blue-300 transition-all duration-200"
              >
                <div className="flex items-start space-x-6 mb-6">
                  <div className={`w-24 h-24 bg-gradient-to-r ${bgColor} rounded-3xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                    <span className="text-5xl">{icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="mb-3">
                      <span className="text-xl font-semibold text-gray-500">
                        Chapter {index + 1}
                      </span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-3">
                      {chapter.title}
                    </h2>
                    <p className="text-xl text-gray-600 mb-4">
                      {chapter.description}
                    </p>
                  </div>
                </div>

                <div className={`${cardBgColor} rounded-2xl p-6 mt-6`}>
                  {content.type === 'video' && <VideoContent content={content} />}
                  {content.type === 'quiz' && <QuizContent content={content} />}
                  {content.type === 'survey' && <SurveyContent content={content} />}
                  {content.type === 'activities' && <ActivityContent content={content} />}
                  {content.type === 'games' && <GameContent content={content} />}
                  {content.type === 'text' && <TextContent content={content} />}
                </div>
              </div>
            )
          })}

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
