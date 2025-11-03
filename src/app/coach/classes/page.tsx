//src/app/coach/classes/page.tsx
import UpcomingClasses from '@/app/classes/UpcomingClasses';

export default function CoachClassesPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold text-[#2C4A52]">My Scheduled Classes</h1>
      <p className="text-[#6B7280] mb-6">
        Start or manage your upcoming demo sessions.
      </p>
      <UpcomingClasses />
    </main>
  );
}
