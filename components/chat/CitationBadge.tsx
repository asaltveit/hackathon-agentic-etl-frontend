// components/chat/CitationBadge.tsx
'use client';

import React from 'react';
import { Citation } from '@/types/chat';
import { formatCitationNumber } from '@/lib/citationUtils';

interface CitationBadgeProps {
  citation: Citation;
  onClick: () => void;
}

export function CitationBadge({ citation, onClick }: CitationBadgeProps) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
      title={citation.label}
    >
      <span className="text-xs align-super">{formatCitationNumber(citation.number)}</span>
    </button>
  );
}