import React from 'react';

interface StepCardProps {
  number: string;
  title: string;
  description: string;
}

const StepCard: React.FC<StepCardProps> = ({ number, title, description }) => {
  return (
    <div className="flex gap-6 items-start">
      <div className="flex-shrink-0">
        <div className="w-20 h-20 bg-teal-primary rounded-full flex items-center justify-center text-white text-3xl font-bold">
          {number}
        </div>
      </div>
      <div className="flex-1">
        <h3 className="text-2xl font-bold text-neutral-dark mb-3">{title}</h3>
        <p className="text-lg text-neutral-medium">{description}</p>
      </div>
    </div>
  );
};

export default StepCard;

