import { Card, ProgressBar, Icon } from '@/components/ui';

export default function ProgressPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-dark mb-2">Your Progress</h1>
          <p className="text-neutral-medium">Track your health journey and celebrate achievements</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Progress Stats */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-neutral-dark mb-6">Weekly Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-neutral-dark">Classes Completed</span>
                    <span className="text-sm text-teal-primary font-bold">3/5</span>
                  </div>
                  <ProgressBar value={60} color="teal" showLabel label="Weekly Goal" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-neutral-dark">Exercise Minutes</span>
                    <span className="text-sm text-orange-primary font-bold">120/150</span>
                  </div>
                  <ProgressBar value={80} color="orange" showLabel label="Weekly Goal" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-neutral-dark">Meditation Sessions</span>
                    <span className="text-sm text-teal-primary font-bold">4/7</span>
                  </div>
                  <ProgressBar value={57} color="teal" showLabel label="Daily Goal" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-neutral-dark">Water Intake</span>
                    <span className="text-sm text-orange-primary font-bold">6/8</span>
                  </div>
                  <ProgressBar value={75} color="orange" showLabel label="Daily Goal" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold text-neutral-dark mb-6">Recent Activities</h2>
              <div className="space-y-4">
                {[
                  { activity: 'Yoga for Joints', time: '2 hours ago', points: '+50' },
                  { activity: 'Meditation Session', time: 'Yesterday', points: '+30' },
                  { activity: 'Chair Exercises', time: '2 days ago', points: '+40' },
                  { activity: 'Health Quiz', time: '3 days ago', points: '+25' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-neutral-light rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Icon name="heart" size="md" color="#4CAF9D" />
                      <div>
                        <p className="text-sm font-medium text-neutral-dark">{item.activity}</p>
                        <p className="text-xs text-neutral-medium">{item.time}</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-teal-primary">{item.points}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-bold text-neutral-dark mb-4">This Month</h3>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-teal-primary">12</div>
                  <div className="text-sm text-neutral-medium">Classes Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-primary">480</div>
                  <div className="text-sm text-neutral-medium">Exercise Minutes</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-teal-primary">18</div>
                  <div className="text-sm text-neutral-medium">Meditation Sessions</div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-bold text-neutral-dark mb-4">Streaks</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-dark">Daily Exercise</span>
                  <span className="text-sm font-bold text-teal-primary">5 days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-dark">Meditation</span>
                  <span className="text-sm font-bold text-orange-primary">3 days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-dark">Water Intake</span>
                  <span className="text-sm font-bold text-teal-primary">7 days</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-bold text-neutral-dark mb-4">Achievements</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Icon name="check" size="sm" color="#4CAF9D" />
                  <span className="text-sm text-neutral-dark">First Week Complete</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="check" size="sm" color="#4CAF9D" />
                  <span className="text-sm text-neutral-dark">Meditation Master</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="check" size="sm" color="#4CAF9D" />
                  <span className="text-sm text-neutral-dark">Exercise Enthusiast</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
  );
}