import { Card, Button, Icon, ProgressBar } from '@/components/ui';

export default function GamePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-dark mb-2">Health Games</h1>
          <p className="text-neutral-medium">Make your health journey fun with interactive games</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Game Stats */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-neutral-dark mb-4">Your Progress</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-neutral-dark">Weekly Streak</span>
                    <span className="text-sm text-teal-primary font-bold">5 days</span>
                  </div>
                  <ProgressBar value={71} color="teal" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-neutral-dark">Points Earned</span>
                    <span className="text-sm text-orange-primary font-bold">1,250 pts</span>
                  </div>
                  <ProgressBar value={62} color="orange" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-neutral-dark">Level Progress</span>
                    <span className="text-sm text-neutral-medium">Level 3</span>
                  </div>
                  <ProgressBar value={45} color="teal" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold text-neutral-dark mb-4">Achievements</h2>
              <div className="space-y-3">
                {[
                  { name: 'First Class', icon: 'heart', earned: true },
                  { name: 'Week Warrior', icon: 'heart', earned: true },
                  { name: 'Meditation Master', icon: 'heart', earned: false },
                  { name: 'Exercise Expert', icon: 'heart', earned: false },
                ].map((achievement) => (
                  <div key={achievement.name} className="flex items-center space-x-3">
                    <Icon 
                      name={achievement.icon} 
                      size="md" 
                      color={achievement.earned ? "#4CAF9D" : "#6B7280"} 
                    />
                    <span className={`text-sm ${achievement.earned ? 'text-neutral-dark' : 'text-neutral-medium'}`}>
                      {achievement.name}
                    </span>
                    {achievement.earned && (
                      <Icon name="check" size="sm" color="#4CAF9D" />
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Available Games */}
          <div className="space-y-6">
            <Card hover className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-neutral-dark">Memory Challenge</h3>
                  <p className="text-neutral-medium mt-1">Test your memory with health-related cards</p>
                </div>
                <div className="w-12 h-12 bg-teal-light rounded-lg flex items-center justify-center">
                  <Icon name="heart" size="lg" color="#4CAF9D" />
                </div>
              </div>
              <p className="text-sm text-neutral-medium mb-4">
                Match pairs of cards to improve your memory and earn points.
              </p>
              <Button variant="primary" size="lg" className="w-full">
                Play Now
              </Button>
            </Card>

            <Card hover className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-neutral-dark">Health Quiz</h3>
                  <p className="text-neutral-medium mt-1">Test your health knowledge</p>
                </div>
                <div className="w-12 h-12 bg-orange-light rounded-lg flex items-center justify-center">
                  <Icon name="heart" size="lg" color="#F58220" />
                </div>
              </div>
              <p className="text-sm text-neutral-medium mb-4">
                Answer questions about nutrition, exercise, and wellness.
              </p>
              <Button variant="outline" size="lg" className="w-full">
                Start Quiz
              </Button>
            </Card>

            <Card hover className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-neutral-dark">Step Counter</h3>
                  <p className="text-neutral-medium mt-1">Track your daily steps</p>
                </div>
                <div className="w-12 h-12 bg-teal-light rounded-lg flex items-center justify-center">
                  <Icon name="heart" size="lg" color="#4CAF9D" />
                </div>
              </div>
              <p className="text-sm text-neutral-medium mb-4">
                Complete daily step goals to unlock rewards and achievements.
              </p>
              <Button variant="outline" size="lg" className="w-full">
                Track Steps
              </Button>
            </Card>
          </div>
        </div>
      </div>
  );
}