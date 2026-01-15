'use client';

import React, { useState } from 'react';
import { Button, Icon } from '@/components/ui';

interface QuizModalProps {
    onClose: () => void;
}

// Mock API Data
const MOCK_QUIZ = {
    id: 'q1',
    question: 'How many hours of sleep are recommended?',
    options: [
        { id: 'a', text: '4-5' },
        { id: 'b', text: '7-9' },
        { id: 'c', text: '10-12' }
    ],
    correctOptionId: 'b'
};

const MOCK_QUIZ_2 = {
    id: 'q2',
    question: 'Which is a macronutrient?',
    options: [
        { id: 'a', text: 'Vitamin C' },
        { id: 'b', text: 'Protein' },
        { id: 'c', text: 'Iron' }
    ],
    correctOptionId: 'b'
};

const QUIZZES = [MOCK_QUIZ, MOCK_QUIZ_2];

const QuizModal: React.FC<QuizModalProps> = ({ onClose }) => {
    const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    const currentQuiz = QUIZZES[currentQuizIndex];
    const isLastQuestion = currentQuizIndex === QUIZZES.length - 1;

    const handleOptionSelect = (id: string) => {
        if (isSubmitted) return;
        setSelectedOption(id);
    };

    const handleSubmit = () => {
        setIsSubmitted(true);
        if (selectedOption === currentQuiz.correctOptionId) {
            setScore(prev => prev + 1);
        }
    };

    const handleNext = () => {
        if (isLastQuestion) {
            // Show completion or close
            // For now, just reset for demo or close
            onClose();
        } else {
            setCurrentQuizIndex(prev => prev + 1);
            setSelectedOption(null);
            setIsSubmitted(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up">
                {/* Header */}
                <div className="bg-teal-primary px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-white">
                        <Icon name="heart" size="md" color="white" />
                        <h3 className="text-xl font-bold">Health Quiz</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <Icon name="x" size="sm" color="white" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="mb-6">
                        <span className="text-xs font-bold text-teal-primary uppercase tracking-wider mb-2 block">
                            Question {currentQuizIndex + 1} of {QUIZZES.length}
                        </span>
                        <h4 className="text-xl font-bold text-neutral-dark">
                            {currentQuiz.question}
                        </h4>
                    </div>

                    <div className="space-y-3">
                        {currentQuiz.options.map((option) => {
                            const isSelected = selectedOption === option.id;
                            const isCorrect = option.id === currentQuiz.correctOptionId;

                            let borderClass = "border-neutral-light hover:border-teal-primary/50";
                            let bgClass = "bg-white hover:bg-neutral-light/50";
                            let iconColor = "#9CA3AF"; // gray

                            if (isSelected && !isSubmitted) {
                                borderClass = "border-teal-primary ring-1 ring-teal-primary";
                                bgClass = "bg-teal-light/20";
                                iconColor = "#4CAF9D"; // teal
                            }

                            if (isSubmitted) {
                                if (isCorrect) {
                                    borderClass = "border-green-500 bg-green-50";
                                    iconColor = "#22c55e"; // green
                                } else if (isSelected && !isCorrect) {
                                    borderClass = "border-red-500 bg-red-50";
                                    iconColor = "#ef4444"; // red
                                } else {
                                    borderClass = "border-neutral-light opacity-50";
                                }
                            }

                            return (
                                <button
                                    key={option.id}
                                    onClick={() => handleOptionSelect(option.id)}
                                    disabled={isSubmitted}
                                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center space-x-3 ${borderClass} ${bgClass}`}
                                >
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected || (isSubmitted && isCorrect) ? 'border-current' : 'border-gray-300'
                                        }`}
                                        style={{ color: iconColor }}
                                    >
                                        {(isSelected || (isSubmitted && isCorrect)) && <div className="w-2.5 h-2.5 rounded-full bg-current" />}
                                    </div>
                                    <span className={`font-medium ${isSubmitted && isCorrect ? 'text-green-800' : 'text-neutral-dark'}`}>
                                        {option.text}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-neutral-light bg-neutral-light/30 flex justify-between items-center">
                    <div className="text-sm font-medium text-neutral-medium">
                        Score: <span className="text-teal-primary font-bold">{score}</span>
                    </div>

                    {!isSubmitted ? (
                        <Button
                            onClick={handleSubmit}
                            disabled={!selectedOption}
                            className="bg-teal-primary text-white hover:bg-teal-dark rounded-xl px-8"
                        >
                            Submit Answer
                        </Button>
                    ) : (
                        <Button
                            onClick={handleNext}
                            className="bg-teal-primary text-white hover:bg-teal-dark rounded-xl px-8"
                        >
                            {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuizModal;
