import React from 'react'
import Logo from '../../register/components/Logo'
import CoachRegisterForm from './CoachRegisterForm'
import HealthPreview from '../../register/components/HealthPreview'

const CoachRegister = () => {
  return (
    <div className="h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex overflow-hidden">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-1 py-1">
        <div className="w-3/4 max-w-4xl">
          <Logo />
          <CoachRegisterForm />
        </div>
      </div>

      {/* Right Side - Health Dashboard Preview */}
      <HealthPreview />
    </div>
  )
}

export default CoachRegister