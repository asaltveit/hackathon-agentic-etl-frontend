// components/ui/Card.tsx
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export function Card({ children, className = '', title }: CardProps) {
  return (
    <div className={`bg-white border border-gray-200 rounded-lg ${className}`}>
      {title && (
        <div className="px-3 py-2 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">{title}</h3>
        </div>
      )}
      <div className="p-3">
        {children}
      </div>
    </div>
  );
}