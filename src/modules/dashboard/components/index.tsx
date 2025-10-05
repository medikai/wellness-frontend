import React from 'react'
import Header from './Header'
import WelcomeSection from './WelcomeSection'
import LiveClassCard from './LiveClassCard'
import ProgressCard from './ProgressCard'
import TextSizeControl from './TextSizeControl'
import ActionButtons from './ActionButtons'

const Dashboard = () => {
  return (
    <>
      <Header />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <WelcomeSection />
          <LiveClassCard />
          <ProgressCard />
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          <TextSizeControl />
          <ActionButtons />
        </div>
      </div>
    </>
  )
}

export default Dashboard