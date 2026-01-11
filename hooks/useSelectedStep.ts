// hooks/useSelectedStep.ts
'use client';

import { useState } from 'react';

export function useSelectedStep(initialStepId?: string) {
  const [selectedStepId, setSelectedStepId] = useState<string | null>(initialStepId || null);

  return {
    selectedStepId,
    setSelectedStepId,
    clearSelection: () => setSelectedStepId(null)
  };
}
