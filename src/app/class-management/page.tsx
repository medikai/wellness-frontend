"use client";

import React, { useState } from 'react';
import { Card, Button, Icon } from '@/components/ui';
import { useClass } from '@/contexts/ClassContext';
import { Class } from '@/types/class';
import CreateClassForm from '@/components/forms/CreateClassForm';

const ClassManagementPage = () => {
  const { classes, createClass, updateClass, deleteClass, getBookingsByClassId } = useClass();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'published' | 'cancelled'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClasses = classes.filter(cls => {
    const matchesStatus = filterStatus === 'all' || cls.status === filterStatus;
    const matchesSearch = cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cls.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleCreateClass = (classData: Omit<Class, 'id' | 'createdAt' | 'updatedAt'>) => {
    createClass(classData);
    setShowCreateForm(false);
  };

  const handleUpdateClass = (classData: Omit<Class, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingClass) {
      updateClass(editingClass.id, classData);
      setEditingClass(null);
    }
  };

  const handleDeleteClass = (id: string) => {
    if (window.confirm('Are you sure you want to delete this class? This action cannot be undone.')) {
      deleteClass(id);
    }
  };

  const formatDateTime = (date: string, time: string) => {
    const classDate = new Date(`${date}T${time}`);
    return classDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'fitness': return 'dumbbell';
      case 'wellness': return 'heart';
      case 'therapy': return 'shield';
      case 'education': return 'book';
      case 'social': return 'users';
      default: return 'activity';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-dark">Class Management</h1>
          <p className="text-neutral-medium mt-2">Create and manage your wellness classes</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowCreateForm(true)}
          className="mt-4 sm:mt-0"
        >
          <Icon name="plus" size="sm" className="mr-2" />
          Create New Class
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search classes by name or instructor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'draft', 'published', 'cancelled'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === status
                  ? 'bg-teal-primary text-white'
                  : 'bg-neutral-light text-neutral-medium hover:bg-neutral-medium hover:text-white'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Icon name="activity" size="md" color="#3B92F6" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-neutral-medium">Total Classes</p>
              <p className="text-2xl font-bold text-neutral-dark">{classes.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Icon name="checkCircle" size="md" color="#10B981" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-neutral-medium">Published</p>
              <p className="text-2xl font-bold text-neutral-dark">
                {classes.filter(c => c.status === 'published').length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Icon name="edit" size="md" color="#F59E0B" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-neutral-medium">Drafts</p>
              <p className="text-2xl font-bold text-neutral-dark">
                {classes.filter(c => c.status === 'draft').length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Icon name="users" size="md" color="#8B5CF6" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-neutral-medium">Total Bookings</p>
              <p className="text-2xl font-bold text-neutral-dark">
                {classes.reduce((total, cls) => total + getBookingsByClassId(cls.id).length, 0)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Classes List */}
      {filteredClasses.length === 0 ? (
        <Card className="p-12 text-center">
          <Icon name="activity" size="xl" color="#6B7280" className="mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-neutral-dark mb-2">No classes found</h3>
          <p className="text-neutral-medium mb-6">
            {searchTerm || filterStatus !== 'all' 
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by creating your first class.'
            }
          </p>
          {!searchTerm && filterStatus === 'all' && (
            <Button variant="primary" onClick={() => setShowCreateForm(true)}>
              Create Your First Class
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredClasses.map((cls) => {
            const bookings = getBookingsByClassId(cls.id);
            const attendanceRate = cls.maxParticipants > 0 
              ? Math.round((bookings.length / cls.maxParticipants) * 100)
              : 0;

            return (
              <Card key={cls.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-teal-light rounded-lg mr-3">
                      <Icon name={getCategoryIcon(cls.category)} size="sm" color="#4CAF9D" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-dark">{cls.name}</h3>
                      <p className="text-sm text-neutral-medium">{cls.instructor}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(cls.status)}`}>
                    {cls.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-neutral-medium">
                    <Icon name="calendar" size="sm" className="mr-2" />
                    {formatDateTime(cls.date, cls.time)}
                  </div>
                  <div className="flex items-center text-sm text-neutral-medium">
                    <Icon name="clock" size="sm" className="mr-2" />
                    {cls.duration} minutes
                  </div>
                  <div className="flex items-center text-sm text-neutral-medium">
                    <Icon name={cls.location === 'online' ? 'video' : 'mapPin'} size="sm" className="mr-2" />
                    {cls.location === 'online' ? 'Online' : 'In-Person'}
                  </div>
                  <div className="flex items-center text-sm text-neutral-medium">
                    <Icon name="users" size="sm" className="mr-2" />
                    {bookings.length}/{cls.maxParticipants} participants
                  </div>
                </div>

                <p className="text-sm text-neutral-medium mb-4 line-clamp-2">
                  {cls.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-16 bg-neutral-light rounded-full h-2 mr-2">
                      <div 
                        className="bg-teal-primary h-2 rounded-full" 
                        style={{ width: `${Math.min(attendanceRate, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-neutral-medium">{attendanceRate}%</span>
                  </div>
                  <span className="text-sm font-medium text-neutral-dark">
                    ${cls.price > 0 ? cls.price.toFixed(2) : 'Free'}
                  </span>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingClass(cls)}
                    className="flex-1"
                  >
                    <Icon name="edit" size="sm" className="mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteClass(cls.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Icon name="trash" size="sm" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create/Edit Form Modal */}
      {(showCreateForm || editingClass) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <CreateClassForm
              onSubmit={editingClass ? handleUpdateClass : handleCreateClass}
              onCancel={() => {
                setShowCreateForm(false);
                setEditingClass(null);
              }}
              initialData={editingClass || undefined}
              isEditing={!!editingClass}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassManagementPage;