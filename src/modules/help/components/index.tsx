import React from 'react'
import Header from './Header'
import ContactSupport from './ContactSupport'
import FAQ from './FAQ'

const Help = () => {
  return (
    <>
      <Header />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ContactSupport />
        <FAQ />
      </div>
    </>
  )
}

export default Help