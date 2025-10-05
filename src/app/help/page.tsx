import { Card, Button, Icon } from '@/components/ui';

export default function HelpPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-dark mb-2">Help & Support</h1>
          <p className="text-neutral-medium">Get help and support for your health journey</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6">
            <h2 className="text-xl font-bold text-neutral-dark mb-4">Contact Support</h2>
            <p className="text-neutral-medium mb-4">Get in touch with our support team</p>
            <Button variant="primary" size="lg" className="w-full">
              <Icon name="phone" size="sm" className="mr-2" />
              Call Support
            </Button>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold text-neutral-dark mb-4">FAQ</h2>
            <p className="text-neutral-medium mb-4">Find answers to common questions</p>
            <Button variant="outline" size="lg" className="w-full">
              <Icon name="helpCircle" size="sm" className="mr-2" />
              View FAQ
            </Button>
          </Card>
        </div>
      </div>
  );
}