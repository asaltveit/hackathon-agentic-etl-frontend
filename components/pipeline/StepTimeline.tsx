// components/pipeline/StepTimeline.tsx
'use client';

import React from 'react';
import { Step } from '@/types/pipeline';

interface StepTimelineProps {
  steps: Step[];
  selectedStepId: string | null;
  onStepSelect: (stepId: string) => void;
}

export function StepTimeline({ steps, selectedStepId, onStepSelect }: StepTimelineProps) {
  const statusColors = {
    complete: 'bg-green-500',
    failed: 'bg-red-500',
    running: 'bg-yellow-500'
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Pipeline Steps</h3>
      
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute top-5 left-4 right-4 h-0.5 bg-gray-300" />
        
        {/* Steps */}
        <div className="relative flex justify-between px-4">
          {steps.map((step, index) => (
            <div key={step.stepId} className="flex flex-col items-center">
              <button
                onClick={() => onStepSelect(step.stepId)}
                className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  statusColors[step.status]
                } ${
                  selectedStepId === step.stepId
                    ? 'ring-4 ring-blue-300 scale-110'
                    : 'hover:scale-105'
                }`}
                title={step.name}
              >
                <span className="text-white text-xs font-bold">{index + 1}</span>
              </button>
              
              <div className="mt-2 text-center max-w-[100px]">
                <p className="text-xs font-medium text-gray-900 truncate">
                  {step.name}
                </p>
                <p className="text-xs text-gray-500">
                  {Math.floor(step.duration)}s
                </p>
                {step.outputRows !== step.inputRows && (
                  <p className="text-xs text-red-600 font-medium">
                    {step.inputRows - step.outputRows > 0 ? '↓' : '↑'}{' '}
                    {Math.abs(step.inputRows - step.outputRows).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}