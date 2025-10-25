'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui';

interface MemoryMatchModalProps {
  onClose: () => void;
}

const MemoryMatchModal: React.FC<MemoryMatchModalProps> = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);

  // Game questions for the "Where is the other apple?" challenge
  const gameQuestions = [
    {
      id: 0,
      question: "Where is the other apple?",
      correctPosition: 1, // Top-right position (0-indexed)
      cards: [
        { id: 0, emoji: "🍎", isRevealed: true },
        { id: 1, emoji: "🍎", isRevealed: false },
        { id: 2, emoji: "?", isRevealed: false },
        { id: 3, emoji: "?", isRevealed: false }
      ]
    },
    {
      id: 1,
      question: "Where is the other elephant?",
      correctPosition: 2, // Bottom-left position
      cards: [
        { id: 0, emoji: "🐘", isRevealed: true },
        { id: 1, emoji: "?", isRevealed: false },
        { id: 2, emoji: "🐘", isRevealed: false },
        { id: 3, emoji: "?", isRevealed: false }
      ]
    },
    {
      id: 2,
      question: "Where is the other heart?",
      correctPosition: 3, // Bottom-right position
      cards: [
        { id: 0, emoji: "❤️", isRevealed: true },
        { id: 1, emoji: "?", isRevealed: false },
        { id: 2, emoji: "?", isRevealed: false },
        { id: 3, emoji: "❤️", isRevealed: false }
      ]
    }
  ];

  const currentGame = gameQuestions[currentQuestion];

  const handleCardClick = (cardIndex: number) => {
    if (selectedAnswer !== null || showResult) return;
    
    setSelectedAnswer(cardIndex);
    setShowResult(true);
    
    if (cardIndex === currentGame.correctPosition) {
      setScore(score + 20);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < gameQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setShowHint(false);
    } else {
      // Game completed - restart
      setCurrentQuestion(0);
      setSelectedAnswer(null);
      setShowResult(false);
      setShowHint(false);
      setScore(0);
    }
  };

  const handleHint = () => {
    setShowHint(true);
  };

  const getProgress = () => {
    return ((currentQuestion + 1) / gameQuestions.length) * 100;
  };

  return (
    <div className="text-center">
      <h3 className="text-xl font-semibold mb-4">Memory Match</h3>
      
      {/* Game Challenge */}
      <div className="mb-6">
        <h4 className="text-lg font-bold text-gray-800 mb-4">
          {currentGame.question}
        </h4>
        
        {/* Card Grid */}
        <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto mb-4">
          {currentGame.cards.map((card, index) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(index)}
              disabled={showResult || card.isRevealed}
              className={`aspect-square rounded-lg border-2 transition-all duration-300 flex items-center justify-center text-2xl font-bold ${
                card.isRevealed || (showResult && index === currentGame.correctPosition)
                  ? 'bg-white border-green-300 shadow-md'
                  : showResult && selectedAnswer === index && index !== currentGame.correctPosition
                  ? 'bg-red-100 border-red-300 text-red-600'
                  : showHint && index === currentGame.correctPosition
                  ? 'bg-yellow-100 border-yellow-300'
                  : 'bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300'
              }`}
            >
              {card.isRevealed || (showResult && index === currentGame.correctPosition) || (showHint && index === currentGame.correctPosition)
                ? card.emoji
                : '?'
              }
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-3 mb-4">
          <Button
            onClick={handleHint}
            disabled={showHint || showResult}
            className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium"
          >
            Hint
          </Button>
          <Button
            onClick={() => setShowResult(true)}
            disabled={selectedAnswer === null || showResult}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            Submit
          </Button>
        </div>

        {/* Result Display */}
        {showResult && (
          <div className="mb-4">
            <div className={`p-3 rounded-lg mb-3 ${
              selectedAnswer === currentGame.correctPosition
                ? 'bg-green-100 border border-green-300'
                : 'bg-red-100 border border-red-300'
            }`}>
              <p className={`text-sm font-bold ${
                selectedAnswer === currentGame.correctPosition
                  ? 'text-green-800'
                  : 'text-red-800'
              }`}>
                {selectedAnswer === currentGame.correctPosition
                  ? '✓ Correct! Well done!'
                  : '✗ Incorrect. The correct answer is highlighted in green.'}
              </p>
            </div>
            <Button
              onClick={handleNextQuestion}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg text-sm font-medium"
            >
              {currentQuestion < gameQuestions.length - 1 ? 'Next Question' : 'Play Again'}
            </Button>
          </div>
        )}
      </div>

      {/* Progress and Score */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Progress</span>
          <span className="text-sm text-gray-600">{Math.round(getProgress())}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
          <div 
            className="bg-purple-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${getProgress()}%` }}
          ></div>
        </div>
        <div className="text-right">
          <span className="text-lg font-bold text-purple-600">Score: {score}</span>
        </div>
      </div>
    </div>
  );
};

export default MemoryMatchModal;