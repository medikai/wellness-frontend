import React from 'react';
import { Card } from '@/components/ui';
import { Star } from 'lucide-react';

interface TestimonialCardProps {
  name: string;
  role: string;
  content: string;
  rating: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ name, role, content, rating }) => {
  return (
    <Card className="p-6 h-full">
      <div className="flex items-center gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${
              i < rating ? 'fill-teal-primary text-teal-primary' : 'text-neutral-light'
            }`}
          />
        ))}
      </div>
      <p className="text-neutral-medium mb-6 leading-relaxed">{content}</p>
      <div>
        <p className="font-semibold text-neutral-dark">{name}</p>
        <p className="text-sm text-neutral-medium">{role}</p>
      </div>
    </Card>
  );
};

export default TestimonialCard;

