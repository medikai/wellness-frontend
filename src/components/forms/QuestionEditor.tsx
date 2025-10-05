//src/components/forms/QuestionEditor.tsx
"use client";

import React, { useMemo, useState } from 'react';
import { Card, Button } from '@/components/ui';
import { QuizQuestion } from '@/types/quiz';

type AnswerType = 'multiple-choice' | 'true-false' | 'text' | 'number';


interface QuestionEditorProps {
  question?: Partial<QuizQuestion>;
  onSave: (question: Omit<QuizQuestion, 'id' | 'order'>) => void;
  onCancel: () => void;
}

const QuestionEditor: React.FC<QuestionEditorProps> = ({ question, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    question: question?.question || '',
    answerType: (question?.answerType || 'multiple-choice') as AnswerType,
    options: question?.options && question.options.length ? question.options : ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
    correctAnswer: (question?.correctAnswer ?? 0) as string | number | boolean,
    explanation: question?.explanation || '',
    points: question?.points ?? 1,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const canUseOptions = useMemo(() => formData.answerType === 'multiple-choice', [formData.answerType]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.question.trim()) newErrors.question = 'Question text is required';
    if (formData.points < 1 || formData.points > 10) newErrors.points = 'Points must be 1-10';
    if (canUseOptions) {
      const nonEmpty = formData.options.filter(o => o.trim().length > 0);
      if (nonEmpty.length < 2) newErrors.options = 'Provide at least 2 options';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    const payload: Omit<QuizQuestion, 'id' | 'order'> = {
      question: formData.question.trim(),
      answerType: formData.answerType,
      options: canUseOptions ? formData.options : undefined,
      correctAnswer: formData.correctAnswer,
      explanation: formData.explanation?.trim() || undefined,
      points: formData.points,
    };
    onSave(payload);
  };

  const setOption = (idx: number, value: string) => {
    setFormData(prev => ({ ...prev, options: prev.options.map((o, i) => (i === idx ? value : o)) }));
  };

  const addOption = () => {
    setFormData(prev => ({ ...prev, options: [...prev.options, `Option ${prev.options.length + 1}`] }));
  };

  const removeOption = (idx: number) => {
    setFormData(prev => ({ ...prev, options: prev.options.filter((_, i) => i !== idx) }));
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-neutral-dark mb-4">{question ? 'Edit Question' : 'Add Question'}</h3>
      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-neutral-dark mb-2">Question *</label>
          <input
            type="text"
            value={formData.question}
            onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary ${errors.question ? 'border-red-500' : 'border-neutral-light'}`}
            placeholder="Enter your question"
          />
          {errors.question && <p className="text-red-500 text-sm mt-1">{errors.question}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-2">Answer Type</label>
            <select
              value={formData.answerType}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, answerType: e.target.value as AnswerType }))
              }
              className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary"
            >

              <option value="multiple-choice">Multiple Choice</option>
              <option value="true-false">True / False</option>
              <option value="text">Text</option>
              <option value="number">Number</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-2">Points</label>
            <input
              type="number"
              min={1}
              max={10}
              value={formData.points}
              onChange={(e) => setFormData(prev => ({ ...prev, points: parseInt(e.target.value) || 0 }))}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary ${errors.points ? 'border-red-500' : 'border-neutral-light'}`}
            />
            {errors.points && <p className="text-red-500 text-sm mt-1">{errors.points}</p>}
          </div>
        </div>

        {canUseOptions && (
          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-2">Options *</label>
            <div className="space-y-2">
              {formData.options.map((opt, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="correct"
                    checked={typeof formData.correctAnswer === 'number' ? formData.correctAnswer === idx : false}
                    onChange={() => setFormData(prev => ({ ...prev, correctAnswer: idx }))}
                  />
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => setOption(idx, e.target.value)}
                    className="flex-1 px-3 py-2 border border-neutral-light rounded-lg"
                  />
                  <button type="button" onClick={() => removeOption(idx)} className="text-neutral-medium hover:text-red-600">×</button>
                </div>
              ))}
              {errors.options && <p className="text-red-500 text-sm">{errors.options}</p>}
              <Button type="button" variant="outline" onClick={addOption}>Add Option</Button>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-neutral-dark mb-2">Explanation (optional)</label>
          <textarea
            value={formData.explanation}
            onChange={(e) => setFormData(prev => ({ ...prev, explanation: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 border border-neutral-light rounded-lg"
            placeholder="Enter explanation to display after question is answered"
          />
        </div>

        {!canUseOptions && (
          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-2">Correct Answer</label>
            {formData.answerType === 'true-false' ? (
              <select
                value={String(formData.correctAnswer)}
                onChange={(e) => setFormData(prev => ({ ...prev, correctAnswer: e.target.value === 'true' }))}
                className="w-full px-3 py-2 border border-neutral-light rounded-lg"
              >
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            ) : (
              <input
                type={formData.answerType === 'number' ? 'number' : 'text'}
                value={String(formData.correctAnswer ?? '')}
                onChange={(e) => setFormData(prev => ({ ...prev, correctAnswer: formData.answerType === 'number' ? Number(e.target.value) : e.target.value }))}
                className="w-full px-3 py-2 border border-neutral-light rounded-lg"
              />
            )}
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-light">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit" variant="primary">Save Question</Button>
        </div>
      </form>
    </Card>
  );
};

export default QuestionEditor;

