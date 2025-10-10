'use client';

import React from 'react';
import { Card, Button, Icon } from '@/components/ui';
import { useCommunity } from '@/contexts/CommunityContext';
import { Challenge } from '@/types/community';

const Challenges: React.FC = () => {
  const { state, joinChallenge, canCreateContent } = useCommunity();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const isUserParticipating = (challenge: Challenge) => {
    return challenge.participants.includes('current-user'); // This should come from auth context
  };

  const handleJoinChallenge = (challengeId: string) => {
    joinChallenge(challengeId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-neutral-dark">Challenges</h2>
        {canCreateContent && (
          <Button variant="outline" size="sm">
            <Icon name="plus" size="sm" className="mr-2" />
            Create Challenge
          </Button>
        )}
      </div>

      {state.challenges.length === 0 ? (
        <Card className="p-6">
          <div className="text-center py-8">
            <Icon name="target" size="lg" className="mx-auto mb-4 text-neutral-light" />
            <h3 className="text-lg font-semibold text-neutral-dark mb-2">No Active Challenges</h3>
            <p className="text-neutral-medium mb-4">Check back later for new challenges!</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {state.challenges.map((challenge) => {
            const isParticipating = isUserParticipating(challenge);
            const daysRemaining = getDaysRemaining(challenge.endDate);

            return (
              <Card key={challenge.id} className="p-6 relative overflow-hidden">
                {/* Challenge Status Badge */}
                <div className="absolute top-4 right-4">
                  {isParticipating ? (
                    <div className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                      Joined
                    </div>
                  ) : (
                    <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                      Available
                    </div>
                  )}
                </div>

                {/* Challenge Icon and Title */}
                <div className="mb-4">
                  <div className="text-4xl mb-3">{challenge.icon}</div>
                  <h3 className="text-lg font-semibold text-neutral-dark mb-2">{challenge.title}</h3>
                  <p className="text-sm text-neutral-medium">{challenge.description}</p>
                </div>

                {/* Challenge Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-medium">Target</span>
                    <span className="font-semibold text-neutral-dark">
                      {challenge.target.toLocaleString()} {challenge.unit}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-medium">Participants</span>
                    <span className="font-semibold text-neutral-dark">
                      {challenge.participants.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-medium">Ends</span>
                    <span className="font-semibold text-neutral-dark">
                      {formatDate(challenge.endDate)}
                    </span>
                  </div>
                  {daysRemaining > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neutral-medium">Days Left</span>
                      <span className="font-semibold text-primary">
                        {daysRemaining} day{daysRemaining !== 1 ? 's' : ''}
                      </span>
                    </div>
                  )}
                </div>

                {/* Progress Bar for Participating Users */}
                {isParticipating && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-neutral-medium mb-1">
                      <span>Your Progress</span>
                      <span>0%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full w-0"></div>
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <Button
                  variant={isParticipating ? 'outline' : 'primary'}
                  size="lg"
                  className="w-full"
                  onClick={() => handleJoinChallenge(challenge.id)}
                  disabled={isParticipating || daysRemaining === 0}
                >
                  {isParticipating ? (
                    <>
                      <Icon name="check" size="sm" className="mr-2" />
                      Joined
                    </>
                  ) : daysRemaining === 0 ? (
                    'Expired'
                  ) : (
                    <>
                      <Icon name="plus" size="sm" className="mr-2" />
                      Join Challenge
                    </>
                  )}
                </Button>

                {/* Challenge Type Badge */}
                <div className="absolute bottom-4 left-4">
                  <div className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded">
                    {challenge.type.charAt(0).toUpperCase() + challenge.type.slice(1)}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Challenge Tips */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
        <h3 className="text-lg font-semibold text-neutral-dark mb-3 flex items-center">
          <Icon name="lightbulb" size="sm" className="mr-2 text-blue-500" />
          Challenge Tips
        </h3>
        <div className="space-y-2 text-sm text-neutral-medium">
          <div className="flex items-center">
            <Icon name="check" size="sm" className="mr-2 text-green-500" />
            Join challenges that match your fitness level
          </div>
          <div className="flex items-center">
            <Icon name="check" size="sm" className="mr-2 text-green-500" />
            Share your progress to stay motivated
          </div>
          <div className="flex items-center">
            <Icon name="check" size="sm" className="mr-2 text-green-500" />
            Encourage friends to join the same challenge
          </div>
          <div className="flex items-center">
            <Icon name="check" size="sm" className="mr-2 text-green-500" />
            Complete challenges to earn special badges
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Challenges;