// src/store/slices/classSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface Class {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorId: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  category: 'fitness' | 'yoga' | 'meditation' | 'nutrition' | 'wellness';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  maxParticipants: number;
  currentParticipants: number;
  isLive: boolean;
  isCompleted: boolean;
  thumbnail?: string;
  tags: string[];
}

interface ClassState {
  classes: Class[];
  upcomingClasses: Class[];
  completedClasses: Class[];
  liveClasses: Class[];
  isLoading: boolean;
  error: string | null;
  selectedClass: Class | null;
}

const initialState: ClassState = {
  classes: [],
  upcomingClasses: [],
  completedClasses: [],
  liveClasses: [],
  isLoading: false,
  error: null,
  selectedClass: null,
};

// Async thunks
export const fetchClasses = createAsyncThunk(
  'classes/fetchClasses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/classes');
      const data = await response.json();
      
      if (!data.ok) {
        return rejectWithValue(data.error || 'Failed to fetch classes');
      }
      
      return data.classes;
    } catch {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const fetchUpcomingClasses = createAsyncThunk(
  'classes/fetchUpcomingClasses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/classes/upcoming');
      const data = await response.json();
      
      if (!data.ok) {
        return rejectWithValue(data.error || 'Failed to fetch upcoming classes');
      }
      
      return data.classes;
    } catch {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const fetchLiveClasses = createAsyncThunk(
  'classes/fetchLiveClasses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/classes/live');
      const data = await response.json();
      
      if (!data.ok) {
        return rejectWithValue(data.error || 'Failed to fetch live classes');
      }
      
      return data.classes;
    } catch {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const joinClass = createAsyncThunk(
  'classes/joinClass',
  async (classId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/classes/${classId}/join`, {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (!data.ok) {
        return rejectWithValue(data.error || 'Failed to join class');
      }
      
      return { classId, success: true };
    } catch {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const leaveClass = createAsyncThunk(
  'classes/leaveClass',
  async (classId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/classes/${classId}/leave`, {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (!data.ok) {
        return rejectWithValue(data.error || 'Failed to leave class');
      }
      
      return { classId, success: true };
    } catch {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const createClass = createAsyncThunk(
  'classes/createClass',
  async (classData: Omit<Class, 'id' | 'currentParticipants' | 'isLive' | 'isCompleted'>, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(classData),
      });
      
      const data = await response.json();
      
      if (!data.ok) {
        return rejectWithValue(data.error || 'Failed to create class');
      }
      
      return data.class;
    } catch {
      return rejectWithValue('Network error occurred');
    }
  }
);

const classSlice = createSlice({
  name: 'classes',
  initialState,
  reducers: {
    clearClassError: (state) => {
      state.error = null;
    },
    setSelectedClass: (state, action: PayloadAction<Class | null>) => {
      state.selectedClass = action.payload;
    },
    updateClassStatus: (state, action: PayloadAction<{ classId: string; isLive: boolean; isCompleted: boolean }>) => {
      const { classId, isLive, isCompleted } = action.payload;
      const classIndex = state.classes.findIndex(cls => cls.id === classId);
      
      if (classIndex !== -1) {
        state.classes[classIndex].isLive = isLive;
        state.classes[classIndex].isCompleted = isCompleted;
      }
    },
    updateParticipantCount: (state, action: PayloadAction<{ classId: string; currentParticipants: number }>) => {
      const { classId, currentParticipants } = action.payload;
      const classIndex = state.classes.findIndex(cls => cls.id === classId);
      
      if (classIndex !== -1) {
        state.classes[classIndex].currentParticipants = currentParticipants;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch classes cases
      .addCase(fetchClasses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.classes = action.payload;
        state.error = null;
      })
      .addCase(fetchClasses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch upcoming classes cases
      .addCase(fetchUpcomingClasses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUpcomingClasses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.upcomingClasses = action.payload;
        state.error = null;
      })
      .addCase(fetchUpcomingClasses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch live classes cases
      .addCase(fetchLiveClasses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLiveClasses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.liveClasses = action.payload;
        state.error = null;
      })
      .addCase(fetchLiveClasses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Join class cases
      .addCase(joinClass.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(joinClass.fulfilled, (state, action) => {
        state.isLoading = false;
        const { classId } = action.payload;
        const classIndex = state.classes.findIndex(cls => cls.id === classId);
        
        if (classIndex !== -1) {
          state.classes[classIndex].currentParticipants += 1;
        }
        state.error = null;
      })
      .addCase(joinClass.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Leave class cases
      .addCase(leaveClass.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(leaveClass.fulfilled, (state, action) => {
        state.isLoading = false;
        const { classId } = action.payload;
        const classIndex = state.classes.findIndex(cls => cls.id === classId);
        
        if (classIndex !== -1) {
          state.classes[classIndex].currentParticipants = Math.max(0, state.classes[classIndex].currentParticipants - 1);
        }
        state.error = null;
      })
      .addCase(leaveClass.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create class cases
      .addCase(createClass.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createClass.fulfilled, (state, action) => {
        state.isLoading = false;
        state.classes.push(action.payload);
        state.error = null;
      })
      .addCase(createClass.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  clearClassError, 
  setSelectedClass, 
  updateClassStatus, 
  updateParticipantCount 
} = classSlice.actions;

export default classSlice.reducer;