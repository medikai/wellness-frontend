import React from 'react';
import { Card } from '@/components/ui';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: 'primary' | 'secondary';
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, color }) => {
  const colorClasses = {
    primary: 'bg-teal-primary/10 text-teal-primary',
    secondary: 'bg-teal-light text-teal-dark',
  };

  return (
    <Card className="p-8">
      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${colorClasses[color]}`}>
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-2xl font-bold text-neutral-dark mb-3">{title}</h3>
      <p className="text-lg text-neutral-medium">{description}</p>
    </Card>
  );
};

export default FeatureCard;

