'use client'

import React from 'react'
import { Chapter, CourseContent } from '@/types/course'
import VideoContent from './content/VideoContent'
import SurveyContent from './content/SurveyContent'
import QuizContent from './content/QuizContent'
import TextContent from './content/TextContent'
import GameContent from './content/GameContent'
import ActivityContent from './content/ActivityContent'

interface SectionContentProps {
  chapters: Chapter[]
  courseId: string
  moduleId: string
  sectionId: string
}

export default function SectionContent({ chapters }: SectionContentProps) {
  const renderContent = (content: CourseContent, chapterIndex: number) => {
    switch (content.type) {
      case 'video':
        return <VideoContent content={content} key={chapterIndex} />
      case 'survey':
        return <SurveyContent content={content} key={chapterIndex} />
      case 'quiz':
        return <QuizContent content={content} key={chapterIndex} />
      case 'text':
        return <TextContent content={content} key={chapterIndex} />
      case 'games':
        return <GameContent content={content} key={chapterIndex} />
      case 'activities':
        return <ActivityContent content={content} key={chapterIndex} />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Chapters</h2>
      <div className="space-y-6">
        {chapters.map((chapter, index) => (
          <div
            key={chapter.id}
            className="bg-white rounded-2xl shadow-lg p-6 border-2 border-transparent hover:border-blue-300 transition-all duration-200"
          >
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold">{index + 1}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800">{chapter.title}</h3>
              </div>
              <p className="text-gray-600 ml-13">{chapter.description}</p>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              {renderContent(chapter.content, index)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
