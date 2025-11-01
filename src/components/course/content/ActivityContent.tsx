'use client'

import React, { useState } from 'react'
import { ActivityContent as ActivityContentType } from '@/types/course'
import { Button } from '@/components/ui'

interface ActivityContentProps {
  content: ActivityContentType
}

export default function ActivityContent({ content }: ActivityContentProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)

  const handleSubmit = () => {
    alert(`${content.title} completed!`)
    setSelectedAnswer(null)
  }

  if (content.activity_type === 'hydration') {
    const hydrationOptions = ['A', '2', '5', '6+']

    return (
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-800">{content.title}</h4>
        <p className="text-gray-600">{content.description}</p>
        
        <div className="bg-cyan-50 rounded-xl p-6 border-2 border-cyan-200">
          <div className="grid grid-cols-2 gap-4 mb-4">
            {hydrationOptions.map((option) => (
              <button
                key={option}
                onClick={() => setSelectedAnswer(option)}
                className={`p-6 rounded-2xl font-bold text-2xl transition-all duration-200 border-2 ${
                  selectedAnswer === option
                    ? 'bg-cyan-600 text-white border-cyan-700 shadow-lg'
                    : 'bg-cyan-50 text-cyan-800 hover:bg-cyan-100 border-cyan-200 hover:border-cyan-400'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          <Button
            onClick={handleSubmit}
            disabled={!selectedAnswer}
            className="w-full bg-green-500 hover:bg-green-600 text-white"
          >
            {selectedAnswer ? 'Great Job! 🎉' : 'Select your answer'}
          </Button>
        </div>
      </div>
    )
  }

  if (content.activity_type === 'single_choice' && content.options) {
    return (
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-800">{content.title}</h4>
        <p className="text-gray-600">{content.description}</p>
        
        <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
          <div className="space-y-2">
            {content.options.map((option) => (
              <button
                key={option}
                onClick={() => setSelectedAnswer(option)}
                className={`w-full p-4 rounded-xl font-bold text-left transition-all duration-200 border-2 ${
                  selectedAnswer === option
                    ? 'bg-blue-600 text-white border-blue-700 shadow-lg'
                    : 'bg-blue-50 text-blue-800 hover:bg-blue-100 border-blue-200 hover:border-blue-400'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          <Button
            onClick={handleSubmit}
            disabled={!selectedAnswer}
            className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white"
          >
            {selectedAnswer ? 'Submit' : 'Select an option'}
          </Button>
        </div>
      </div>
    )
  }

  if (content.activity_type === 'mcq' && content.options) {
    return (
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-800">{content.title}</h4>
        <p className="text-gray-600">{content.description}</p>
        
        <div className="bg-indigo-50 rounded-xl p-6 border-2 border-indigo-200">
          <div className="space-y-2">
            {content.options.map((option) => (
              <label key={option} className="flex items-center space-x-2 cursor-pointer bg-white p-3 rounded-lg hover:bg-indigo-50">
                <input
                  type="checkbox"
                  value={option}
                  checked={selectedAnswer === option}
                  onChange={(e) => setSelectedAnswer(e.target.checked ? option : null)}
                  className="w-4 h-4 text-indigo-600"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
          <Button
            onClick={handleSubmit}
            disabled={!selectedAnswer}
            className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {selectedAnswer ? 'Submit' : 'Select an option'}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-gray-800">{content.title}</h4>
      <p className="text-gray-600">{content.description}</p>
    </div>
  )
}
