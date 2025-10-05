import { Card, Button, Icon } from '@/components/ui';

export default function CommunityPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-dark mb-2">Community</h1>
          <p className="text-neutral-medium">Connect with other health enthusiasts and share your journey</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6">
            <h2 className="text-xl font-bold text-neutral-dark mb-4">Discussion Forums</h2>
            <p className="text-neutral-medium mb-4">Join conversations about health and wellness</p>
            <Button variant="primary" size="lg" className="w-full">
              <Icon name="users" size="sm" className="mr-2" />
              Join Discussion
            </Button>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold text-neutral-dark mb-4">Success Stories</h2>
            <p className="text-neutral-medium mb-4">Read inspiring stories from community members</p>
            <Button variant="outline" size="lg" className="w-full">
              <Icon name="heart" size="sm" className="mr-2" />
              Read Stories
            </Button>
          </Card>
        </div>
      </div>
  );
}