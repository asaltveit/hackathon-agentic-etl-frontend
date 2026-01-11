// lib/citationUtils.ts
import { Citation, ChatAnswer } from '@/types/chat';
import { EvidenceReference } from '@/types/evidence';

export function parseCitationsFromText(text: string, references: EvidenceReference[]): ChatAnswer {
  // Simple parser that looks for citation markers like ¹ ² ³
  const citationMarkers = text.match(/[¹²³⁴⁵⁶⁷⁸⁹]/g) || [];
  
  const citations: Citation[] = references.map((ref, index) => ({
    id: `citation-${index}`,
    number: index + 1,
    reference: ref,
    label: generateCitationLabel(ref)
  }));

  return {
    text,
    citations,
    hasEvidence: citations.length > 0
  };
}

export function generateCitationLabel(ref: EvidenceReference): string {
  const parts: string[] = [];
  
  if (ref.type === 'metric' && ref.metricKey) {
    parts.push(`Metric: ${ref.metricKey}`);
  } else if (ref.type === 'artifact' && ref.artifactName) {
    parts.push(`Artifact: ${ref.artifactName}`);
  } else if (ref.type === 'step') {
    parts.push('Step');
  } else if (ref.type === 'rationale') {
    parts.push('Rationale');
  }
  
  parts.push(`(${ref.stepId})`);
  
  return parts.join(' ');
}

export function formatCitationNumber(num: number): string {
  const superscripts = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'];
  return num.toString().split('').map(d => superscripts[parseInt(d)]).join('');
}