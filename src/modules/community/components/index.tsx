import React from 'react'
import Header from './Header'
import DiscussionForums from './DiscussionForums'
import SuccessStories from './SuccessStories'

const Community = () => {
  return (
    <>
      <Header />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <DiscussionForums />
        <SuccessStories />
      </div>
    </>
  )
}

export default Community