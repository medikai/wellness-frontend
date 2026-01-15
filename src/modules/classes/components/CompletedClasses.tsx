import React from 'react'
import { Card, Button } from '@/components/ui'

interface BookedClass {
  id: string;
  slotId?: string;
  date: string;
  time: string;
  type: string;
  bookedAt: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

interface CompletedClassesProps {
  completedClasses: BookedClass[];
  formatClassDate: (date: string, time: string) => string;
}

const CompletedClasses: React.FC<CompletedClassesProps> = ({ completedClasses, formatClassDate }) => {
  if (completedClasses.length === 0) return null;

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-[#2C4A52] mb-6">Completed Classes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {completedClasses.map((classItem) => (
          <Card key={classItem.id} className="p-6 border-l-4 border-green-500">
            <div className="mb-4">
              <span className="text-sm text-green-500 font-medium">COMPLETED</span>
              <h3 className="text-xl font-bold text-[#2C4A52] mt-1">
                {classItem.type === 'demo' ? 'Demo Class' : 'Health & waylness Class'}
              </h3>
              <p className="text-[#6B7280] mt-1">
                {formatClassDate(classItem.date, classItem.time)}
              </p>
            </div>
            <p className="text-sm text-[#6B7280] mb-4">
              Great job! You completed this class successfully.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-green-500 font-medium">
                ✓ Completed
              </span>
              <Button variant="outline" size="default">
                View Details
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default CompletedClasses