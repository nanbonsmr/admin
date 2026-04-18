import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  color?: string;
  bgColor?: string;
}

export default function QuickActionCard({ 
  title, 
  description, 
  icon: Icon, 
  href,
  color = 'text-blue-600',
  bgColor = 'bg-blue-50'
}: QuickActionCardProps) {
  return (
    <Link 
      to={href}
      className="flex items-center space-x-3 p-4 rounded-lg hover:bg-gray-50 transition-colors group border border-gray-200"
    >
      <div className={`${bgColor} p-3 rounded-lg group-hover:scale-105 transition-transform`}>
        <Icon className={color} size={20} />
      </div>
      <div>
        <div className="text-sm font-medium text-gray-900">{title}</div>
        <div className="text-xs text-gray-500">{description}</div>
      </div>
    </Link>
  );
}