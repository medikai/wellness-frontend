'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { CommunityPost, Achievement, UserAchievement, UserStats, Challenge, Friend, Comment } from '@/types/community';
import { useAuth } from './AuthContext';

interface CommunityState {
  posts: CommunityPost[];
  achievements: Achievement[];
  userAchievements: UserAchievement[];
  userStats: UserStats | null;
  challenges: Challenge[];
  friends: Friend[];
  loading: boolean;
  error: string | null;
}

type CommunityAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_POSTS'; payload: CommunityPost[] }
  | { type: 'ADD_POST'; payload: CommunityPost }
  | { type: 'UPDATE_POST'; payload: CommunityPost }
  | { type: 'DELETE_POST'; payload: string }
  | { type: 'LIKE_POST'; payload: { postId: string; isLiked: boolean } }
  | { type: 'ADD_COMMENT'; payload: { postId: string; comment: Comment } }
  | { type: 'SET_ACHIEVEMENTS'; payload: Achievement[] }
  | { type: 'SET_USER_ACHIEVEMENTS'; payload: UserAchievement[] }
  | { type: 'ADD_USER_ACHIEVEMENT'; payload: UserAchievement }
  | { type: 'SET_USER_STATS'; payload: UserStats }
  | { type: 'UPDATE_USER_STATS'; payload: Partial<UserStats> }
  | { type: 'SET_CHALLENGES'; payload: Challenge[] }
  | { type: 'JOIN_CHALLENGE'; payload: { challengeId: string; userId: string } }
  | { type: 'SET_FRIENDS'; payload: Friend[] }
  | { type: 'ADD_FRIEND'; payload: Friend };

const initialState: CommunityState = {
  posts: [],
  achievements: [],
  userAchievements: [],
  userStats: null,
  challenges: [],
  friends: [],
  loading: false,
  error: null,
};

const communityReducer = (state: CommunityState, action: CommunityAction): CommunityState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_POSTS':
      return { ...state, posts: action.payload };
    case 'ADD_POST':
      return { ...state, posts: [action.payload, ...state.posts] };
    case 'UPDATE_POST':
      return {
        ...state,
        posts: state.posts.map(post =>
          post.id === action.payload.id ? action.payload : post
        ),
      };
    case 'DELETE_POST':
      return {
        ...state,
        posts: state.posts.filter(post => post.id !== action.payload),
      };
    case 'LIKE_POST':
      return {
        ...state,
        posts: state.posts.map(post =>
          post.id === action.payload.postId
            ? {
                ...post,
                isLiked: action.payload.isLiked,
                likes: action.payload.isLiked ? post.likes + 1 : post.likes - 1,
              }
            : post
        ),
      };
    case 'ADD_COMMENT':
      return {
        ...state,
        posts: state.posts.map(post =>
          post.id === action.payload.postId
            ? { ...post, comments: [...post.comments, action.payload.comment] }
            : post
        ),
      };
    case 'SET_ACHIEVEMENTS':
      return { ...state, achievements: action.payload };
    case 'SET_USER_ACHIEVEMENTS':
      return { ...state, userAchievements: action.payload };
    case 'ADD_USER_ACHIEVEMENT':
      return { ...state, userAchievements: [...state.userAchievements, action.payload] };
    case 'SET_USER_STATS':
      return { ...state, userStats: action.payload };
    case 'UPDATE_USER_STATS':
      return {
        ...state,
        userStats: state.userStats ? { ...state.userStats, ...action.payload } : null,
      };
    case 'SET_CHALLENGES':
      return { ...state, challenges: action.payload };
    case 'JOIN_CHALLENGE':
      return {
        ...state,
        challenges: state.challenges.map(challenge =>
          challenge.id === action.payload.challengeId
            ? { ...challenge, participants: [...challenge.participants, action.payload.userId] }
            : challenge
        ),
      };
    case 'SET_FRIENDS':
      return { ...state, friends: action.payload };
    case 'ADD_FRIEND':
      return { ...state, friends: [...state.friends, action.payload] };
    default:
      return state;
  }
};

