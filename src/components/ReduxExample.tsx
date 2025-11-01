// src/components/ReduxExample.tsx
'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { 
  loginUser, 
  registerUser, 
  logoutUser, 
  checkAuthStatus,
  clearError 
} from '@/store/slices/authSlice';
import { 
  fetchClasses, 
  joinClass, 
  setSelectedClass 
} from '@/store/slices/classSlice';
import { Button } from '@/components/ui';

interface ClassItem {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorId: string;
  startTime: string;
  endTime: string;
  duration: number;
  category: 'fitness' | 'yoga' | 'meditation' | 'nutrition' | 'waylness';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  maxParticipants: number;
  currentParticipants: number;
  isLive: boolean;
  isCompleted: boolean;
  thumbnail?: string;
  tags: string[];
}

const ReduxExample: React.FC = () => {
  const dispatch = useAppDispatch();
  
  // Auth state
  const { user, isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);
  
  // Classes state
  const { classes, upcomingClasses, liveClasses, selectedClass } = useAppSelector((state) => state.classes);

  // Check auth status on component mount
  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  // Fetch classes on component mount
  useEffect(() => {
    dispatch(fetchClasses());
  }, [dispatch]);

  const handleLogin = () => {
    dispatch(loginUser({ 
      email: 'test@example.com', 
      password: 'password123' 
    }));
  };

  const handleRegister = () => {
    dispatch(registerUser({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      user_type: 'user'
    }));
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const handleJoinClass = (classId: string) => {
    dispatch(joinClass(classId));
  };


  const handleSelectClass = (classItem: ClassItem) => {
    dispatch(setSelectedClass(classItem));
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Redux Example Component</h1>
      
      {/* Auth Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Authentication State</h2>
        
        {isLoading && (
          <div className="text-blue-600 mb-4">Loading...</div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <div className="flex justify-between items-center">
              <span>{error}</span>
              <button 
                onClick={clearAuthError}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          </div>
        )}
        
        {isAuthenticated && user ? (
          <div className="space-y-4">
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              <p><strong>Welcome, {user.name}!</strong></p>
              <p>Email: {user.email}</p>
              <p>User Type: {user.user_type}</p>
            </div>
            <Button onClick={handleLogout} variant="secondary">
              Logout
            </Button>
          </div>
        ) : (
          <div className="space-x-4">
            <Button onClick={handleLogin} variant="primary">
              Login
            </Button>
            <Button onClick={handleRegister} variant="secondary">
              Register
            </Button>
          </div>
        )}
      </div>

      {/* Classes Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Classes State</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800">Total Classes</h3>
            <p className="text-2xl font-bold text-blue-600">{classes.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800">Upcoming</h3>
            <p className="text-2xl font-bold text-green-600">{upcomingClasses.length}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="font-semibold text-red-800">Live Now</h3>
            <p className="text-2xl font-bold text-red-600">{liveClasses.length}</p>
          </div>
        </div>

        {classes.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3">Available Classes</h3>
            <div className="space-y-2">
              {classes.slice(0, 3).map((classItem) => (
                <div 
                  key={classItem.id} 
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div>
                    <h4 className="font-medium">{classItem.title}</h4>
                    <p className="text-sm text-gray-600">
                      {classItem.instructor} • {classItem.category}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleSelectClass(classItem)}
                      variant="outline"
                    >
                      Select
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => handleJoinClass(classItem.id)}
                      variant="primary"
                    >
                      Join
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Selected Class Section */}
      {selectedClass && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Selected Class</h3>
          <p><strong>Title:</strong> {selectedClass.title}</p>
          <p><strong>Instructor:</strong> {selectedClass.instructor}</p>
          <p><strong>Duration:</strong> {selectedClass.duration} minutes</p>
          <p><strong>Participants:</strong> {selectedClass.currentParticipants}/{selectedClass.maxParticipants}</p>
        </div>
      )}
    </div>
  );
};

export default ReduxExample;