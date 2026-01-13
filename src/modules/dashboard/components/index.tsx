import React from 'react'
import WelcomeSection from './WelcomeSection'
import LiveClassCard from './LiveClassCard'
import ProgressCard from './ProgressCard'
// import ActionButtons from './ActionButtons'
import AvailableGames from '@/modules/game/components/AvailableGames'
// import SelfPacedPage from '@/app/self-paced/page'
import SelfPacedCard from './SlefPaced'

const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <WelcomeSection />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <LiveClassCard />
        <SelfPacedCard />
        <AvailableGames />
        <ProgressCard />
      </div>
    </div>
  )
}

export default Dashboard