interface CommunityContextType {
  state: CommunityState;
  createPost: (post: Omit<CommunityPost, 'id' | 'createdAt' | 'likes' | 'comments' | 'isLiked'>) => void;
  likePost: (postId: string) => void;
  addComment: (postId: string, content: string) => void;
  deletePost: (postId: string) => void;
  joinChallenge: (challengeId: string) => void;
  addFriend: (friend: Omit<Friend, 'id'>) => void;
  checkAchievements: (userId: string) => void;
  loadData: () => void;
  canCreateContent: boolean;
  canParticipate: boolean;
}

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

export const useCommunity = () => {
  const context = useContext(CommunityContext);
  if (!context) {
    throw new Error('useCommunity must be used within a CommunityProvider');
  }
  return context;
};

// Achievement definitions
const defaultAchievements: Achievement[] = [
  {
    id: 'first-steps',
    name: 'First Steps',
    description: 'Take your first 1000 steps',
    icon: '👟',
    category: 'steps',
    requirement: { type: 'count', value: 1000, period: 'daily' },
    points: 10,
    rarity: 'common',
  },
  {
    id: 'step-master',
    name: 'Step Master',
    description: 'Walk 10,000 steps in a day',
    icon: '🏃‍♂️',
    category: 'steps',
    requirement: { type: 'count', value: 10000, period: 'daily' },
    points: 50,
    rarity: 'uncommon',
  },
  {
    id: 'meditation-beginner',
    name: 'Mindful Beginner',
    description: 'Complete 5 minutes of meditation',
    icon: '🧘‍♀️',
    category: 'meditation',
    requirement: { type: 'count', value: 5, period: 'daily' },
    points: 15,
    rarity: 'common',
  },
  {
    id: 'yoga-warrior',
    name: 'Yoga Warrior',
    description: 'Complete a yoga session',
    icon: '🧘‍♂️',
    category: 'yoga',
    requirement: { type: 'count', value: 1, period: 'daily' },
    points: 20,
    rarity: 'common',
  },
  {
    id: 'consistency-champion',
    name: 'Consistency Champion',
    description: 'Stay active for 7 days straight',
    icon: '🔥',
    category: 'streak',
    requirement: { type: 'streak', value: 7, period: 'daily' },
    points: 100,
    rarity: 'rare',
  },
  {
    id: 'social-butterfly',
    name: 'Social Butterfly',
    description: 'Make 10 community posts',
    icon: '🦋',
    category: 'social',
    requirement: { type: 'count', value: 10, period: 'all-time' },
    points: 75,
    rarity: 'uncommon',
  },
];

// Helper function to get avatar based on user role
const getAvatarForRole = (role: string) => {
  const avatars = {
    elderly: '👴',
    caregiver: '👩‍⚕️',
    coach: '👨‍🏫',
    admin: '👨‍💼',
  };
  return avatars[role as keyof typeof avatars] || '👤';
};

