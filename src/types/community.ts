export interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  activityType: 'walking' | 'breathing' | 'yoga' | 'meditation' | 'class' | 'challenge' | 'general';
  title: string;
  description: string;
  imageUrl?: string;
  metrics?: {
    steps?: number;
    duration?: number; // in minutes
    calories?: number;
    distance?: number; // in km
  };
  createdAt: string;
  likes: number;
  comments: Comment[];
  isLiked: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'steps' | 'meditation' | 'yoga' | 'consistency' | 'social' | 'streak';
  requirement: {
    type: 'count' | 'streak' | 'total';
    value: number;
    period?: 'daily' | 'weekly' | 'monthly' | 'all-time';
  };
  points: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  earnedAt: string;
  progress: number; // 0-100
  isCompleted: boolean;
}

export interface UserStats {
  userId: string;
  totalSteps: number;
  totalMeditationMinutes: number;
  totalYogaMinutes: number;
  currentStreak: number;
  longestStreak: number;
  totalPosts: number;
  totalLikes: number;
  achievements: UserAchievement[];
  weeklyRank: number;
  consistencyScore: number; // 0-100
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'steps' | 'meditation' | 'yoga' | 'general';
  target: number;
  unit: string;
  participants: string[]; // user IDs
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdBy: string;
}

export interface Friend {
  id: string;
  userId: string;
  name: string;
  avatar?: string;
  lastActive: string;
  isOnline: boolean;
  mutualActivities: number;
}