import React from 'react'
import Logo from '../../register/components/Logo'
// import CoachRegisterForm from './CoachRegisterForm'
import HealthPreview from '../../register/components/HealthPreview'
import DemoClassBooking from '@/components/DemoClassBooking'

const ScheduleDemo = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Header Area */}
      <div className="w-full max-w-5xl mb-8 flex flex-col items-center text-center">
        <Logo className="mb-8 scale-110" />
      </div>

      {/* Main Content - Centered */}
      <div className="w-full max-w-6xl">
        <DemoClassBooking />
      </div>
    </div>
  )
}

export default ScheduleDemo