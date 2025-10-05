export interface Class {
  id: string;
  name: string;
  description: string;
  instructor: string;
  date: string; // YYYY-MM-DD format
  time: string; // HH:MM format
  duration: number; // in minutes
  maxParticipants: number;
  category: 'fitness' | 'wellness' | 'therapy' | 'education' | 'social';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  location: 'online' | 'in-person';
  meetingLink?: string; // for online classes
  address?: string; // for in-person classes
  price: number;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface ClassBooking {
  id: string;
  classId: string;
  userId: string;
  bookedAt: string;
  status: 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
}

export interface ClassParticipant {
  id: string;
  classId: string;
  userId: string;
  joinedAt: string;
  attendanceStatus: 'present' | 'absent' | 'late';
  feedback?: string;
  rating?: number; // 1-5 stars
}