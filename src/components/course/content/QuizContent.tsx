'use client'

import React, { useState } from 'react'
import { QuizContent as QuizContentType } from '@/types/course'
import { Button } from '@/components/ui'

interface QuizContentProps {
  content: QuizContentType
}

export default function QuizContent({ content }: QuizContentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)

  const handleAnswer = (questionId: string, optionId: string, isCorrect: boolean) => {
    setAnswers({ ...answers, [questionId]: optionId })
    if (isCorrect) {
      setScore(score + 1)
    }
    setShowResult(true)
  }

  const handleNext = () => {
    if (currentQuestion < content.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setShowResult(false)
    } else {
      alert(`Quiz completed! Your score: ${score + (showResult ? 0 : 1)}/${content.questions.length}`)
      setCurrentQuestion(0)
      setAnswers({})
      setScore(0)
      setShowResult(false)
    }
  }

  const question = content.questions[currentQuestion]
  const userAnswer = answers[question.id]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-gray-800">{content.title}</h4>
        <span className="text-sm text-gray-500">
          Question {currentQuestion + 1} of {content.questions.length}
        </span>
      </div>

      <div className="bg-blue-50 rounded-xl p-4 mb-4">
        <p className="text-lg text-gray-800 font-medium">{question.question}</p>
      </div>

      <div className="space-y-2">
        {question.options.map((option) => {
          const isSelected = userAnswer === option.id
          const showCorrect = showResult && option.correct
          const showIncorrect = showResult && isSelected && !option.correct

          return (
            <button
              key={option.id}
              onClick={() => !showResult && handleAnswer(question.id, option.id, option.correct)}
              disabled={showResult}
              className={`w-full p-4 rounded-xl font-bold text-left transition-all duration-200 border-2 ${
                showResult
                  ? showCorrect
                    ? 'bg-green-500 text-white border-green-600'
                    : showIncorrect
                    ? 'bg-red-500 text-white border-red-600'
                    : 'bg-gray-200 text-gray-600 border-gray-300'
                  : isSelected
                  ? 'bg-blue-600 text-white border-blue-700 shadow-lg'
                  : 'bg-blue-50 text-blue-800 hover:bg-blue-100 border-blue-200 hover:border-blue-400'
              }`}
            >
              <span className="font-bold mr-3">{option.id}.</span>
              {option.label}
            </button>
          )
        })}
      </div>

      {showResult && (
        <div className="mt-4">
          <div className={`p-4 rounded-xl mb-4 ${
            question.options.find(opt => opt.id === userAnswer)?.correct
              ? 'bg-green-100 border-2 border-green-300'
              : 'bg-red-100 border-2 border-red-300'
          }`}>
            <p className={`text-lg font-bold ${
              question.options.find(opt => opt.id === userAnswer)?.correct
                ? 'text-green-800'
                : 'text-red-800'
            }`}>
              {question.options.find(opt => opt.id === userAnswer)?.correct
                ? '✓ Correct! Well done!'
                : '✗ Incorrect. The correct answer is highlighted in green.'}
            </p>
          </div>
          <Button
            onClick={handleNext}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            {currentQuestion < content.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
          </Button>
        </div>
      )}
    </div>
  )
}
