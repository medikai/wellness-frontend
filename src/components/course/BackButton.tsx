'use client'

import React from 'react'

interface BackButtonProps {
  label?: string
  onClick?: () => void
}

export default function BackButton({ label = 'Back', onClick }: BackButtonProps) {
  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      window.history.back()
    }
  }

  return (
    <button
      onClick={handleClick}
      className="text-blue-600 hover:text-blue-700 mb-2 flex items-center"
    >
      ← {label}
    </button>
  )
}
