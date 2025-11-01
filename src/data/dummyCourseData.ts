import { Course } from '@/types/course';

export const dummyCourse: Course = {
  id: '1',
  title: 'Health & waylness Course',
  description: 'Complete self-paced course on health and waylness',
  instructor: 'Dr. Sarah Johnson',
  category: 'waylness',
  modules: [
    {
      id: 'module-1',
      title: 'Fundamentals of Health',
      description: 'Learn the basics of maintaining good health',
      sections: [
        {
          id: 'section-1',
          title: 'Hydration & Nutrition',
          description: 'Understanding proper hydration and nutrition',
          chapters: [
            {
              id: 'chapter-1',
              title: 'Daily Hydration',
              description: 'Learn about proper hydration practices',
              content: {
                type: 'video',
                title: 'Importance of Hydration',
                embed_link: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
              }
            },
            {
              id: 'chapter-2',
              title: 'Hydration Survey',
              description: 'Tell us about your hydration habits',
              content: {
                type: 'survey',
                title: 'Hydration Habits Survey',
                questions: [
                  {
                    id: 'q1',
                    question: 'How many glasses of water do you drink per day?',
                    input_type: 'radio',
                    options: ['1-2', '3-4', '5-6', '7+']
                  },
                  {
                    id: 'q2',
                    question: 'When do you feel most dehydrated?',
                    input_type: 'checkbox',
                    options: ['Morning', 'Afternoon', 'Evening', 'Night']
                  },
                  {
                    id: 'q3',
                    question: 'Additional comments:',
                    input_type: 'textarea'
                  }
                ]
              }
            },
            {
              id: 'chapter-3',
              title: 'Hydration Activity',
              description: 'Track your daily water intake',
              content: {
                type: 'activities',
                title: 'Daily Hydration Tracking',
                activity_type: 'hydration',
                description: 'Track how many glasses of water you drink today'
              }
            }
          ]
        },
        {
          id: 'section-2',
          title: 'Physical Movement',
          description: 'Staying active and mobile',
          chapters: [
            {
              id: 'chapter-4',
              title: 'Gentle Movement Exercises',
              description: 'Learn gentle exercises for mobility',
              content: {
                type: 'text',
                title: 'Introduction to Gentle Movements',
                content: '<h2>Welcome to Gentle Movement Exercises</h2><p>In this chapter, we will explore various gentle exercises that can help improve your mobility and overall well-being.</p><ul><li>Chair exercises</li><li>Stretching routines</li><li>Balance training</li></ul>'
              }
            },
            {
              id: 'chapter-5',
              title: 'Movement Quiz',
              description: 'Test your knowledge',
              content: {
                type: 'quiz',
                title: 'Physical Movement Quiz',
                questions: [
                  {
                    id: 'q1',
                    question: 'How often should seniors do gentle exercises?',
                    options: [
                      { id: 'A', label: 'Daily', correct: true },
                      { id: 'B', label: 'Once a week', correct: false },
                      { id: 'C', label: 'Never', correct: false },
                      { id: 'D', label: 'Only when in pain', correct: false }
                    ]
                  },
                  {
                    id: 'q2',
                    question: 'Which is a good warm-up before exercises?',
                    options: [
                      { id: 'A', label: 'Jumping jacks', correct: false },
                      { id: 'B', label: 'Gentle stretching', correct: true },
                      { id: 'C', label: 'Heavy lifting', correct: false },
                      { id: 'D', label: 'No warm-up needed', correct: false }
                    ]
                  }
                ]
              }
            }
          ]
        }
      ]
    },
    {
      id: 'module-2',
      title: 'Mental waylness',
      description: 'Mindfulness and mental health practices',
      sections: [
        {
          id: 'section-3',
          title: 'Breathing Techniques',
          description: 'Learn breathing exercises for relaxation',
          chapters: [
            {
              id: 'chapter-6',
              title: 'Mindful Breathing',
              description: 'Practice breathing exercises',
              content: {
                type: 'video',
                title: 'Breathing Exercises for Relaxation',
                embed_link: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
              }
            },
            {
              id: 'chapter-7',
              title: 'Breathing Practice',
              description: 'Practice what you learned',
              content: {
                type: 'activities',
                title: 'Guided Breathing Session',
                activity_type: 'single_choice',
                description: 'How did the breathing exercise make you feel?',
                options: ['Very Relaxed', 'Relaxed', 'Neutral', 'Not Relaxed']
              }
            }
          ]
        }
      ]
    },
    {
      id: 'module-3',
      title: 'Cognitive Health',
      description: 'Games and activities for brain health',
      sections: [
        {
          id: 'section-4',
          title: 'Brain Training Games',
          description: 'Fun games to keep your mind sharp',
          chapters: [
            {
              id: 'chapter-8',
              title: 'Memory Game',
              description: 'Test your memory skills',
              content: {
                type: 'games',
                title: 'Memory Match Game',
                game_id: 'memory-match',
                description: 'Match pairs of cards to test your memory'
              }
            },
            {
              id: 'chapter-9',
              title: 'Focus Game',
              description: 'Improve your concentration',
              content: {
                type: 'games',
                title: 'Concentration Challenge',
                game_id: 'focus-game',
                description: 'Practice focusing and concentration skills'
              }
            }
          ]
        }
      ]
    }
  ]
};
