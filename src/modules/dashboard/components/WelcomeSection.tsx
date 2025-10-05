//src/modules/dashboard/components/WelcomeSection.tsx
'use client';
import React from 'react'
import { useAuth } from '@/contexts/AuthContext';

const WelcomeSection = () => {
  const { user } = useAuth();

  return (
    <div>
      <h2 className="text-3xl font-bold text-neutral-dark mb-2">
        {`Good morning, ${user?.name ?? 'friend'} 👋`}
      </h2>
      <p className="text-neutral-medium">
        Ready to start your health journey today?
      </p>
    </div>
  )
}

export default WelcomeSection