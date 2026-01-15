// src/components/SelfPacedSession.tsx
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui';
import { useRouter } from 'next/navigation';
import FeedbackModal from './FeedbackModal';
import MemoryMatchModal from './MemoryMatchModal';
import CognitiveTestCard from '@/components/cognitive/CognitiveTestCard';
import { quizToCognitiveTest } from '@/utils/cognitive-test-helpers';

interface SelfPacedSessionProps {
  classData?: {
    id: string;
    title: string;
    description: string;
    instructor: string;
    category: string;
  };
}

const SelfPacedSession: React.FC<SelfPacedSessionProps> = ({
  classData = {
    id: '1',
    title: 'Health & waylness Session',
    description: 'Self-paced waylness activities',
    instructor: 'waylness Coach',
    category: 'waylness'
  }
}) => {
  const router = useRouter();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const demoContent = [
    {
      id: 1,
      title: 'Hydration & Movement',
      thumbnail: '/api/placeholder/150/100',
      description: 'Learn about proper hydration and gentle movements'
    },
    {
      id: 2,
      title: 'Mindful Breathing',
      thumbnail: '/api/placeholder/150/100',
      description: 'Practice breathing exercises for relaxation'
    },
    {
      id: 3,
      title: 'Staying Active Indoors',
      thumbnail: '/api/placeholder/150/100',
      description: 'Indoor activities to keep you moving'
    }
  ];

  const games = [
    {
      id: 1,
      icon: '🧠',
      name: 'Memory Game',
      description: 'Test your memory skills',
      color: 'from-teal-400 to-teal-500',
      bgColor: 'bg-teal-50',
      hoverColor: 'hover:bg-teal-100',
      borderColor: 'border-teal-200'
    },
    {
      id: 2,
      icon: '🎯',
      name: 'Focus Game',
      description: 'Improve concentration',
      color: 'from-blue-400 to-blue-500',
      bgColor: 'bg-blue-50',
      hoverColor: 'hover:bg-blue-100',
      borderColor: 'border-blue-200'
    },
    {
      id: 3,
      icon: '🔍',
      name: 'Pattern Game',
      description: 'Find the pattern',
      color: 'from-indigo-400 to-indigo-500',
      bgColor: 'bg-indigo-50',
      hoverColor: 'hover:bg-indigo-100',
      borderColor: 'border-indigo-200'
    },
    {
      id: 4,
      icon: '⚡',
      name: 'Speed Game',
      description: 'Quick reactions',
      color: 'from-rose-400 to-rose-500',
      bgColor: 'bg-rose-50',
      hoverColor: 'hover:bg-rose-100',
      borderColor: 'border-rose-200'
    },
    {
      id: 5,
      icon: '🧩',
      name: 'Logic Game',
      description: 'Solve puzzles',
      color: 'from-amber-400 to-amber-500',
      bgColor: 'bg-amber-50',
      hoverColor: 'hover:bg-amber-100',
      borderColor: 'border-amber-200'
    },
    {
      id: 6,
      icon: '🎲',
      name: 'Puzzle Game',
      description: 'Brain teasers',
      color: 'from-cyan-400 to-cyan-500',
      bgColor: 'bg-cyan-50',
      hoverColor: 'hover:bg-cyan-100',
      borderColor: 'border-cyan-200'
    }
  ];

  const quizQuestions = [
    {
      id: 1,
      question: "What is the recommended daily water intake?",
      options: [
        { id: 'A', label: '6-8 glasses', correct: true },
        { id: 'B', label: '2-3 glasses', correct: false },
        { id: 'C', label: '10-12 glasses', correct: false },
        { id: 'D', label: '1-2 glasses', correct: false }
      ]
    },
    {
      id: 2,
      question: "Which exercise is best for seniors?",
      options: [
        { id: 'A', label: 'Heavy weightlifting', correct: false },
        { id: 'B', label: 'Gentle walking', correct: true },
        { id: 'C', label: 'High-intensity cardio', correct: false },
        { id: 'D', label: 'No exercise needed', correct: false }
      ]
    },
    {
      id: 3,
      question: "How often should you take breaks during sitting?",
      options: [
        { id: 'A', label: 'Every 2 hours', correct: false },
        { id: 'B', label: 'Every 30 minutes', correct: true },
        { id: 'C', label: 'Once a day', correct: false },
        { id: 'D', label: 'Never', correct: false }
      ]
    }
  ];

  // Quiz state removed - now managed by CognitiveTestCard component
  const [selectedGame, setSelectedGame] = useState<typeof games[0] | null>(null);
  const [showGameModal, setShowGameModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const hydrationOptions = [
    { id: 'A', label: 'A' },
    { id: '2', label: '2' },
    { id: '5', label: '5' },
    { id: '6+', label: '6+' }
  ];


  const handleLeaveSession = () => {
    setShowFeedbackModal(true);
  };

  const handleCloseFeedbackModal = () => {
    setShowFeedbackModal(false);
    router.push('/classes');
  };

  const handleSubmitFeedback = (feedback: { rating: string | null; note: string; tags: string[] }) => {
    // Handle feedback submission
    console.log('Feedback submitted:', feedback);

    // You can add API call here
    alert('Thank you for your feedback!');
    handleCloseFeedbackModal();
  };

  // Quiz handlers removed - now using CognitiveTestCard component

  const handleGameClick = (gameId: number) => {
    const game = games.find(g => g.id === gameId);
    if (game) {
      setSelectedGame(game);
      setShowGameModal(true);
    }
  };

  const handleCloseGameModal = () => {
    setShowGameModal(false);
    setSelectedGame(null);
  };

  const handleHydrationSelect = (option: string) => {
    setSelectedAnswer(option);
  };


  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center border border-teal-100">
                <span className="text-2xl">🌱</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">{classData.title}</h1>
                <p className="text-slate-500">Self-paced Session</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleLeaveSession}
              className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 px-6"
            >
              End Session
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Demo Class Content */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 min-h-80 flex flex-col">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                  <span className="text-2xl">📚</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Learning Content</h2>
              </div>
              <div className="space-y-4 flex-1">
                {demoContent.map((content) => (
                  <div key={content.id} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 cursor-pointer transition-all duration-200 border-2 border-transparent hover:border-blue-300">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-500 rounded-xl flex items-center justify-center shadow-md">
                      <span className="text-2xl">▶️</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-800 mb-1">{content.title}</h3>
                      <p className="text-gray-600">{content.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Health Quiz - Using Unified Cognitive Test Architecture */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 min-h-80 flex flex-col">
              <CognitiveTestCard
                config={quizToCognitiveTest({
                  type: 'quiz',
                  title: 'Health Quiz',
                  questions: quizQuestions.map(q => ({
                    id: q.id.toString(),
                    question: q.question,
                    options: q.options.map(opt => ({
                      id: opt.id,
                      label: opt.label,
                      correct: opt.correct
                    }))
                  }))
                }, 'single-tap')}
                onComplete={(result) => {
                  console.log('Self-paced quiz completed:', result);
                  // Quiz state is managed by CognitiveTestCard component
                }}
              />
            </div>

          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Games Section */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 min-h-80 flex flex-col">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                  <span className="text-2xl">🎮</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Fun Games</h2>
              </div>
              <div className="grid grid-cols-2 gap-4 flex-1">
                {games.map((game) => (
                  <button
                    key={game.id}
                    onClick={() => handleGameClick(game.id)}
                    className={`${game.bgColor} ${game.hoverColor} ${game.borderColor || ''} p-4 rounded-xl border-2 transition-all duration-200 group flex flex-col items-center justify-center text-center`}
                  >
                    <div className={`w-16 h-16 bg-gradient-to-r ${game.color} rounded-xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-200 mb-3 shadow-md`}>
                      {game.icon}
                    </div>
                    <h3 className="font-bold text-slate-800 text-sm group-hover:text-slate-900 mb-1">
                      {game.name}
                    </h3>
                    <p className="text-xs text-slate-600 group-hover:text-slate-700 leading-tight">
                      {game.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Activity Section - Hydration */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 min-h-80 flex flex-col">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center mr-4">
                  <span className="text-2xl">💧</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Daily Hydration</h2>
              </div>
              <div className="flex-1 flex flex-col">
                <div className="bg-cyan-50 rounded-xl p-4 mb-6">
                  <p className="text-lg text-cyan-800 font-semibold">How many glasses of water did you drink today?</p>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {hydrationOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleHydrationSelect(option.id)}
                      className={`p-6 rounded-2xl font-bold text-2xl transition-all duration-200 border-2 ${selectedAnswer === option.id
                        ? 'bg-cyan-600 text-white border-cyan-700 shadow-lg'
                        : 'bg-cyan-50 text-cyan-800 hover:bg-cyan-100 border-cyan-200 hover:border-cyan-400'
                        }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                <div className="mt-auto">
                  <Button
                    className="w-full bg-green-500 hover:bg-green-600 text-white text-lg py-4 rounded-xl font-bold"
                    disabled={!selectedAnswer}
                  >
                    {selectedAnswer ? 'Great Job! 🎉' : 'Select an option'}
                  </Button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Game Modal */}
      {showGameModal && selectedGame && (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className={`bg-gradient-to-r ${selectedGame.color} p-6 text-white`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">{selectedGame.icon}</div>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedGame.name}</h2>
                    <p className="text-white/90">{selectedGame.description}</p>
                  </div>
                </div>
                <button
                  onClick={handleCloseGameModal}
                  className="text-white/80 hover:text-white text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {selectedGame.id === 1 && (
                <MemoryMatchModal onClose={handleCloseGameModal} />
              )}

              {selectedGame.id === 2 && (
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-4">Focus Game</h3>
                  <div className="w-32 h-32 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <div className="w-16 h-16 bg-blue-500 rounded-full animate-pulse"></div>
                  </div>
                  <p className="text-gray-600 mb-4">Focus on the center dot and count your breaths!</p>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Start Focus Session
                  </Button>
                </div>
              )}

              {selectedGame.id === 3 && (
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-4">Pattern Game</h3>
                  <div className="grid grid-cols-3 gap-2 mb-6">
                    {['🔴', '🔵', '🟢', '🔵', '🟢', '🔴', '🟢', '🔴', '?'].map((shape, index) => (
                      <div
                        key={index}
                        className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-2xl"
                      >
                        {shape}
                      </div>
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">What comes next in the pattern?</p>
                  <div className="flex justify-center space-x-2">
                    {['🔴', '🔵', '🟢'].map((option) => (
                      <button
                        key={option}
                        className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center text-2xl"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedGame.id === 4 && (
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-4">Speed Game</h3>
                  <div className="w-32 h-32 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                    <div className="text-4xl">⚡</div>
                  </div>
                  <p className="text-gray-600 mb-4">Click as fast as you can when the light turns green!</p>
                  <Button className="bg-red-600 hover:bg-red-700 text-white">
                    Start Speed Test
                  </Button>
                </div>
              )}

              {selectedGame.id === 5 && (
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-4">Logic Game</h3>
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <p className="text-sm text-gray-700 mb-2">If all cats are animals and Fluffy is a cat, then:</p>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="radio" name="logic" className="mr-2" />
                        Fluffy is an animal
                      </label>
                      <label className="flex items-center">
                        <input type="radio" name="logic" className="mr-2" />
                        Fluffy is not an animal
                      </label>
                      <label className="flex items-center">
                        <input type="radio" name="logic" className="mr-2" />
                        We can&apos;t tell
                      </label>
                    </div>
                  </div>
                  <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                    Submit Answer
                  </Button>
                </div>
              )}

              {selectedGame.id === 6 && (
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-4">Puzzle Game</h3>
                  <div className="grid grid-cols-3 gap-2 mb-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                      <div
                        key={num}
                        className="aspect-square bg-teal-100 hover:bg-teal-200 rounded-lg flex items-center justify-center text-xl font-bold cursor-pointer transition-colors"
                      >
                        {num}
                      </div>
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">Arrange the numbers in order from 1 to 9!</p>
                  <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                    Start Puzzle
                  </Button>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={handleCloseGameModal}
                className="border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Close
              </Button>
              <Button
                onClick={handleCloseGameModal}
                className={`bg-gradient-to-r ${selectedGame.color} text-white`}
              >
                Play Game
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={showFeedbackModal}
        onSubmit={handleSubmitFeedback}
      />
    </div>
  );
};

export default SelfPacedSession;