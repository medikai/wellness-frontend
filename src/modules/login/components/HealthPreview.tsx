import React from 'react'
import { Icon } from '@/components/ui'

const HealthPreview = ({ className = '' }: { className?: string }) => {
  return (
    <div className={`flex-1 bg-gradient-to-br from-teal-600 to-teal-800 p-8 flex items-center justify-center relative overflow-hidden shadow-2xl ${className}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-teal-300 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 text-white max-w-md w-full">
        <div className="mb-10 text-center">
          <div className="inline-block p-3 bg-white/10 rounded-2xl mb-4 backdrop-blur-sm border border-white/10">
            <Icon name="heart" size="lg" className="text-white" />
          </div>
          <h2 className="text-4xl font-bold mb-4 leading-tight">Your Health Journey<br />Starts Here</h2>
          <p className="text-lg text-teal-100/90 leading-relaxed">Track your Waylness, join classes, and achieve your health goals with our easy-to-use platform.</p>
        </div>

        {/* Health Dashboard Mockup */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 border border-white/20 shadow-xl transform rotate-1 hover:rotate-0 transition-transform duration-500">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold">Today&apos;s Snapshot</h3>
            <span className="bg-teal-500/50 px-2 py-1 rounded text-xs font-medium border border-teal-400/30">Live Update</span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-br from-white/20 to-white/5 rounded-xl p-4 border border-white/10">
              <div className="text-2xl font-bold mb-1">8.5</div>
              <div className="text-xs text-teal-100 font-medium opacity-80 uppercase tracking-wide">Hours Active</div>
            </div>
            <div className="bg-gradient-to-br from-white/20 to-white/5 rounded-xl p-4 border border-white/10">
              <div className="text-2xl font-bold mb-1">12.4</div>
              <div className="text-xs text-teal-100 font-medium opacity-80 uppercase tracking-wide">Hours Focused</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-sm font-medium block mb-1">Daily Exercise Goal</span>
                <span className="text-xs text-teal-200">75% completed</span>
              </div>
              <span className="text-xl font-bold">75%</span>
            </div>
            <div className="w-full bg-black/20 rounded-full h-3 overflow-hidden p-[2px]">
              <div className="bg-gradient-to-r from-teal-200 to-white h-full rounded-full shadow-lg" style={{ width: '75%' }}></div>
            </div>
            <p className="text-xs text-center text-teal-100 mt-2">Almost there! just 15 more minutes to go.</p>
          </div>
        </div>

        {/* Health Stats */}
        <div className="space-y-4 pl-2">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border border-white/20 shrink-0">
              <Icon name="activity" size="sm" className="text-teal-200" />
            </div>
            <span className="text-base text-teal-50 font-medium">Track your daily activities automatically</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border border-white/20 shrink-0">
              <Icon name="chart" size="sm" className="text-teal-200" />
            </div>
            <span className="text-base text-teal-50 font-medium">Monitor your progress with simple charts</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border border-white/20 shrink-0">
              <Icon name="users" size="sm" className="text-teal-200" />
            </div>
            <span className="text-base text-teal-50 font-medium">Join supportive health communities</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HealthPreview