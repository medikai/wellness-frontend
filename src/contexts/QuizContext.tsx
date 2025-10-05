"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Quiz, QuizQuestion, QuizAttempt, QuizResult } from "@/types/quiz";

type QuizContextValue = {
  quizzes: Quiz[];
  attempts: QuizAttempt[];
  results: QuizResult[];
  createQuiz: (quizData: Omit<Quiz, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateQuiz: (id: string, updates: Partial<Quiz>) => void;
  deleteQuiz: (id: string) => void;
  addQuestion: (quizId: string, question: Omit<QuizQuestion, 'id' | 'order'>) => void;
  updateQuestion: (quizId: string, questionId: string, updates: Partial<QuizQuestion>) => void;
  deleteQuestion: (quizId: string, questionId: string) => void;
  reorderQuestions: (quizId: string, questionIds: string[]) => void;
  startQuizAttempt: (quizId: string, userId: string) => string; // returns attemptId
  submitQuizAnswer: (attemptId: string, questionId: string, answer: string | number | boolean) => void;
  completeQuizAttempt: (attemptId: string) => QuizResult;
  getQuizById: (id: string) => Quiz | undefined;
  getAttemptById: (id: string) => QuizAttempt | undefined;
  getResultsByUserId: (userId: string) => QuizResult[];
  getResultsByQuizId: (quizId: string) => QuizResult[];
};

const QUIZZES_STORAGE_KEY = "wellness_quizzes";
const ATTEMPTS_STORAGE_KEY = "wellness_quiz_attempts";
const RESULTS_STORAGE_KEY = "wellness_quiz_results";

const QuizContext = createContext<QuizContextValue | undefined>(undefined);

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [results, setResults] = useState<QuizResult[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const storedQuizzes = typeof window !== "undefined" ? window.localStorage.getItem(QUIZZES_STORAGE_KEY) : null;
      const storedAttempts = typeof window !== "undefined" ? window.localStorage.getItem(ATTEMPTS_STORAGE_KEY) : null;
      const storedResults = typeof window !== "undefined" ? window.localStorage.getItem(RESULTS_STORAGE_KEY) : null;
      
      if (storedQuizzes) {
        setQuizzes(JSON.parse(storedQuizzes));
      }
      
      if (storedAttempts) {
        setAttempts(JSON.parse(storedAttempts));
      }
      
      if (storedResults) {
        setResults(JSON.parse(storedResults));
      }
    } catch (error) {
      console.error("Error loading quiz data from localStorage:", error);
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(QUIZZES_STORAGE_KEY, JSON.stringify(quizzes));
      }
    } catch (error) {
      console.error("Error saving quizzes to localStorage:", error);
    }
  }, [quizzes]);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(ATTEMPTS_STORAGE_KEY, JSON.stringify(attempts));
      }
    } catch (error) {
      console.error("Error saving attempts to localStorage:", error);
    }
  }, [attempts]);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(RESULTS_STORAGE_KEY, JSON.stringify(results));
      }
    } catch (error) {
      console.error("Error saving results to localStorage:", error);
    }
  }, [results]);

  const createQuiz = useCallback((quizData: Omit<Quiz, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newQuiz: Quiz = {
      ...quizData,
      id: `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: now,
      updatedAt: now,
    };
    
    setQuizzes(prev => [...prev, newQuiz]);
  }, []);

  const updateQuiz = useCallback((id: string, updates: Partial<Quiz>) => {
    setQuizzes(prev => prev.map(quiz => 
      quiz.id === id 
        ? { ...quiz, ...updates, updatedAt: new Date().toISOString() }
        : quiz
    ));
  }, []);

  const deleteQuiz = useCallback((id: string) => {
    setQuizzes(prev => prev.filter(quiz => quiz.id !== id));
    // Also remove related attempts and results
    setAttempts(prev => prev.filter(attempt => attempt.quizId !== id));
    setResults(prev => prev.filter(result => result.quizId !== id));
  }, []);

  const addQuestion = useCallback((quizId: string, questionData: Omit<QuizQuestion, 'id' | 'order'>) => {
    const quiz = quizzes.find(q => q.id === quizId);
    if (!quiz) return;

    const newQuestion: QuizQuestion = {
      ...questionData,
      id: `question_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      order: quiz.questions.length,
    };

    setQuizzes(prev => prev.map(q => 
      q.id === quizId 
        ? { ...q, questions: [...q.questions, newQuestion], updatedAt: new Date().toISOString() }
        : q
    ));
  }, [quizzes]);

  const updateQuestion = useCallback((quizId: string, questionId: string, updates: Partial<QuizQuestion>) => {
    setQuizzes(prev => prev.map(quiz => 
      quiz.id === quizId 
        ? {
            ...quiz,
            questions: quiz.questions.map(q => 
              q.id === questionId ? { ...q, ...updates } : q
            ),
            updatedAt: new Date().toISOString()
          }
        : quiz
    ));
  }, []);

  const deleteQuestion = useCallback((quizId: string, questionId: string) => {
    setQuizzes(prev => prev.map(quiz => 
      quiz.id === quizId 
        ? {
            ...quiz,
            questions: quiz.questions.filter(q => q.id !== questionId),
            updatedAt: new Date().toISOString()
          }
        : quiz
    ));
  }, []);

  const reorderQuestions = useCallback((quizId: string, questionIds: string[]) => {
    setQuizzes(prev => prev.map(quiz => 
      quiz.id === quizId 
        ? {
            ...quiz,
            questions: questionIds.map((id, index) => {
              const question = quiz.questions.find(q => q.id === id);
              return question ? { ...question, order: index } : question;
            }).filter(Boolean) as QuizQuestion[],
            updatedAt: new Date().toISOString()
          }
        : quiz
    ));
  }, []);

  const startQuizAttempt = useCallback((quizId: string, userId: string): string => {
    const now = new Date().toISOString();
    const attemptId = `attempt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newAttempt: QuizAttempt = {
      id: attemptId,
      quizId,
      userId,
      startedAt: now,
      answers: {},
      status: 'in-progress',
    };
    
    setAttempts(prev => [...prev, newAttempt]);
    return attemptId;
  }, []);

  const submitQuizAnswer = useCallback((attemptId: string, questionId: string, answer: string | number | boolean) => {
    setAttempts(prev => prev.map(attempt => 
      attempt.id === attemptId 
        ? { ...attempt, answers: { ...attempt.answers, [questionId]: answer } }
        : attempt
    ));
  }, []);

  const completeQuizAttempt = useCallback((attemptId: string): QuizResult => {
    const attempt = attempts.find(a => a.id === attemptId);
    if (!attempt) throw new Error("Attempt not found");

    const quiz = quizzes.find(q => q.id === attempt.quizId);
    if (!quiz) throw new Error("Quiz not found");

    const now = new Date().toISOString();
    const startedAt = new Date(attempt.startedAt);
    const timeSpent = Math.floor((new Date().getTime() - startedAt.getTime()) / 1000);

    // Calculate score
    let correctAnswers = 0;
    let totalPoints = 0;

    quiz.questions.forEach(question => {
      totalPoints += question.points;
      const userAnswer = attempt.answers[question.id];
      
      if (question.answerType === 'multiple-choice') {
        const correctIndex = question.correctAnswer as number;
        const userIndex = question.options?.indexOf(userAnswer as string);
        if (userIndex === correctIndex) {
          correctAnswers++;
        }
      } else {
        if (userAnswer === question.correctAnswer) {
          correctAnswers++;
        }
      }
    });

    const score = quiz.questions.reduce((total, question) => {
      const userAnswer = attempt.answers[question.id];
      let isCorrect = false;
      
      if (question.answerType === 'multiple-choice') {
        const correctIndex = question.correctAnswer as number;
        const userIndex = question.options?.indexOf(userAnswer as string);
        isCorrect = userIndex === correctIndex;
      } else {
        isCorrect = userAnswer === question.correctAnswer;
      }
      
      return total + (isCorrect ? question.points : 0);
    }, 0);

    const percentage = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;

    const result: QuizResult = {
      id: `result_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      attemptId,
      quizId: attempt.quizId,
      userId: attempt.userId,
      score,
      totalPoints,
      percentage,
      correctAnswers,
      totalQuestions: quiz.questions.length,
      timeSpent,
      completedAt: now,
    };

    // Update attempt status
    setAttempts(prev => prev.map(a => 
      a.id === attemptId 
        ? { ...a, completedAt: now, status: 'completed' as const }
        : a
    ));

    // Add result
    setResults(prev => [...prev, result]);

    return result;
  }, [attempts, quizzes]);

  const getQuizById = useCallback((id: string) => {
    return quizzes.find(quiz => quiz.id === id);
  }, [quizzes]);

  const getAttemptById = useCallback((id: string) => {
    return attempts.find(attempt => attempt.id === id);
  }, [attempts]);

  const getResultsByUserId = useCallback((userId: string) => {
    return results.filter(result => result.userId === userId);
  }, [results]);

  const getResultsByQuizId = useCallback((quizId: string) => {
    return results.filter(result => result.quizId === quizId);
  }, [results]);

  const value = useMemo<QuizContextValue>(() => ({
    quizzes,
    attempts,
    results,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    reorderQuestions,
    startQuizAttempt,
    submitQuizAnswer,
    completeQuizAttempt,
    getQuizById,
    getAttemptById,
    getResultsByUserId,
    getResultsByQuizId,
  }), [
    quizzes,
    attempts,
    results,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    reorderQuestions,
    startQuizAttempt,
    submitQuizAnswer,
    completeQuizAttempt,
    getQuizById,
    getAttemptById,
    getResultsByUserId,
    getResultsByQuizId,
  ]);

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = (): QuizContextValue => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error("useQuiz must be used within a QuizProvider");
  }
  return context;
};