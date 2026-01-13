'use client'

import React, { useState } from 'react'
import { SurveyContent as SurveyContentType } from '@/types/course'
import { Button } from '@/components/ui'

interface SurveyContentProps {
  content: SurveyContentType
  onComplete?: () => void
}

export default function SurveyContent({ content, onComplete }: SurveyContentProps) {
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Survey submitted successfully!')
    console.log('Survey answers:', answers)
    // Auto-progress after survey submission
    if (onComplete) {
      setTimeout(() => {
        onComplete()
      }, 500)
    }
  }

  const handleChange = (questionId: string, value: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }))
  }

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-gray-800">{content.title}</h4>
      <form onSubmit={handleSubmit} className="space-y-4">
        {content.questions.map((question) => (
          <div key={question.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {question.question}
            </label>
            
            {question.input_type === 'radio' && question.options && (
              <div className="space-y-2">
                {question.options.map((option, idx) => (
                  <label key={idx} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name={question.id}
                      value={option}
                      onChange={(e) => handleChange(question.id, e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            )}

            {question.input_type === 'checkbox' && question.options && (
              <div className="space-y-2">
                {question.options.map((option, idx) => (
                  <label key={idx} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name={question.id}
                      value={option}
                      onChange={(e) => {
                        const current = Array.isArray(answers[question.id]) 
                          ? answers[question.id] as string[]
                          : []
                        if (e.target.checked) {
                          handleChange(question.id, [...current, option])
                        } else {
                          handleChange(question.id, current.filter((v: string) => v !== option))
                        }
                      }}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            )}

            {question.input_type === 'text' && (
              <input
                type="text"
                name={question.id}
                onChange={(e) => handleChange(question.id, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Type your answer..."
              />
            )}

            {question.input_type === 'textarea' && (
              <textarea
                name={question.id}
                onChange={(e) => handleChange(question.id, e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Type your answer..."
              />
            )}

            {question.input_type === 'range' && (
              <div className="space-y-2">
                <input
                  type="range"
                  name={question.id}
                  min="0"
                  max="100"
                  onChange={(e) => handleChange(question.id, e.target.value)}
                  className="w-full"
                />
                <div className="text-sm text-gray-500">{answers[question.id] || 0}</div>
              </div>
            )}
          </div>
        ))}
        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
          Submit Survey
        </Button>
      </form>
    </div>
  )
}
