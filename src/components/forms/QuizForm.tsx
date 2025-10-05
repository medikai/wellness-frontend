"use client";

import React, { useState } from 'react';
import { Card, Button } from '@/components/ui';
import { Quiz } from '@/types/quiz';

interface QuizFormProps {
  onSubmit: (quizData: Omit<Quiz, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  initialData?: Partial<Quiz>;
  isEditing?: boolean;
}

const QuizForm: React.FC<QuizFormProps> = ({ 
  onSubmit, 
  onCancel, 
  initialData,
  isEditing = false 
}) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    category: initialData?.category || 'health' as const,
    difficulty: initialData?.difficulty || 'easy' as const,
    timeLimit: initialData?.timeLimit || undefined,
    maxAttempts: initialData?.maxAttempts || undefined,
    status: initialData?.status || 'draft' as const,
    createdBy: initialData?.createdBy || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Quiz title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.createdBy.trim()) {
      newErrors.createdBy = 'Creator name is required';
    }

    if (formData.timeLimit && (formData.timeLimit < 1 || formData.timeLimit > 180)) {
      newErrors.timeLimit = 'Time limit must be between 1 and 180 minutes';
    }

    if (formData.maxAttempts && (formData.maxAttempts < 1 || formData.maxAttempts > 10)) {
      newErrors.maxAttempts = 'Max attempts must be between 1 and 10';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        ...formData,
        questions: initialData?.questions || [],
      });
    }
  };

  const handleInputChange = (field: string, value: string | number | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold text-neutral-dark mb-6">
        {isEditing ? 'Edit Quiz' : 'Create New Quiz'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div>
          <label className="block text-sm font-medium text-neutral-dark mb-2">
            Quiz Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary ${
              errors.title ? 'border-red-500' : 'border-neutral-light'
            }`}
            placeholder="Enter quiz title"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-dark mb-2">
            Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={3}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary ${
              errors.description ? 'border-red-500' : 'border-neutral-light'
            }`}
            placeholder="Describe what this quiz covers"
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-dark mb-2">
            Created By *
          </label>
          <input
            type="text"
            value={formData.createdBy}
            onChange={(e) => handleInputChange('createdBy', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary ${
              errors.createdBy ? 'border-red-500' : 'border-neutral-light'
            }`}
            placeholder="Enter creator name"
          />
          {errors.createdBy && <p className="text-red-500 text-sm mt-1">{errors.createdBy}</p>}
        </div>

        {/* Quiz Settings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary"
            >
              <option value="health">Health</option>
              <option value="fitness">Fitness</option>
              <option value="nutrition">Nutrition</option>
              <option value="wellness">Wellness</option>
              <option value="general">General</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-2">
              Difficulty
            </label>
            <select
              value={formData.difficulty}
              onChange={(e) => handleInputChange('difficulty', e.target.value)}
              className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Optional Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-2">
              Time Limit (minutes) - Optional
            </label>
            <input
              type="number"
              min="1"
              max="180"
              value={formData.timeLimit || ''}
              onChange={(e) => handleInputChange('timeLimit', e.target.value ? parseInt(e.target.value) : undefined)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary ${
                errors.timeLimit ? 'border-red-500' : 'border-neutral-light'
              }`}
              placeholder="No time limit"
            />
            {errors.timeLimit && <p className="text-red-500 text-sm mt-1">{errors.timeLimit}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-2">
              Max Attempts - Optional
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={formData.maxAttempts || ''}
              onChange={(e) => handleInputChange('maxAttempts', e.target.value ? parseInt(e.target.value) : undefined)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary ${
                errors.maxAttempts ? 'border-red-500' : 'border-neutral-light'
              }`}
              placeholder="Unlimited attempts"
            />
            {errors.maxAttempts && <p className="text-red-500 text-sm mt-1">{errors.maxAttempts}</p>}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-neutral-light">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
          >
            {isEditing ? 'Update Quiz' : 'Create Quiz'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default QuizForm;