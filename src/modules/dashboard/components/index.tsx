import React from 'react'
import Header from './Header'
import WelcomeSection from './WelcomeSection'
import LiveClassCard from './LiveClassCard'
import ProgressCard from './ProgressCard'
// import ActionButtons from './ActionButtons'
import AvailableGames from '@/modules/game/components/AvailableGames'
// import SelfPacedPage from '@/app/self-paced/page'
import SelfPacedCard from './SlefPaced'

const Dashboard = () => {
  return (
    <>
      <Header />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <WelcomeSection />
          <LiveClassCard />
          <SelfPacedCard />
          <ProgressCard />
        </div>

        {/* Right Column - Sidebar */}
        <div className="lg:col-span-2 space-y-6">
          <AvailableGames/>
        </div>
      </div>
    </>
  )
}

export default Dashboard