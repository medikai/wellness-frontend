import React from 'react'
import { Icon } from '@/components/ui'

const HealthPreview = ({ className = '' }: { className?: string }) => {
  return (
    <div className={`flex-1 bg-gradient-to-br from-teal-500 to-teal-600 p-6 flex items-center justify-center relative overflow-hidden ${className}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full"></div>
        <div className="absolute top-32 right-20 w-24 h-24 bg-white rounded-full"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-white rounded-full"></div>
        <div className="absolute bottom-32 right-10 w-28 h-28 bg-white rounded-full"></div>
      </div>

      <div className="relative z-10 text-white">
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-3">Join Our Health Community</h2>
          <p className="text-lg text-teal-100">Connect with others on their waylness journey</p>
        </div>

        {/* Health Classes Preview */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6">
          <h3 className="text-lg font-semibold mb-3">Live Classes Today</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between bg-white/20 rounded-lg p-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center">
                  <Icon name="heart" size="sm" color="white" />
                </div>
                <div>
                  <div className="font-semibold text-sm">Yoga for Joints</div>
                  <div className="text-xs text-teal-100">10:00 AM - 11:00 AM</div>
                </div>
              </div>
              <div className="text-xs font-semibold">Live</div>
            </div>
            <div className="flex items-center justify-between bg-white/20 rounded-lg p-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center">
                  <Icon name="heart" size="sm" color="white" />
                </div>
                <div>
                  <div className="font-semibold text-sm">Meditation Session</div>
                  <div className="text-xs text-teal-100">2:00 PM - 2:30 PM</div>
                </div>
              </div>
              <div className="text-xs font-semibold">Upcoming</div>
            </div>
          </div>
        </div>

        {/* Health Features */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
              <Icon name="heart" size="sm" color="white" />
            </div>
            <span className="text-sm">Join live health classes</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
              <Icon name="chart" size="sm" color="white" />
            </div>
            <span className="text-sm">Track your waylness progress</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
              <Icon name="users" size="sm" color="white" />
            </div>
            <span className="text-sm">Connect with health experts</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
              <Icon name="gamepad" size="sm" color="white" />
            </div>
            <span className="text-sm">Play health-focused games</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HealthPreview