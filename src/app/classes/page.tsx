// import React from 'react'
// import ClassesTemplates from '@/modules/classes/templates'

// export default function ClassesPage() {
//   return <ClassesTemplates />
// }

//src/app/classes/page.tsx
import UpcomingClasses from './UpcomingClasses';

export default function ClassesPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold text-[#2C4A52]">My Classes</h1>
      <p className="text-[#6B7280] mb-6">
        View your booked demo sessions and join live meetings.
      </p>
      <UpcomingClasses />
    </main>
  );
}
