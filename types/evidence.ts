// types/evidence.ts
export interface EvidenceReference {
    runId: string;
    stepId: string;
    artifactName?: string;
    metricKey?: string;
    type: 'artifact' | 'metric' | 'step' | 'rationale';
  }
  
  export interface EvidenceDetail {
    reference: EvidenceReference;
    stepName: string;
    content: unknown;
    timestamp: string;
}