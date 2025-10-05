import Link from 'next/link';
import { Icon } from '@/components/ui';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Icon name="heart" size="lg" color="#4CAF9D" />
          <h1 className="text-3xl font-bold text-neutral-dark">Health++</h1>
        </div>
        <h2 className="text-2xl font-bold text-neutral-dark mb-2">Page Not Found</h2>
        <p className="text-neutral-medium mb-6">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link 
          href="/"
          className="inline-flex items-center px-4 py-2 bg-teal-primary text-white rounded-lg hover:bg-teal-dark transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}