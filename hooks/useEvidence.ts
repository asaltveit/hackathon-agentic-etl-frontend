// hooks/useEvidence.ts
'use client';

import { useState } from 'react';
import { EvidenceReference, EvidenceDetail } from '@/types/evidence';
import { mockRun } from '@/lib/mockData';

export function useEvidence() {
  const [isOpen, setIsOpen] = useState(false);
  const [evidence, setEvidence] = useState<EvidenceDetail | null>(null);

  const openEvidence = (reference: EvidenceReference) => {
    // Find the step
    const step = mockRun.steps.find(s => s.stepId === reference.stepId);
    if (!step) return;

    let content: unknown = null;

    if (reference.type === 'artifact' && reference.artifactName) {
      const artifact = step.artifacts.find(a => a.name === reference.artifactName);
      content = artifact?.content;
    } else if (reference.type === 'metric' && reference.metricKey) {
      const metric = step.metrics.find(m => m.key === reference.metricKey);
      content = metric;
    } else if (reference.type === 'rationale') {
      content = step.rationale;
    } else {
      content = step;
    }

    setEvidence({
      reference,
      stepName: step.name,
      content,
      timestamp: step.endTime
    });
    setIsOpen(true);
  };

  const closeEvidence = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    evidence,
    openEvidence,
    closeEvidence
  };
}