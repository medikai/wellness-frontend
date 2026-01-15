import React from 'react'
import Image from 'next/image'

const Logo = () => {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16">
          <Image
            src="/images/logo.png"
            alt="Waylness Icon"
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="relative h-12 w-48">
          <Image
            src="/images/logo_text.png"
            alt="Waylness"
            fill
            className="object-contain object-left"
            priority
          />
        </div>
      </div>
    </div>
  )
}

export default Logo