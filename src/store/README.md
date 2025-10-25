# Redux Store Setup

This directory contains the Redux store configuration and slices for the Health++ application.

## Structure

```
src/store/
├── index.ts                 # Store configuration
├── hooks.ts                 # Typed Redux hooks
├── ReduxProvider.tsx        # Redux Provider component
├── slices/
│   ├── authSlice.ts         # Authentication state management
│   ├── userSlice.ts         # User profile and preferences
│   └── classSlice.ts        # Classes and bookings management
└── README.md               # This file
```

## Features

### 🔐 Authentication Slice (`authSlice.ts`)
- User login/logout
- User registration
- Authentication status checking
- Error handling
- User profile management

**Actions:**
- `loginUser(credentials)` - Login with email/password
- `registerUser(userData)` - Register new user
- `logoutUser()` - Logout current user
- `checkAuthStatus()` - Check if user is authenticated
- `clearError()` - Clear error messages

### 👤 User Slice (`userSlice.ts`)
- User profile management
- User preferences (font size, theme, notifications)
- User statistics (classes, streaks, points)
- Profile updates

**Actions:**
- `fetchUserProfile(userId)` - Fetch user profile
- `updateUserProfile(profileData)` - Update user profile
- `updateUserPreferences(preferences)` - Update user preferences
- `updateLocalStats(stats)` - Update local statistics

### 🏃‍♀️ Classes Slice (`classSlice.ts`)
- Class management
- Live class tracking
- Class participation
- Class creation (for coaches)

**Actions:**
- `fetchClasses()` - Fetch all classes
- `fetchUpcomingClasses()` - Fetch upcoming classes
- `fetchLiveClasses()` - Fetch live classes
- `joinClass(classId)` - Join a class
- `leaveClass(classId)` - Leave a class
- `createClass(classData)` - Create new class
- `setSelectedClass(class)` - Select a class

## Usage

### 1. Using Redux in Components

```tsx
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginUser, clearError } from '@/store/slices/authSlice';

const MyComponent = () => {
  const dispatch = useAppDispatch();
  const { user, isLoading, error } = useAppSelector((state) => state.auth);

  const handleLogin = () => {
    dispatch(loginUser({ email: 'user@example.com', password: 'password' }));
  };

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {user && <p>Welcome, {user.name}!</p>}
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};
```

### 2. State Structure

```typescript
interface RootState {
  auth: {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    isAuthenticated: boolean;
  };
  user: {
    profile: UserProfile | null;
    isLoading: boolean;
    error: string | null;
  };
  classes: {
    classes: Class[];
    upcomingClasses: Class[];
    liveClasses: Class[];
    selectedClass: Class | null;
    isLoading: boolean;
    error: string | null;
  };
}
```

### 3. Async Actions

All async actions return promises and can be handled with `.unwrap()`:

```tsx
const handleAsyncAction = async () => {
  try {
    const result = await dispatch(loginUser(credentials)).unwrap();
    console.log('Login successful:', result);
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

## Testing

Visit `/redux-test` to see a working example of the Redux setup in action.

## Best Practices

1. **Use typed hooks**: Always use `useAppDispatch` and `useAppSelector` instead of the plain Redux hooks
2. **Handle loading states**: Always check `isLoading` before showing data
3. **Handle errors**: Display error messages and provide ways to clear them
4. **Use async thunks**: For API calls, use `createAsyncThunk` instead of manual dispatch
5. **Keep slices focused**: Each slice should handle one domain of your application
6. **Use selectors**: Create reusable selectors for complex state derivations

## Integration with Existing Context

The Redux store works alongside the existing React Context providers:
- `AuthProvider` - Still used for legacy components
- `FontSizeProvider` - For font size management
- `ClassProvider` - For class-related context
- `QuizProvider` - For quiz functionality

You can gradually migrate from Context to Redux as needed.