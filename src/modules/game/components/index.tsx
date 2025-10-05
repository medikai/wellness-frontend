import React from 'react'
import Header from './Header'
import GameStats from './GameStats'
import AvailableGames from './AvailableGames'

const Game = () => {
  return (
    <>
      <Header />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GameStats />
        <AvailableGames />
      </div>
    </>
  )
}

export default Game