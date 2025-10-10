'use client';

import React, { useState } from 'react';
import { Card, Button, Icon } from '@/components/ui';
import { useCommunity } from '@/contexts/CommunityContext';
import { Friend } from '@/types/community';

const Friends: React.FC = () => {
  const { state, addFriend } = useCommunity();
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [newFriendName, setNewFriendName] = useState('');

  const formatLastActive = (lastActive: string) => {
    const date = new Date(lastActive);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const handleAddFriend = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFriendName.trim()) {
      addFriend({
        userId: `friend-${Date.now()}`,
        name: newFriendName.trim(),
        avatar: '👤',
        lastActive: new Date().toISOString(),
        isOnline: true,
        mutualActivities: 0,
      });
      setNewFriendName('');
      setShowAddFriend(false);
    }
  };

  const handleCall = (friend: Friend) => {
    // In a real app, this would initiate a call
    alert(`Calling ${friend.name}...`);
  };

  const handleMessage = (friend: Friend) => {
    // In a real app, this would open a chat
    alert(`Opening chat with ${friend.name}...`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-neutral-dark">Friends</h2>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setShowAddFriend(true)}
        >
          <Icon name="plus" size="sm" className="mr-2" />
          Add Buddy
        </Button>
      </div>

      {/* Add Friend Form */}
      {showAddFriend && (
        <Card className="p-6">
          <form onSubmit={handleAddFriend} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-2">
                Friend&apos;s Name
              </label>
              <input
                type="text"
                value={newFriendName}
                onChange={(e) => setNewFriendName(e.target.value)}
                placeholder="Enter your friend's name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddFriend(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Add Friend
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Friends List */}
      {state.friends.length === 0 ? (
        <Card className="p-6">
          <div className="text-center py-8">
            <Icon name="users" size="lg" className="mx-auto mb-4 text-neutral-light" />
            <h3 className="text-lg font-semibold text-neutral-dark mb-2">No Friends Yet</h3>
            <p className="text-neutral-medium mb-4">Add friends to stay connected and motivated!</p>
            <Button variant="primary" onClick={() => setShowAddFriend(true)}>
              Add Your First Friend
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {state.friends.map((friend) => (
            <Card key={friend.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-xl">
                      {friend.avatar}
                    </div>
                    {friend.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-dark">{friend.name}</h3>
                    <p className="text-sm text-neutral-medium">
                      {friend.isOnline ? 'Online' : `Last active ${formatLastActive(friend.lastActive)}`}
                    </p>
                    {friend.mutualActivities > 0 && (
                      <p className="text-xs text-primary">
                        {friend.mutualActivities} mutual activit{friend.mutualActivities !== 1 ? 'ies' : 'y'}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCall(friend)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Icon name="phone" size="sm" className="mr-1" />
                    Call
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleMessage(friend)}
                    className="text-green-600 hover:text-green-700"
                  >
                    <Icon name="message-circle" size="sm" className="mr-1" />
                    Message
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Friends Tips */}
      <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50">
        <h3 className="text-lg font-semibold text-neutral-dark mb-3 flex items-center">
          <Icon name="lightbulb" size="sm" className="mr-2 text-green-500" />
          Stay Connected
        </h3>
        <div className="space-y-2 text-sm text-neutral-medium">
          <div className="flex items-center">
            <Icon name="check" size="sm" className="mr-2 text-green-500" />
            Share your progress with friends for motivation
          </div>
          <div className="flex items-center">
            <Icon name="check" size="sm" className="mr-2 text-green-500" />
            Join the same challenges as your friends
          </div>
          <div className="flex items-center">
            <Icon name="check" size="sm" className="mr-2 text-green-500" />
            Celebrate each other&apos;s achievements
          </div>
          <div className="flex items-center">
            <Icon name="check" size="sm" className="mr-2 text-green-500" />
            Stay in touch through calls and messages
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Friends;