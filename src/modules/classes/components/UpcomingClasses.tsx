import React from 'react'
import { Card, Button } from '@/components/ui'
import { useRouter } from 'next/navigation'

interface BookedClass {
  id: string;
  slotId?: string;
  date: string;
  time: string;
  type: string;
  bookedAt: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

interface UpcomingClassesProps {
  upcomingClasses: BookedClass[];
  formatClassDate: (date: string, time: string) => string;
}

const UpcomingClasses: React.FC<UpcomingClassesProps> = ({ upcomingClasses, formatClassDate }) => {
  const router = useRouter();
  
  if (upcomingClasses.length === 0) return null;

  const handleJoinClass = (classItem: BookedClass) => {
    // For demo classes, redirect to self-paced session
    if (classItem.type === 'demo') {
      router.push('/self-paced');
    } else {
      // For live classes, redirect to join page
      router.push('/join');
    }
  };


  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-[#2C4A52] mb-6">Upcoming Classes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {upcomingClasses.map((classItem) => (
          <Card key={classItem.id} hover className="p-6 border-l-4 border-[#4CAF9D]">
            <div className="mb-4">
              <span className="text-sm text-[#4CAF9D] font-medium">UPCOMING</span>
              <h3 className="text-xl font-bold text-[#2C4A52] mt-1">
                {classItem.type === 'demo' ? 'Demo Class' : 'Health & Wellness Class'}
              </h3>
              <p className="text-[#6B7280] mt-1">
                {formatClassDate(classItem.date, classItem.time)}
              </p>
            </div>
            <p className="text-sm text-[#6B7280] mb-4">
              {classItem.type === 'demo' 
                ? 'Experience our health and wellness classes with this free demo session.'
                : 'Join our live health and wellness class designed for your needs.'
              }
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#6B7280]">
                {classItem.type === 'demo' ? 'Free Demo' : 'Included in Plan'}
              </span>
              <Button 
                variant="primary" 
                size="md"
                onClick={() => handleJoinClass(classItem)}
              >
                {classItem.type === 'demo' ? 'Start Self-Paced' : 'Join Class'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default UpcomingClasses