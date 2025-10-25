// src/components/FeedbackModal.tsx
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui';

interface FeedbackModalProps {
  isOpen: boolean;
  onSubmit: (feedback: FeedbackData) => void;
}

interface FeedbackData {
  rating: string | null;
  note: string;
  tags: string[];
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ 
  isOpen, 
  onSubmit
}) => {
  const [sessionRating, setSessionRating] = useState<string | null>(null);
  const [feedbackNote, setFeedbackNote] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const feedbackTags = [
    { id: 'loved-activity', label: 'Loved the activity', icon: '👶', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    { id: 'too-fast', label: 'Too fast', icon: '⚡', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    { id: 'learned-new', label: 'Learned something new', icon: '💡', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    { id: 'too-slow', label: 'Too slow', icon: '🐌', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    { id: 'confusing', label: 'Confusing', icon: '❓', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    { id: 'helpful', label: 'Very helpful', icon: '👍', color: 'bg-blue-100 text-blue-800 border-blue-200' }
  ];

  const ratingOptions = [
    { id: 'great', label: 'Great', emoji: '😊', color: 'bg-green-500' },
    { id: 'okay', label: 'Okay', emoji: '😐', color: 'bg-yellow-500' },
    { id: 'not-good', label: 'Not Good', emoji: '😞', color: 'bg-orange-500' }
  ];

  const handleRatingSelect = (rating: string) => {
    setSessionRating(rating);
  };

  const handleTagToggle = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleSubmit = () => {
    if (!sessionRating) {
      alert('Please select a rating before submitting feedback.');
      return;
    }
    
    onSubmit({
      rating: sessionRating,
      note: feedbackNote,
      tags: selectedTags
    });
    
    // Reset form
    setSessionRating(null);
    setFeedbackNote('');
    setSelectedTags([]);
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl  p-6">
        {/* Modal Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-blue-900 mb-2">How was your session?</h2>
          <p className="text-blue-700">Your feedback helps us make classes better for you.</p>
        </div>

        {/* Rating Section */}
        <div className="mb-6">
          <div className="text-center mb-4">
            <p className="text-blue-900 font-semibold">Please rate your session *</p>
          </div>
          <div className="flex justify-center space-x-8">
            {ratingOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleRatingSelect(option.id)}
                className={`flex flex-col items-center space-y-2 transition-transform hover:scale-105 ${
                  sessionRating === option.id ? 'scale-105' : ''
                }`}
              >
                <div className={`w-16 h-16 ${option.color} rounded-full flex items-center justify-center text-3xl shadow-lg ${
                  sessionRating === option.id ? 'ring-4 ring-blue-300' : ''
                }`}>
                  {option.emoji}
                </div>
                <span className="text-blue-900 font-medium text-sm">{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Note Input */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={feedbackNote}
              onChange={(e) => setFeedbackNote(e.target.value)}
              placeholder="Write a quick note if you'd like"
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-gray-700"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <span className="text-xl">🎤</span>
            </button>
          </div>
        </div>

        {/* Feedback Tags */}
        <div className="mb-6">
          <div className="grid grid-cols-2 gap-3">
            {feedbackTags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => handleTagToggle(tag.id)}
                className={`p-3 rounded-xl border-2 transition-all duration-200 flex items-center space-x-2 ${
                  selectedTags.includes(tag.id)
                    ? 'bg-blue-500 text-white border-blue-600'
                    : `${tag.color} border-gray-200 hover:border-blue-300`
                }`}
              >
                <span className="text-lg">{tag.icon}</span>
                <span className="text-sm font-medium">{tag.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-200 ${
            sessionRating 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          disabled={!sessionRating}
        >
          {sessionRating ? 'Submit Feedback' : 'Please select a rating first'}
        </Button>
      </div>
    </div>
  );
};

export default FeedbackModal;