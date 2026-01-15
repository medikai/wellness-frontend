import React from 'react'
import Logo from './Logo'
import LoginForm from './LoginForm'
import HealthPreview from './HealthPreview'

const Login = () => {
  return (
    <div className="h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex overflow-hidden">
      {/* Left Side - Health Dashboard Preview - Hidden on mobile */}
      {/* <div className="hidden md:flex w-1/2 lg:w-5/12"> */}
      {/* <HealthPreview /> */}
      {/* </div> */}

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-4 md:px-8 md:py-8 overflow-y-auto">
        <div className="w-full max-w-3xl">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}

export default Login