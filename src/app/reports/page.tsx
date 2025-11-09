import { Card, Button, Icon } from '@/components/ui';

export default function ReportsPage() {
  return (
    <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-dark mb-2">Health Reports</h1>
          <p className="text-neutral-medium">View detailed reports and analytics of your health journey</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6">
            <h2 className="text-xl font-bold text-neutral-dark mb-4">Weekly Report</h2>
            <p className="text-neutral-medium mb-4">Your health summary for this week</p>
            <Button variant="primary" size="lg" className="w-full">
              <Icon name="fileText" size="sm" className="mr-2" />
              Download PDF
            </Button>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold text-neutral-dark mb-4">Monthly Report</h2>
            <p className="text-neutral-medium mb-4">Comprehensive monthly health analysis</p>
            <Button variant="outline" size="lg" className="w-full">
              <Icon name="fileText" size="sm" className="mr-2" />
              Download PDF
            </Button>
          </Card>
        </div>
      </div>
  );
}