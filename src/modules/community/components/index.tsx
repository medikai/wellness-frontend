'use client';

import React, { useState } from 'react'
import Header from './Header'
import PostCreation from './PostCreation'
import ActivityFeed from './ActivityFeed'
import AchievementDisplay from './AchievementDisplay'
import Challenges from './Challenges'
import Friends from './Friends'
import { useCommunity } from '@/contexts/CommunityContext'

const Community = () => {
  const [activeTab, setActiveTab] = useState<'feed' | 'achievements' | 'challenges' | 'friends'>('feed')
  const { canParticipate } = useCommunity()

  const tabs = [
    { id: 'feed', label: 'Activity Feed', icon: '📱' },
    { id: 'achievements', label: 'Achievements', icon: '🏆' },
    { id: 'challenges', label: 'Challenges', icon: '🎯' },
    { id: 'friends', label: 'Friends', icon: '👥' },
  ]

  return (
    <>
      <Header />
      
      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
                      onClick={() => setActiveTab(tab.id as 'feed' | 'achievements' | 'challenges' | 'friends')}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-neutral-medium hover:text-neutral-dark'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'feed' && (
          <>
            {canParticipate && <PostCreation />}
            <ActivityFeed />
          </>
        )}
        
        {activeTab === 'achievements' && <AchievementDisplay />}
        
        {activeTab === 'challenges' && <Challenges />}
        
        {activeTab === 'friends' && <Friends />}
      </div>
    </>
  )
}

export default Community