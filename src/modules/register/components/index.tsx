import React from 'react'
import Logo from './Logo'
import RegisterForm from './RegisterForm'
import HealthPreview from './HealthPreview'

const Register = () => {
  return (
    <div className="h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex overflow-hidden">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-4 md:px-1 md:py-1 md:w-auto w-full border border-b-red-600">
        <div className="w-full md:w-3/4 max-w-3xl">
          <Logo />
          <RegisterForm />
        </div>
      </div>

      {/* Right Side - Health Dashboard Preview - Hidden on mobile */}
      <div className="hidden md:flex">
        <HealthPreview />
      </div>
    </div>
  )
}

export default Register