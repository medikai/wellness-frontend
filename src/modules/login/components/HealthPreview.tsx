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
          <h2 className="text-3xl font-bold mb-3">Your Health Journey Starts Here</h2>
          <p className="text-lg text-teal-100">Track your waylness, join classes, and achieve your health goals</p>
        </div>

        {/* Health Dashboard Mockup */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6">
          <h3 className="text-lg font-semibold mb-3">Today&apos;s Progress</h3>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="bg-white/20 rounded-lg p-3">
              <div className="text-xl font-bold">8.5</div>
              <div className="text-xs text-teal-100">Hours Active</div>
            </div>
            <div className="bg-white/20 rounded-lg p-3">
              <div className="text-xl font-bold">12.4</div>
              <div className="text-xs text-teal-100">Hours Focused</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs">Exercise</span>
              <span className="text-xs font-semibold">75%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-1.5">
              <div className="bg-white h-1.5 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>
        </div>

        {/* Health Stats */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
              <Icon name="heart" size="sm" color="white" />
            </div>
            <span className="text-sm">Track your daily activities</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
              <Icon name="chart" size="sm" color="white" />
            </div>
            <span className="text-sm">Monitor your progress</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
              <Icon name="users" size="sm" color="white" />
            </div>
            <span className="text-sm">Join health communities</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HealthPreview