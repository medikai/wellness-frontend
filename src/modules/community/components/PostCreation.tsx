'use client';

import React, { useState } from 'react';
import { Card, Button, Icon } from '@/components/ui';
import { useCommunity } from '@/contexts/CommunityContext';
import { CommunityPost } from '@/types/community';

const PostCreation: React.FC = () => {
  const { createPost, canParticipate } = useCommunity();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    activityType: 'general' as CommunityPost['activityType'],
    title: '',
    description: '',
    metrics: {
      steps: 0,
      duration: 0,
      calories: 0,
      distance: 0,
    },
  });

  const activityTypes = [
    { value: 'walking', label: 'Walking', icon: '🚶‍♀️' },
    { value: 'breathing', label: 'Breathing Exercise', icon: '🫁' },
    { value: 'yoga', label: 'Yoga', icon: '🧘‍♀️' },
    { value: 'meditation', label: 'Meditation', icon: '🧘‍♂️' },
    { value: 'class', label: 'Class', icon: '📚' },
    { value: 'challenge', label: 'Challenge', icon: '🏆' },
    { value: 'general', label: 'General', icon: '💪' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canParticipate) {
      alert('You do not have permission to create posts');
      return;
    }
    
    if (!formData.title.trim() || !formData.description.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    const newPost = {
      activityType: formData.activityType,
      title: formData.title,
      description: formData.description,
      metrics: formData.metrics.steps > 0 || formData.metrics.duration > 0 || 
               formData.metrics.calories > 0 || formData.metrics.distance > 0 
               ? formData.metrics : undefined,
    };

    createPost(newPost);
    
    // Reset form
    setFormData({
      activityType: 'general',
      title: '',
      description: '',
      metrics: { steps: 0, duration: 0, calories: 0, distance: 0 },
    });
    setIsOpen(false);
  };

  const handleInputChange = (field: string, value: string | number) => {
    if (field.startsWith('metrics.')) {
      const metricField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        metrics: {
          ...prev.metrics,
          [metricField]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  if (!isOpen) {
    return (
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-neutral-dark mb-2">Share Your Progress</h2>
            <p className="text-neutral-medium">Let your community know about your wellness journey</p>
          </div>
          <Button 
            variant="primary" 
            size="lg"
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2"
          >
            <Icon name="plus" size="sm" />
            Create Post
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-neutral-dark">Create New Post</h2>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setIsOpen(false)}
        >
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Activity Type Selection */}
        <div>
          <label className="block text-sm font-medium text-neutral-dark mb-2">
            Activity Type
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {activityTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => handleInputChange('activityType', type.value)}
                className={`p-3 rounded-lg border-2 text-center transition-colors ${
                  formData.activityType === type.value
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-1">{type.icon}</div>
                <div className="text-xs font-medium">{type.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-neutral-dark mb-2">
            Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="What did you accomplish today?"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-neutral-dark mb-2">
            Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Tell us more about your activity..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          />
        </div>

        {/* Metrics */}
        <div>
          <label className="block text-sm font-medium text-neutral-dark mb-2">
            Metrics (Optional)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs text-neutral-medium mb-1">Steps</label>
              <input
                type="number"
                value={formData.metrics.steps}
                onChange={(e) => handleInputChange('metrics.steps', parseInt(e.target.value) || 0)}
                placeholder="0"
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-medium mb-1">Duration (min)</label>
              <input
                type="number"
                value={formData.metrics.duration}
                onChange={(e) => handleInputChange('metrics.duration', parseInt(e.target.value) || 0)}
                placeholder="0"
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-medium mb-1">Calories</label>
              <input
                type="number"
                value={formData.metrics.calories}
                onChange={(e) => handleInputChange('metrics.calories', parseInt(e.target.value) || 0)}
                placeholder="0"
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-medium mb-1">Distance (km)</label>
              <input
                type="number"
                step="0.1"
                value={formData.metrics.distance}
                onChange={(e) => handleInputChange('metrics.distance', parseFloat(e.target.value) || 0)}
                placeholder="0"
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="flex items-center gap-2"
          >
            <Icon name="send" size="sm" />
            Share Post
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default PostCreation;