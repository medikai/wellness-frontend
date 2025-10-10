'use client';

import React from 'react';
import { Card, Icon } from '@/components/ui';
import { useCommunity } from '@/contexts/CommunityContext';
import { Achievement } from '@/types/community';

const AchievementDisplay: React.FC = () => {
  const { state } = useCommunity();

  const getRarityColor = (rarity: Achievement['rarity']) => {
    const colors = {
      common: 'text-gray-600 bg-gray-100',
      uncommon: 'text-green-600 bg-green-100',
      rare: 'text-blue-600 bg-blue-100',
      epic: 'text-purple-600 bg-purple-100',
      legendary: 'text-yellow-600 bg-yellow-100',
    };
    return colors[rarity];
  };

  const getRarityBorder = (rarity: Achievement['rarity']) => {
    const borders = {
      common: 'border-gray-200',
      uncommon: 'border-green-200',
      rare: 'border-blue-200',
      epic: 'border-purple-200',
      legendary: 'border-yellow-200',
    };
    return borders[rarity];
  };

  const completedAchievements = state.userAchievements.filter(ua => ua.isCompleted);
  const inProgressAchievements = state.userAchievements.filter(ua => !ua.isCompleted);

  const getAchievementProgress = (achievement: Achievement) => {
    const userAchievement = state.userAchievements.find(ua => ua.achievementId === achievement.id);
    if (!userAchievement) return 0;
    return userAchievement.progress;
  };

  const getTotalPoints = () => {
    return completedAchievements.reduce((total, ua) => {
      const achievement = state.achievements.find(a => a.id === ua.achievementId);
      return total + (achievement?.points || 0);
    }, 0);
  };

  return (
    <div className="space-y-6">
      {/* Achievement Summary */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-neutral-dark">Your Achievements</h2>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{getTotalPoints()}</div>
            <div className="text-sm text-neutral-medium">Total Points</div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-600">{completedAchievements.length}</div>
            <div className="text-sm text-neutral-medium">Completed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">{inProgressAchievements.length}</div>
            <div className="text-sm text-neutral-medium">In Progress</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">{state.achievements.length}</div>
            <div className="text-sm text-neutral-medium">Total Available</div>
          </div>
        </div>
      </Card>

      {/* Completed Achievements */}
      {completedAchievements.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-neutral-dark mb-4 flex items-center">
            <Icon name="trophy" size="sm" className="mr-2 text-yellow-500" />
            Completed Achievements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedAchievements.map((userAchievement) => {
              const achievement = state.achievements.find(a => a.id === userAchievement.achievementId);
              if (!achievement) return null;

              return (
                <div
                  key={userAchievement.id}
                  className={`p-4 rounded-lg border-2 ${getRarityBorder(achievement.rarity)} bg-white`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-3xl">{achievement.icon}</div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(achievement.rarity)}`}>
                      {achievement.rarity}
                    </div>
                  </div>
                  <h4 className="font-semibold text-neutral-dark mb-1">{achievement.name}</h4>
                  <p className="text-sm text-neutral-medium mb-2">{achievement.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-primary">+{achievement.points} pts</div>
                    <div className="text-xs text-neutral-light">
                      {new Date(userAchievement.earnedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Available Achievements */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-neutral-dark mb-4 flex items-center">
          <Icon name="target" size="sm" className="mr-2 text-blue-500" />
          Available Achievements
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {state.achievements.map((achievement) => {
            const userAchievement = state.userAchievements.find(ua => ua.achievementId === achievement.id);
            const progress = getAchievementProgress(achievement);
            const isCompleted = userAchievement?.isCompleted || false;

            if (isCompleted) return null;

            return (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border-2 ${getRarityBorder(achievement.rarity)} ${
                  progress > 0 ? 'bg-blue-50' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-3xl">{achievement.icon}</div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(achievement.rarity)}`}>
                    {achievement.rarity}
                  </div>
                </div>
                <h4 className="font-semibold text-neutral-dark mb-1">{achievement.name}</h4>
                <p className="text-sm text-neutral-medium mb-3">{achievement.description}</p>
                
                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-neutral-medium mb-1">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-primary">+{achievement.points} pts</div>
                  <div className="text-xs text-neutral-light">
                    {achievement.requirement.type === 'count' && `${achievement.requirement.value} ${achievement.requirement.period || 'times'}`}
                    {achievement.requirement.type === 'streak' && `${achievement.requirement.value} day streak`}
                    {achievement.requirement.type === 'total' && `${achievement.requirement.value} total`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Achievement Tips */}
      <Card className="p-6 bg-gradient-to-r from-primary/5 to-secondary/5">
        <h3 className="text-lg font-semibold text-neutral-dark mb-3 flex items-center">
          <Icon name="lightbulb" size="sm" className="mr-2 text-yellow-500" />
          Tips to Earn More Achievements
        </h3>
        <div className="space-y-2 text-sm text-neutral-medium">
          <div className="flex items-center">
            <Icon name="check" size="sm" className="mr-2 text-green-500" />
            Share your daily activities to track progress
          </div>
          <div className="flex items-center">
            <Icon name="check" size="sm" className="mr-2 text-green-500" />
            Stay consistent with your wellness routine
          </div>
          <div className="flex items-center">
            <Icon name="check" size="sm" className="mr-2 text-green-500" />
            Engage with the community by liking and commenting
          </div>
          <div className="flex items-center">
            <Icon name="check" size="sm" className="mr-2 text-green-500" />
            Join challenges to earn special badges
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AchievementDisplay;