export const CommunityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(communityReducer, initialState);
  const { user } = useAuth();

  // Load data from localStorage on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Load posts
      const savedPosts = localStorage.getItem('community_posts');
      if (savedPosts) {
        dispatch({ type: 'SET_POSTS', payload: JSON.parse(savedPosts) });
      } else {
        // Initialize with sample posts for demo
        const samplePosts: CommunityPost[] = [
          {
            id: 'post-1',
            userId: 'alice@example.com',
            userName: 'Alice',
            userAvatar: '👩‍🦳',
            activityType: 'yoga',
            title: 'Completed my Chair Yoga class!',
            description: 'Feeling so much more flexible and relaxed after today\'s session. The breathing exercises really helped me focus.',
            metrics: { duration: 30, calories: 50 },
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            likes: 3,
            comments: [],
            isLiked: false,
          },
          {
            id: 'post-2',
            userId: 'robert@example.com',
            userName: 'Robert',
            userAvatar: '👨‍🦲',
            activityType: 'walking',
            title: 'Morning walk in the garden',
            description: 'Took a peaceful 15-minute walk around the garden. The fresh air and gentle movement felt wonderful.',
            metrics: { steps: 1200, duration: 15, distance: 0.8 },
            createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            likes: 2,
            comments: [],
            isLiked: false,
          },
          {
            id: 'post-3',
            userId: 'joan@example.com',
            userName: 'Joan',
            userAvatar: '👩‍🦰',
            activityType: 'meditation',
            title: '5 minutes of mindfulness',
            description: 'Started my day with meditation. It\'s amazing how just 5 minutes can set such a positive tone.',
            metrics: { duration: 5 },
            createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
            likes: 4,
            comments: [],
            isLiked: false,
          },
        ];
        dispatch({ type: 'SET_POSTS', payload: samplePosts });
        localStorage.setItem('community_posts', JSON.stringify(samplePosts));
      }

      // Load achievements
      dispatch({ type: 'SET_ACHIEVEMENTS', payload: defaultAchievements });

      // Load user achievements
      const savedUserAchievements = localStorage.getItem('user_achievements');
      if (savedUserAchievements) {
        dispatch({ type: 'SET_USER_ACHIEVEMENTS', payload: JSON.parse(savedUserAchievements) });
      }

      // Load user stats
      const savedUserStats = localStorage.getItem('user_stats');
      if (savedUserStats) {
        dispatch({ type: 'SET_USER_STATS', payload: JSON.parse(savedUserStats) });
      }

      // Load challenges
      const savedChallenges = localStorage.getItem('community_challenges');
      if (savedChallenges) {
        dispatch({ type: 'SET_CHALLENGES', payload: JSON.parse(savedChallenges) });
      } else {
        // Initialize with default challenges
        const defaultChallenges: Challenge[] = [
          {
            id: 'walk-2000-steps',
            title: 'Walk 2,000 Steps Together',
            description: 'Join friends in walking 2,000 steps today',
            icon: '🚶‍♀️',
            type: 'steps',
            target: 2000,
            unit: 'steps',
            participants: [],
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            isActive: true,
            createdBy: 'system',
          },
          {
            id: 'meditation-streak',
            title: '5-Day Meditation Streak',
            description: 'Meditate for 5 consecutive days',
            icon: '🧘‍♀️',
            type: 'meditation',
            target: 5,
            unit: 'days',
            participants: [],
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            isActive: true,
            createdBy: 'system',
          },
        ];
        dispatch({ type: 'SET_CHALLENGES', payload: defaultChallenges });
        localStorage.setItem('community_challenges', JSON.stringify(defaultChallenges));
      }

      // Load friends
      const savedFriends = localStorage.getItem('community_friends');
      if (savedFriends) {
        dispatch({ type: 'SET_FRIENDS', payload: JSON.parse(savedFriends) });
      } else {
        // Initialize with default friends
        const defaultFriends: Friend[] = [
          {
            id: 'alice-1',
            userId: 'alice-1',
            name: 'Alice',
            avatar: '👩‍🦳',
            lastActive: new Date().toISOString(),
            isOnline: true,
            mutualActivities: 3,
          },
          {
            id: 'robert-1',
            userId: 'robert-1',
            name: 'Robert',
            avatar: '👨‍🦲',
            lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            isOnline: false,
            mutualActivities: 1,
          },
          {
            id: 'joan-1',
            userId: 'joan-1',
            name: 'Joan',
            avatar: '👩‍🦰',
            lastActive: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            isOnline: true,
            mutualActivities: 2,
          },
        ];
        dispatch({ type: 'SET_FRIENDS', payload: defaultFriends });
        localStorage.setItem('community_friends', JSON.stringify(defaultFriends));
      }

      dispatch({ type: 'SET_LOADING', payload: false });
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load community data' });
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const createPost = (postData: Omit<CommunityPost, 'id' | 'createdAt' | 'likes' | 'comments' | 'isLiked'>) => {
    if (!user || !canParticipate) {
      alert('You do not have permission to create posts');
      return;
    }

    const newPost: CommunityPost = {
      ...postData,
      userId: user.email || 'current-user',
      userName: user.name,
      userAvatar: getAvatarForRole(user.role),
      id: `post-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: [],
      isLiked: false,
    };

    dispatch({ type: 'ADD_POST', payload: newPost });
    
    // Save to localStorage
    const currentPosts = state.posts;
    const updatedPosts = [newPost, ...currentPosts];
    localStorage.setItem('community_posts', JSON.stringify(updatedPosts));

    // Check for achievements
    checkAchievements(user.email || 'current-user');
  };

  const likePost = (postId: string) => {
    const post = state.posts.find(p => p.id === postId);
    if (post) {
      dispatch({ type: 'LIKE_POST', payload: { postId, isLiked: !post.isLiked } });
      
      // Update localStorage
      const updatedPosts = state.posts.map(p =>
        p.id === postId
          ? {
              ...p,
              isLiked: !p.isLiked,
              likes: !p.isLiked ? p.likes + 1 : p.likes - 1,
            }
          : p
      );
      localStorage.setItem('community_posts', JSON.stringify(updatedPosts));
    }
  };

  const addComment = (postId: string, content: string) => {
    if (!user || !canParticipate) {
      alert('You do not have permission to comment');
      return;
    }

    const newComment: Comment = {
      id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      postId,
      userId: user.email || 'current-user',
      userName: user.name,
      userAvatar: getAvatarForRole(user.role),
      content,
      createdAt: new Date().toISOString(),
    };

    dispatch({ type: 'ADD_COMMENT', payload: { postId, comment: newComment } });
    
    // Update localStorage
    const updatedPosts = state.posts.map(post =>
      post.id === postId
        ? { ...post, comments: [...post.comments, newComment] }
        : post
    );
    localStorage.setItem('community_posts', JSON.stringify(updatedPosts));
  };

  const deletePost = (postId: string) => {
    dispatch({ type: 'DELETE_POST', payload: postId });
    
    // Update localStorage
    const updatedPosts = state.posts.filter(post => post.id !== postId);
    localStorage.setItem('community_posts', JSON.stringify(updatedPosts));
  };

  const joinChallenge = (challengeId: string) => {
    if (!user || !canParticipate) {
      alert('You do not have permission to join challenges');
      return;
    }

    const userId = user.email || 'current-user';
    dispatch({ type: 'JOIN_CHALLENGE', payload: { challengeId, userId } });
    
    // Update localStorage
    const updatedChallenges = state.challenges.map(challenge =>
      challenge.id === challengeId
        ? { ...challenge, participants: [...challenge.participants, userId] }
        : challenge
    );
    localStorage.setItem('community_challenges', JSON.stringify(updatedChallenges));
  };

  const addFriend = (friendData: Omit<Friend, 'id'>) => {
    const newFriend: Friend = {
      ...friendData,
      id: `friend-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    dispatch({ type: 'ADD_FRIEND', payload: newFriend });
    
    // Update localStorage
    const updatedFriends = [...state.friends, newFriend];
    localStorage.setItem('community_friends', JSON.stringify(updatedFriends));
  };

  const checkAchievements = (userId: string) => {
    // This is a simplified version - in a real app, this would be more sophisticated
    const userPosts = state.posts.filter(post => post.userId === userId);
    const userStats = state.userStats;
    
    if (!userStats) return;

    // Check for social butterfly achievement
    if (userPosts.length >= 10) {
      const socialAchievement = state.achievements.find(a => a.id === 'social-butterfly');
      if (socialAchievement && !state.userAchievements.find(ua => ua.achievementId === 'social-butterfly')) {
        const newUserAchievement: UserAchievement = {
          id: `ua-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          userId,
          achievementId: 'social-butterfly',
          earnedAt: new Date().toISOString(),
          progress: 100,
          isCompleted: true,
        };
        dispatch({ type: 'ADD_USER_ACHIEVEMENT', payload: newUserAchievement });
        
        // Save to localStorage
        const updatedUserAchievements = [...state.userAchievements, newUserAchievement];
        localStorage.setItem('user_achievements', JSON.stringify(updatedUserAchievements));
      }
    }
  };

  // Role-based permissions
  const canCreateContent = user?.role === 'coach' || user?.role === 'admin';
  const canParticipate = user?.role === 'elderly' || user?.role === 'caregiver' || user?.role === 'coach' || user?.role === 'admin';

  const value: CommunityContextType = {
    state,
    createPost,
    likePost,
    addComment,
    deletePost,
    joinChallenge,
    addFriend,
    checkAchievements,
    loadData,
    canCreateContent,
    canParticipate,
  };

  return (
    <CommunityContext.Provider value={value}>
      {children}
    </CommunityContext.Provider>
  );
};