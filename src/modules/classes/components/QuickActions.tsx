import React from 'react'
import { Card, Button, Icon } from '@/components/ui'
import { useRouter } from 'next/navigation'

const QuickActions = () => {
  const router = useRouter();

  const handleSelfPaced = () => {
    router.push('/self-paced');
  };

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-[#2C4A52] mb-6">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card hover className="p-6 text-center">
          <Icon name="gamepad" size="lg" color="#4CAF9D" className="mx-auto mb-4" />
          <h3 className="font-semibold text-[#2C4A52] mb-2">Book New Class</h3>
          <p className="text-sm text-[#6B7280] mb-4">Schedule your next health session</p>
          <Button variant="outline" size="default" className="w-full">
            Book Now
          </Button>
        </Card>

        <Card hover className="p-6 text-center">
          <Icon name="heart" size="lg" color="#4CAF9D" className="mx-auto mb-4" />
          <h3 className="font-semibold text-[#2C4A52] mb-2">View Progress</h3>
          <p className="text-sm text-[#6B7280] mb-4">Track your health journey</p>
          <Button variant="outline" size="default" className="w-full">
            View Progress
          </Button>
        </Card>

        <Card hover className="p-6 text-center">
          <Icon name="settings" size="lg" color="#4CAF9D" className="mx-auto mb-4" />
          <h3 className="font-semibold text-[#2C4A52] mb-2">Manage Classes</h3>
          <p className="text-sm text-[#6B7280] mb-4">Update your class preferences</p>
          <Button variant="outline" size="default" className="w-full">
            Manage
          </Button>
        </Card>

        <Card hover className="p-6 text-center">
          <Icon name="gamepad" size="lg" color="#4CAF9D" className="mx-auto mb-4" />
          <h3 className="font-semibold text-[#2C4A52] mb-2">Self-Paced Session</h3>
          <p className="text-sm text-[#6B7280] mb-4">Start a self-paced waylness session</p>
          <Button
            variant="default"
            size="default"
            className="w-full"
            onClick={handleSelfPaced}
          >
            Start Now
          </Button>
        </Card>
      </div>
    </div>
  )
}

export default QuickActions