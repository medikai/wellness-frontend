import { Card, Button, Icon, ProgressBar } from '@/components/ui'
import React from 'react'

const DashboardPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-dark mb-2">Dashboard</h1>
          <p className="text-neutral-medium">Welcome to your health dashboard</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Welcome Section */}
            <div>
              <h2 className="text-3xl font-bold text-neutral-dark mb-2">
                Good morning, Mary 👋
              </h2>
              <p className="text-neutral-medium">
                Ready to start your health journey today?
              </p>
            </div>

            {/* Live Class Card */}
            <Card hover className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-sm text-neutral-medium">Live Class</span>
                  <h3 className="text-2xl font-bold text-neutral-dark mt-1">
                    Yoga for Joints
                  </h3>
                  <p className="text-neutral-medium mt-1">
                    Today at 10:00 AM
                  </p>
                </div>
                <Button variant="secondary" size="lg">
                  Start Class →
                </Button>
              </div>
            </Card>

            {/* Progress Card */}
            <Card className="p-6">
              <h3 className="text-xl font-bold text-neutral-dark mb-4">
                Your Progress
              </h3>
              <p className="text-neutral-medium mb-4">
                You&apos;ve completed 3 classes this week 💪
              </p>
              <p className="text-neutral-dark font-medium mb-4">
                Keep going!
              </p>
              <ProgressBar 
                value={75} 
                showLabel 
                label="Weekly Goal" 
                color="teal"
              />
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Text Size Control */}
            <Card className="p-4">
              <h3 className="text-lg font-semibold text-neutral-dark mb-4">
                Text Size
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-neutral-light rounded-full"></div>
                  <span className="text-sm text-neutral-medium">Small</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-teal-primary rounded-full"></div>
                  <span className="text-sm text-neutral-dark font-medium">Medium</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-neutral-light rounded-full"></div>
                  <span className="text-sm text-neutral-medium">Large</span>
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button variant="primary" size="lg" className="w-full">
                Join a Class
              </Button>
              <Button variant="outline" size="lg" className="w-full">
                <Icon name="phone" size="sm" className="mr-2" />
                Get Help
              </Button>
              <Button variant="outline" size="lg" className="w-full">
                <Icon name="settings" size="sm" className="mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>
  )
}

export default DashboardPage