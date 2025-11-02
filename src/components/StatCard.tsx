import React from 'react';

interface StatCardProps {
  number: string;
  label: string;
  icon?: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ number, label, icon }) => {
  return (
    <div className="text-center">
      {icon && <div className="mb-4 flex justify-center">{icon}</div>}
      <div className="text-4xl lg:text-5xl font-bold text-teal-primary mb-2">{number}</div>
      <div className="text-lg text-muted-foreground">{label}</div>
    </div>
  );
};

export default StatCard;

