// src/store/slices/userSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  user_type: 'user' | 'coach';
  avatar?: string;
  preferences: {
    fontSize: 'small' | 'medium' | 'large';
    theme: 'light' | 'dark';
    notifications: boolean;
  };
  stats: {
    totalClasses: number;
    completedClasses: number;
    streak: number;
    points: number;
  };
}

interface UserState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchUserProfile = createAsyncThunk(
  'user/fetchUserProfile',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/user/profile/${userId}`);
      const data = await response.json();
      
      if (!data.ok) {
        return rejectWithValue(data.error || 'Failed to fetch profile');
      }
      
      return data.profile;
    } catch {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async (profileData: Partial<UserProfile>, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });
      
      const data = await response.json();
      
      if (!data.ok) {
        return rejectWithValue(data.error || 'Failed to update profile');
      }
      
      return data.profile;
    } catch {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const updateUserPreferences = createAsyncThunk(
  'user/updateUserPreferences',
  async (preferences: Partial<UserProfile['preferences']>, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const currentProfile = state.user.profile;
      
      if (!currentProfile) {
        return rejectWithValue('No user profile found');
      }
      
      const updatedProfile = {
        ...currentProfile,
        preferences: { ...currentProfile.preferences, ...preferences }
      };
      
      const response = await fetch('/api/user/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences),
      });
      
      const data = await response.json();
      
      if (!data.ok) {
        return rejectWithValue(data.error || 'Failed to update preferences');
      }
      
      return updatedProfile;
    } catch {
      return rejectWithValue('Network error occurred');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
    setUserProfile: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
    },
    clearUserProfile: (state) => {
      state.profile = null;
    },
    updateLocalStats: (state, action: PayloadAction<Partial<UserProfile['stats']>>) => {
      if (state.profile) {
        state.profile.stats = { ...state.profile.stats, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch profile cases
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update profile cases
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update preferences cases
      .addCase(updateUserPreferences.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserPreferences.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(updateUserPreferences.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  clearUserError, 
  setUserProfile, 
  clearUserProfile, 
  updateLocalStats 
} = userSlice.actions;

export default userSlice.reducer;