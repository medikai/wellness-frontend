//src/app/profile/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Icon, Card } from '@/components/ui';
import { useRouter } from 'next/navigation';

interface UserProfile {
  id: string;
  fullname: string;
  email: string;
  phone?: string;
  role?: string;
  avatar_url?: string;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/auth/me', { cache: 'no-store' });
        const data = await response.json();
        
        if (data.ok && data.profile) {
          setProfile(data.profile);
        } else if (data.ok && data.user) {
          // Fallback to user data if profile is not available
          setProfile({
            id: data.user.id,
            fullname: user?.name || data.user.email?.split('@')[0] || 'User',
            email: data.user.email || user?.email || '',
            role: data.user.role || user?.role,
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-primary mx-auto mb-4"></div>
          <p className="text-neutral-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-neutral-medium mb-4">Unable to load profile</p>
          <button
            onClick={() => router.push('/home')}
            className="px-4 py-2 bg-teal-primary text-white rounded-lg hover:bg-teal-dark transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-dark mb-2">Profile</h1>
        <p className="text-neutral-medium">Manage your account information and preferences</p>
      </div>

      <div className="space-y-6">
        {/* Profile Card */}
        <Card className="p-6" shadow="md">
          <div className="flex items-start space-x-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-gradient-to-br from-teal-primary to-teal-dark rounded-2xl flex items-center justify-center shadow-lg">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.fullname}
                  className="w-24 h-24 rounded-2xl object-cover"
                />
              ) : (
                <Icon name="user" size="xl" color="white" />
              )}
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-neutral-dark mb-2">{profile.fullname}</h2>
              {profile.role && (
                <span className="inline-block px-3 py-1 bg-teal-light text-teal-primary rounded-full text-sm font-medium mb-3">
                  {profile.role === 'coach' ? 'Coach' : 'Student'}
                </span>
              )}
              
              <div className="space-y-2 mt-4">
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <span className="text-teal-primary text-sm">@</span>
                  </div>
                  <span className="text-neutral-dark">{profile.email}</span>
                </div>
                {profile.phone && (
                  <div className="flex items-center space-x-3">
                    <Icon name="phone" size="sm" color="#059669" />
                    <span className="text-neutral-dark">{profile.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Account Information */}
        <Card className="p-6" shadow="md">
          <h3 className="text-xl font-bold text-neutral-dark mb-4">Account Information</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-neutral-light">
              <span className="text-neutral-medium font-medium">Full Name</span>
              <span className="text-neutral-dark font-semibold">{profile.fullname}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-neutral-light">
              <span className="text-neutral-medium font-medium">Email</span>
              <span className="text-neutral-dark font-semibold">{profile.email}</span>
            </div>
            {profile.phone && (
              <div className="flex justify-between items-center py-3 border-b border-neutral-light">
                <span className="text-neutral-medium font-medium">Phone</span>
                <span className="text-neutral-dark font-semibold">{profile.phone}</span>
              </div>
            )}
            <div className="flex justify-between items-center py-3">
              <span className="text-neutral-medium font-medium">Role</span>
              <span className="text-neutral-dark font-semibold capitalize">
                {profile.role || 'Student'}
              </span>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <Card className="p-6" shadow="md">
          <h3 className="text-xl font-bold text-neutral-dark mb-4">Actions</h3>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/settings')}
              className="w-full flex items-center justify-between px-4 py-3 bg-white border-2 border-neutral-light rounded-xl hover:border-teal-primary hover:bg-teal-light/50 transition-all duration-200"
            >
              <div className="flex items-center space-x-3">
                <Icon name="settings" size="sm" color="#059669" />
                <span className="font-medium text-neutral-dark">Settings</span>
              </div>
              <Icon name="chevronRight" size="sm" color="#059669" />
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}

