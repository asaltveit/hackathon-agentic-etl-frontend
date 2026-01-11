'use client';


import { use } from 'react';
import Link from 'next/link';
import { RunSummary } from '@/components/pipeline/RunSummary';
import { StepTimeline } from '@/components/pipeline/StepTimeline';
import { StepInspector } from '@/components/pipeline/StepInspector';
import { EvidenceDrawer } from '@/components/evidence/EvidenceDrawer';
import { ExplainabilityChat } from '@/components/chat/ExplainabilityChat';
import { useSelectedStep } from '@/hooks/useSelectedStep';
import { useEvidence } from '@/hooks/useEvidence';
import { mockRun } from '@/lib/mockData';

interface PageProps {
  params: Promise<{ runId: string }>;
}

export default function RunPage({ params }: PageProps) {
  const { runId } = use(params);
  const { selectedStepId, setSelectedStepId } = useSelectedStep(mockRun.steps[1]?.stepId);
  const { isOpen, evidence, openEvidence, closeEvidence } = useEvidence();

  const selectedStep = mockRun.steps.find(s => s.stepId === selectedStepId);

  const handleCitationClick = (reference: any) => {
    setSelectedStepId(reference.stepId);
    openEvidence(reference);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden relative">
      <div className="absolute left-4 top-4 z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back
        </Link>
      </div>
      <div className="mx-auto max-w-6xl w-full px-3 sm:px-4 py-2 flex-shrink-0">
        <RunSummary run={mockRun} />
      </div>
      
      <div className="mx-auto max-w-6xl w-full px-3 sm:px-4 py-2 flex-shrink-0">
        <StepTimeline
          steps={mockRun.steps}
          selectedStepId={selectedStepId}
          onStepSelect={setSelectedStepId}
        />
      </div>
      
      <div className="flex-1 min-h-0 mx-auto max-w-6xl w-full px-3 sm:px-4 pb-3">
        <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div className="lg:col-span-2 min-h-0 overflow-y-auto">
            {selectedStep ? (
              <StepInspector
                step={selectedStep}
                onArtifactSelect={(artifactName) => {
                  openEvidence({
                    runId,
                    stepId: selectedStep.stepId,
                    artifactName,
                    type: 'artifact'
                  });
                }}
              />
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg px-4 py-6 text-center">
                <p className="text-gray-500">Select a step from the timeline to view details</p>
              </div>
            )}
          </div>
          
          <div className="lg:col-span-1 min-h-0 flex flex-col">
            <ExplainabilityChat
              runId={runId}
              onCitationClick={handleCitationClick}
            />
          </div>
        </div>
      </div>
      
      <EvidenceDrawer
        isOpen={isOpen}
        evidence={evidence}
        onClose={closeEvidence}
      />
    </div>
  );
}