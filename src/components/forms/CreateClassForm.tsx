"use client";

import React, { useState } from 'react';
import { Card, Button } from '@/components/ui';
import { Class } from '@/types/class';

interface CreateClassFormProps {
  onSubmit: (classData: Omit<Class, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  initialData?: Partial<Class>;
  isEditing?: boolean;
}

const CreateClassForm: React.FC<CreateClassFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isEditing = false
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    instructor: initialData?.instructor || '',
    date: initialData?.date || '',
    time: initialData?.time || '',
    duration: initialData?.duration || 60,
    maxParticipants: initialData?.maxParticipants || 20,
    category: initialData?.category || 'fitness' as const,
    difficulty: initialData?.difficulty || 'beginner' as const,
    location: initialData?.location || 'online' as const,
    meetingLink: initialData?.meetingLink || '',
    address: initialData?.address || '',
    price: initialData?.price || 0,
    status: initialData?.status || 'draft' as const,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Class name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.instructor.trim()) {
      newErrors.instructor = 'Instructor name is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.date = 'Date cannot be in the past';
      }
    }

    if (!formData.time) {
      newErrors.time = 'Time is required';
    }

    if (formData.duration < 15 || formData.duration > 180) {
      newErrors.duration = 'Duration must be between 15 and 180 minutes';
    }

    if (formData.maxParticipants < 1 || formData.maxParticipants > 100) {
      newErrors.maxParticipants = 'Max participants must be between 1 and 100';
    }

    if (formData.location === 'online' && !formData.meetingLink.trim()) {
      newErrors.meetingLink = 'Meeting link is required for online classes';
    }

    if (formData.location === 'in-person' && !formData.address.trim()) {
      newErrors.address = 'Address is required for in-person classes';
    }

    if (formData.price < 0) {
      newErrors.price = 'Price cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold text-neutral-dark mb-6">
        {isEditing ? 'Edit Class' : 'Create New Class'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-2">
              Class Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary ${errors.name ? 'border-red-500' : 'border-neutral-light'
                }`}
              placeholder="Enter class name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-2">
              Instructor *
            </label>
            <input
              type="text"
              value={formData.instructor}
              onChange={(e) => handleInputChange('instructor', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary ${errors.instructor ? 'border-red-500' : 'border-neutral-light'
                }`}
              placeholder="Enter instructor name"
            />
            {errors.instructor && <p className="text-red-500 text-sm mt-1">{errors.instructor}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-dark mb-2">
            Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={3}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary ${errors.description ? 'border-red-500' : 'border-neutral-light'
              }`}
            placeholder="Describe the class content and benefits"
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        {/* Schedule */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-2">
              Date *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary ${errors.date ? 'border-red-500' : 'border-neutral-light'
                }`}
            />
            {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-2">
              Time *
            </label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => handleInputChange('time', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary ${errors.time ? 'border-red-500' : 'border-neutral-light'
                }`}
            />
            {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-2">
              Duration (minutes) *
            </label>
            <input
              type="number"
              min="15"
              max="180"
              value={formData.duration}
              onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 0)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary ${errors.duration ? 'border-red-500' : 'border-neutral-light'
                }`}
            />
            {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
          </div>
        </div>

        {/* Class Details */}
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
              <option value="fitness">Fitness</option>
              <option value="waylness">waylness</option>
              <option value="therapy">Therapy</option>
              <option value="education">Education</option>
              <option value="social">Social</option>
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
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-2">
              Max Participants
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={formData.maxParticipants}
              onChange={(e) => handleInputChange('maxParticipants', parseInt(e.target.value) || 0)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary ${errors.maxParticipants ? 'border-red-500' : 'border-neutral-light'
                }`}
            />
            {errors.maxParticipants && <p className="text-red-500 text-sm mt-1">{errors.maxParticipants}</p>}
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-neutral-dark mb-2">
            Location Type
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="online"
                checked={formData.location === 'online'}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="mr-2"
              />
              Online
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="in-person"
                checked={formData.location === 'in-person'}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="mr-2"
              />
              In-Person
            </label>
          </div>
        </div>

        {formData.location === 'online' && (
          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-2">
              Meeting Link *
            </label>
            <input
              type="url"
              value={formData.meetingLink}
              onChange={(e) => handleInputChange('meetingLink', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary ${errors.meetingLink ? 'border-red-500' : 'border-neutral-light'
                }`}
              placeholder="https://zoom.us/j/..."
            />
            {errors.meetingLink && <p className="text-red-500 text-sm mt-1">{errors.meetingLink}</p>}
          </div>
        )}

        {formData.location === 'in-person' && (
          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-2">
              Address *
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary ${errors.address ? 'border-red-500' : 'border-neutral-light'
                }`}
              placeholder="Enter full address"
            />
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
          </div>
        )}

        {/* Price and Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-2">
              Price ($)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary ${errors.price ? 'border-red-500' : 'border-neutral-light'
                }`}
            />
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
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
              <option value="cancelled">Cancelled</option>
            </select>
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
            variant="default"
          >
            {isEditing ? 'Update Class' : 'Create Class'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default CreateClassForm;