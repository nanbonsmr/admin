import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  color?: string;
  bgColor?: string;
}

export default function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  changeType = 'neutral',
  color = 'text-blue-600',
  bgColor = 'bg-blue-50'
}: StatCardProps) {
  const changeColors = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600'
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`${bgColor} p-3 rounded-lg`}>
          <Icon className={color} size={24} />
        </div>
        {change && (
          <div className={`text-sm font-medium ${changeColors[changeType]}`}>
            {change}
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-600 font-medium">{title}</div>
    </div>
  );
}