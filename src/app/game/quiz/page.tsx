"use client";

import React, { useState } from 'react';
import { Card, Button, Icon } from '@/components/ui';
import { useQuiz } from '@/contexts/QuizContext';
import { Quiz } from '@/types/quiz';
import QuizForm from '@/components/forms/QuizForm';
import QuestionEditor from '@/components/forms/QuestionEditor';

export default function QuizManagementPage() {
  const { quizzes, createQuiz, updateQuiz, deleteQuiz, addQuestion, deleteQuestion } = useQuiz();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);
  const [showQuestionEditor, setShowQuestionEditor] = useState(false);

  const activeQuiz = quizzes.find(q => q.id === activeQuizId) || null;

  const handleCreateQuiz = (quizData: Omit<Quiz, 'id' | 'createdAt' | 'updatedAt'>) => {
    createQuiz(quizData);
    setShowCreateForm(false);
  };

  const handleUpdateQuiz = (quizData: Omit<Quiz, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingQuiz) {
      updateQuiz(editingQuiz.id, quizData);
      setEditingQuiz(null);
    }
  };

  const handleDeleteQuiz = (id: string) => {
    if (window.confirm('Delete this quiz?')) {
      deleteQuiz(id);
      if (activeQuizId === id) setActiveQuizId(null);
    }
  };

  return (
    <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-start gap-6">
        {/* Left: Editor */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-neutral-dark">Define Quizzes</h1>
              <p className="text-neutral-medium">Add questions to test understanding.</p>
            </div>
            <div className="space-x-2">
              <Button variant="outline">Save as Draft</Button>
              <Button variant="default">Next Step</Button>
            </div>
          </div>

          {activeQuiz ? (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-neutral-dark">{activeQuiz.title}</h2>
                  <p className="text-neutral-medium">{activeQuiz.description}</p>
                </div>
                <div className="space-x-2">
                  <Button variant="outline" onClick={() => setEditingQuiz(activeQuiz)}>Edit Quiz</Button>
                  <Button variant="outline" className="text-red-600" onClick={() => handleDeleteQuiz(activeQuiz.id)}>Delete</Button>
                </div>
              </div>

              <div className="space-y-4">
                {activeQuiz.questions.sort((a, b) => a.order - b.order).map((q) => (
                  <Card key={q.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-neutral-dark">{q.question}</h3>
                        <p className="text-sm text-neutral-medium">{q.answerType.replace('-', ' ')} • {q.points} pts</p>
                      </div>
                      <div className="space-x-2">
                        <Button size="sm" variant="outline" onClick={() => { setShowQuestionEditor(true); }}>
                          <Icon name="edit" size="sm" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600" onClick={() => deleteQuestion(activeQuiz.id, q.id)}>
                          <Icon name="trash" size="sm" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}

                <Button variant="default" onClick={() => setShowQuestionEditor(true)}>+ Add Question</Button>
              </div>
            </Card>
          ) : (
            <Card className="p-12 text-center">
              <Icon name="activity" size="xl" color="#6B7280" className="mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-dark mb-2">No quiz selected</h3>
              <p className="text-neutral-medium mb-6">Create a quiz or select one from the list.</p>
              <Button variant="default" onClick={() => setShowCreateForm(true)}>Create Quiz</Button>
            </Card>
          )}
        </div>

        {/* Right: Quizzes List */}
        <div className="w-full max-w-sm space-y-4">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-neutral-dark">Quizzes</h2>
              <Button size="sm" variant="outline" onClick={() => setShowCreateForm(true)}>
                <Icon name="plus" size="sm" />
              </Button>
            </div>
            <div className="space-y-2">
              {quizzes.map((quiz) => (
                <button
                  key={quiz.id}
                  onClick={() => setActiveQuizId(quiz.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg border ${activeQuizId === quiz.id ? 'border-teal-primary bg-teal-light' : 'border-neutral-light hover:bg-neutral-light'}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-neutral-dark">{quiz.title}</span>
                    <Icon name="chevronRight" size="sm" />
                  </div>
                  <p className="text-sm text-neutral-medium line-clamp-1">{quiz.description}</p>
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Create/Edit Quiz Modal */}
      {(showCreateForm || editingQuiz) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <QuizForm
              onSubmit={editingQuiz ? handleUpdateQuiz : handleCreateQuiz}
              onCancel={() => { setShowCreateForm(false); setEditingQuiz(null); }}
              initialData={editingQuiz || undefined}
              isEditing={!!editingQuiz}
            />
          </div>
        </div>
      )}

      {/* Add/Edit Question Modal */}
      {showQuestionEditor && activeQuiz && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <QuestionEditor
              onSave={(payload) => { addQuestion(activeQuiz.id, payload); setShowQuestionEditor(false); }}
              onCancel={() => setShowQuestionEditor(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

