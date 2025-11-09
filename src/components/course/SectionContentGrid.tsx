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

interface SectionContentGridProps {
  chapters: Chapter[]
  courseId: string
  moduleId: string
  sectionId: string
  title: string
}

export default function SectionContentGrid({ chapters, title }: SectionContentGridProps) {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [currentQuiz] = useState(0)
  const [currentVideo, setCurrentVideo] = useState(0)

  // Filter content by type
  const videoChapters = chapters.filter(ch => ch.content.type === 'video')
  const quizChapters = chapters.filter(ch => ch.content.type === 'quiz')
  const surveyChapters = chapters.filter(ch => ch.content.type === 'survey')
  const textChapters = chapters.filter(ch => ch.content.type === 'text')
  const gameChapters = chapters.filter(ch => ch.content.type === 'games')
  const activityChapters = chapters.filter(ch => ch.content.type === 'activities')

  const renderContent = (content: CourseContent) => {
    switch (content.type) {
      case 'video':
        return <VideoContent content={content} />
      case 'survey':
        return <SurveyContent content={content} />
      case 'quiz':
        return <QuizContent content={content} />
      case 'text':
        return <TextContent content={content} />
      case 'games':
        return <GameContent content={content} />
      case 'activities':
        return <ActivityContent content={content} />
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                <span className="text-3xl">🏥</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
                <p className="text-lg text-gray-600">Self-paced Session</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Learning Content - Video Chapters */}
            {videoChapters.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 min-h-80 flex flex-col">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                    <span className="text-2xl">📚</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Learning Content</h2>
                </div>
                <div className="space-y-4 flex-1">
                  {videoChapters.map((chapter, index) => (
                    <button
                      key={chapter.id}
                      onClick={() => setCurrentVideo(index)}
                      className="w-full flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 cursor-pointer transition-all duration-200 border-2 border-transparent hover:border-blue-300"
                    >
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-500 rounded-xl flex items-center justify-center shadow-md">
                        <span className="text-2xl">▶️</span>
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="font-bold text-lg text-gray-800 mb-1">{chapter.title}</h3>
                        <p className="text-gray-600">{chapter.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Show Selected Video */}
            {videoChapters.length > 0 && currentVideo < videoChapters.length && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                {renderContent(videoChapters[currentVideo].content)}
              </div>
            )}

            {/* Text Chapters */}
            {textChapters.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 min-h-80 flex flex-col">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4">
                    <span className="text-2xl">📄</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Reading Materials</h2>
                </div>
                <div className="space-y-4">
                  {textChapters.map((chapter) => (
                    <div key={chapter.id}>
                      <h3 className="font-bold text-lg text-gray-800 mb-2">{chapter.title}</h3>
                      {renderContent(chapter.content)}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Survey Chapters */}
            {surveyChapters.length > 0 && surveyChapters.map((chapter) => (
              <div key={chapter.id} className="bg-white rounded-2xl shadow-lg p-6 min-h-80 flex flex-col">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mr-4">
                    <span className="text-2xl">📋</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Survey</h2>
                </div>
                <div className="flex-1">
                  {renderContent(chapter.content)}
                </div>
              </div>
            ))}

            {/* Quiz Chapters */}
            {quizChapters.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 min-h-80 flex flex-col">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-4">
                    <span className="text-2xl">🧠</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Health Quiz</h2>
                </div>
                <div className="flex-1">
                  {quizChapters[currentQuiz] && renderContent(quizChapters[currentQuiz].content)}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Games Section */}
            {gameChapters.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 min-h-80 flex flex-col">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                    <span className="text-2xl">🎮</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Fun Games</h2>
                </div>
                <div className="grid grid-cols-2 gap-4 flex-1">
                  {gameChapters.map((chapter, index) => {
                    const gamesData = [
                      { icon: '🧠', name: 'Memory Game', description: 'Test your memory skills', color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-50', hoverColor: 'hover:bg-purple-100' },
                      { icon: '🎯', name: 'Focus Game', description: 'Improve concentration', color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50', hoverColor: 'hover:bg-blue-100' },
                      { icon: '🔍', name: 'Pattern Game', description: 'Find the pattern', color: 'from-green-500 to-green-600', bgColor: 'bg-green-50', hoverColor: 'hover:bg-green-100' },
                      { icon: '⚡', name: 'Speed Game', description: 'Quick reactions', color: 'from-red-500 to-red-600', bgColor: 'bg-red-50', hoverColor: 'hover:bg-red-100' },
                      { icon: '🧩', name: 'Logic Game', description: 'Solve puzzles', color: 'from-orange-500 to-orange-600', bgColor: 'bg-orange-50', hoverColor: 'hover:bg-orange-100' },
                      { icon: '🎲', name: 'Puzzle Game', description: 'Brain teasers', color: 'from-teal-500 to-teal-600', bgColor: 'bg-teal-50', hoverColor: 'hover:bg-teal-100' }
                    ]
                    const gameInfo = gamesData[index % gamesData.length]
                    
                    return (
                      <div
                        key={chapter.id}
                        className={`${gameInfo.bgColor} ${gameInfo.hoverColor} p-4 rounded-2xl border-2 border-transparent hover:border-gray-300 transition-all duration-200 group flex flex-col items-center justify-center text-center`}
                      >
                        <div className={`w-16 h-16 bg-gradient-to-r ${gameInfo.color} rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-200 mb-3 shadow-lg`}>
                          {gameInfo.icon}
                        </div>
                        <h3 className="font-bold text-gray-800 text-sm group-hover:text-gray-900 mb-1">
                          {chapter.title}
                        </h3>
                        <p className="text-xs text-gray-600 group-hover:text-gray-700 leading-tight">
                          {chapter.description}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Activity Chapters */}
            {activityChapters.map((chapter) => (
              <div key={chapter.id} className="bg-white rounded-2xl shadow-lg p-6 min-h-80 flex flex-col">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center mr-4">
                    <span className="text-2xl">💧</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">{chapter.title}</h2>
                </div>
                <div className="flex-1">
                  {renderContent(chapter.content)}
                </div>
              </div>
            ))}
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
