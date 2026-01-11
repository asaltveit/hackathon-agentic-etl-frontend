// components/pipeline/StepInspector.tsx
'use client';

import React, { useState } from 'react';
import { Step } from '@/types/pipeline';
import { Card } from '@/components/ui/Card';
import { Tabs } from '@/components/ui/Tabs';
import { ArtifactViewer } from '@/components/evidence/ArtifactViewer';
import { MetricTable } from '@/components/evidence/MetricTable';

interface StepInspectorProps {
  step: Step;
  onArtifactSelect: (artifactName: string) => void;
}

export function StepInspector({ step, onArtifactSelect }: StepInspectorProps) {
  const [selectedArtifact, setSelectedArtifact] = useState<string | null>(null);

  const handleArtifactClick = (artifactName: string) => {
    setSelectedArtifact(artifactName);
    onArtifactSelect(artifactName);
  };

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      content: (
        <div className="space-y-2">
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-0.5">Agent</h4>
            <p className="text-sm text-gray-900">
              {step.agentName} <span className="text-gray-500">{step.agentVersion}</span>
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-0.5">Duration</h4>
            <p className="text-sm text-gray-900">{step.duration}s</p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-0.5">Rows</h4>
            <p className="text-sm text-gray-900">
              Input: {step.inputRows.toLocaleString()} → Output: {step.outputRows.toLocaleString()}
              {step.outputRows !== step.inputRows && (
                <span className={`ml-2 font-medium ${step.outputRows < step.inputRows ? 'text-red-600' : 'text-green-600'}`}>
                  ({step.outputRows - step.inputRows > 0 ? '+' : ''}{(step.outputRows - step.inputRows).toLocaleString()})
                </span>
              )}
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-0.5">Rationale</h4>
            <p className="text-sm text-gray-900 bg-gray-50 px-3 py-1.5 rounded border border-gray-200">
              {step.rationale}
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'artifacts',
      label: `Artifacts (${step.artifacts.length})`,
      content: (
        <div className="space-y-2">
          {step.artifacts.map(artifact => (
            <button
              key={artifact.name}
              onClick={() => handleArtifactClick(artifact.name)}
              className={`w-full text-left px-3 py-2 rounded border transition-colors ${
                selectedArtifact === artifact.name
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{artifact.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {artifact.type.toUpperCase()}
                    {artifact.rowCount && ` • ${artifact.rowCount.toLocaleString()} rows`}
                    {artifact.columnCount && ` • ${artifact.columnCount} cols`}
                  </p>
                </div>
                <span className="text-gray-400">→</span>
              </div>
            </button>
          ))}
        </div>
      )
    },
    {
      id: 'metrics',
      label: `Metrics (${step.metrics.length})`,
      content: <MetricTable metrics={step.metrics} />
    },
    {
      id: 'checks',
      label: `Checks (${step.checks.length})`,
      content: (
        <div className="space-y-2">
          {step.checks.map((check, index) => {
            // Determine if check should be shown as error/warning based on severity or failures
            const hasError = check.severity === 'error' || (check.failureCount !== undefined && check.failureCount > 0);
            const hasWarning = check.severity === 'warning';
            const isPassed = check.status === 'passed' && !hasError && !hasWarning;
            
            return (
              <div
                key={index}
                className={`px-3 py-2 rounded border ${
                  isPassed
                    ? 'border-green-200 bg-green-50'
                    : hasError
                    ? 'border-red-200 bg-red-50'
                    : hasWarning
                    ? 'border-yellow-200 bg-yellow-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={
                      isPassed ? 'text-green-600' : 
                      hasError ? 'text-red-600' : 
                      hasWarning ? 'text-yellow-600' : 
                      'text-gray-600'
                    }>
                      {isPassed ? '✓' : hasError ? '✗' : hasWarning ? '⚠' : '○'}
                    </span>
                    <span className="text-sm font-medium text-gray-900">{check.name}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    check.severity === 'error' ? 'bg-red-100 text-red-700' :
                    check.severity === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {check.severity}
                  </span>
                </div>
                {check.failureCount !== undefined && check.failureCount > 0 && (
                  <p className="text-sm text-gray-600 mt-0.5">
                    {check.failureCount.toLocaleString()} failures
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )
    }
  ];

  return (
    <Card>
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-gray-900">{step.name}</h3>
        <p className="text-sm text-gray-500 mt-0.5">Step ID: {step.stepId}</p>
      </div>
      <Tabs tabs={tabs} defaultTab="overview" />
    </Card>
  );
}