// import React from 'react'
// import ClassesTemplates from '@/modules/classes/templates'

import UpcomingClasses from "./UpcomingClasses";

// export default function ClassesPage() {
//   return <ClassesTemplates />
// }

//src/app/classes/page.tsx
// import UpcomingClasses from '@/modules/classes/components/UpcomingClasses';

export default function ClassesPage() {
  return (
    <main className="max-w-9xl mt-4 mx-auto px-8 sm:px-6 lg:px-16 py-12">
      <div className="mb-8 ">
        <h1 className="text-3xl font-bold text-neutral-dark mb-2">My Classes</h1>
        <p className="text-neutral-medium text-lg">
          View your booked demo sessions and join live meetings.
        </p>
      </div>
      <UpcomingClasses />
    </main>
  );
}
