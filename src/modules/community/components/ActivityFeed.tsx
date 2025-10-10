'use client';

import React, { useState } from 'react';
import { Card, Button, Icon } from '@/components/ui';
import { useCommunity } from '@/contexts/CommunityContext';
import { CommunityPost } from '@/types/community';

const ActivityFeed: React.FC = () => {
  const { state, likePost, addComment, deletePost, canParticipate } = useCommunity();
  const [commentText, setCommentText] = useState<{ [postId: string]: string }>({});

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getActivityIcon = (activityType: CommunityPost['activityType']) => {
    const icons = {
      walking: '🚶‍♀️',
      breathing: '🫁',
      yoga: '🧘‍♀️',
      meditation: '🧘‍♂️',
      class: '📚',
      challenge: '🏆',
      general: '💪',
    };
    return icons[activityType] || '💪';
  };

  const handleLike = (postId: string) => {
    likePost(postId);
  };

  const handleComment = (postId: string) => {
    const comment = commentText[postId]?.trim();
    if (comment) {
      addComment(postId, comment);
      setCommentText(prev => ({ ...prev, [postId]: '' }));
    }
  };

  const handleDelete = (postId: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deletePost(postId);
    }
  };

  if (state.loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2 text-neutral-medium">Loading posts...</span>
        </div>
      </Card>
    );
  }

  if (state.posts.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <Icon name="users" size="lg" className="mx-auto mb-4 text-neutral-light" />
          <h3 className="text-lg font-semibold text-neutral-dark mb-2">No Posts Yet</h3>
          <p className="text-neutral-medium mb-4">Be the first to share your wellness journey!</p>
          {canParticipate && (
            <Button variant="primary">
              Create First Post
            </Button>
          )}
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-neutral-dark">Motivation Feed</h2>
        <div className="text-sm text-neutral-medium">
          {state.posts.length} post{state.posts.length !== 1 ? 's' : ''}
        </div>
      </div>

      {state.posts.map((post) => (
        <Card key={post.id} className="p-6">
          {/* Post Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg">
                {post.userAvatar || '👤'}
              </div>
              <div>
                <h3 className="font-semibold text-neutral-dark">{post.userName}</h3>
                <p className="text-sm text-neutral-medium">{formatTimeAgo(post.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{getActivityIcon(post.activityType)}</span>
              {post.userId === 'current-user' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(post.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Icon name="trash" size="sm" />
                </Button>
              )}
            </div>
          </div>

          {/* Post Content */}
          <div className="mb-4">
            <h4 className="text-lg font-semibold text-neutral-dark mb-2">{post.title}</h4>
            <p className="text-neutral-medium leading-relaxed">{post.description}</p>
          </div>

          {/* Metrics */}
          {post.metrics && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h5 className="text-sm font-medium text-neutral-dark mb-2">Activity Details</h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {post.metrics.steps > 0 && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{post.metrics.steps.toLocaleString()}</div>
                    <div className="text-xs text-neutral-medium">Steps</div>
                  </div>
                )}
                {post.metrics.duration > 0 && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{post.metrics.duration}</div>
                    <div className="text-xs text-neutral-medium">Minutes</div>
                  </div>
                )}
                {post.metrics.calories > 0 && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{post.metrics.calories}</div>
                    <div className="text-xs text-neutral-medium">Calories</div>
                  </div>
                )}
                {post.metrics.distance > 0 && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{post.metrics.distance}</div>
                    <div className="text-xs text-neutral-medium">Kilometers</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-6">
              <button
                onClick={() => handleLike(post.id)}
                className={`flex items-center space-x-2 transition-colors ${
                  post.isLiked ? 'text-red-500' : 'text-neutral-medium hover:text-red-500'
                }`}
              >
                <Icon name={post.isLiked ? 'heart-filled' : 'heart'} size="sm" />
                <span className="text-sm font-medium">{post.likes}</span>
              </button>
              <button className="flex items-center space-x-2 text-neutral-medium hover:text-primary transition-colors">
                <Icon name="message-circle" size="sm" />
                <span className="text-sm font-medium">{post.comments.length}</span>
              </button>
            </div>
            <div className="text-sm text-neutral-light">
              {post.activityType.charAt(0).toUpperCase() + post.activityType.slice(1)}
            </div>
          </div>

          {/* Comments */}
          {post.comments.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="space-y-3">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                      {comment.userAvatar || '👤'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-neutral-dark">{comment.userName}</span>
                        <span className="text-xs text-neutral-light">{formatTimeAgo(comment.createdAt)}</span>
                      </div>
                      <p className="text-sm text-neutral-medium mt-1">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comment Input */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex space-x-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm">
                👤
              </div>
              <div className="flex-1 flex space-x-2">
                <input
                  type="text"
                  value={commentText[post.id] || ''}
                  onChange={(e) => setCommentText(prev => ({ ...prev, [post.id]: e.target.value }))}
                  placeholder="Write a comment..."
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handleComment(post.id)}
                />
                <Button
                  size="sm"
                  onClick={() => handleComment(post.id)}
                  disabled={!commentText[post.id]?.trim()}
                >
                  <Icon name="send" size="sm" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ActivityFeed;