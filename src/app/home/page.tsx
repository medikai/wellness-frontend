//src/app/home/page.tsx
'use client';

import { Button, Card, ProgressBar, Icon } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import DemoClassBooking from '@/components/DemoClassBooking';

export default function HomePage() {
  const { user } = useAuth();

  if (user) {
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <DemoClassBooking />
        </div>
      );
    }

 
}

