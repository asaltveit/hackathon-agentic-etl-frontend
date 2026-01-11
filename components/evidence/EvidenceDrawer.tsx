// components/evidence/EvidenceDrawer.tsx
'use client';

import React from 'react';
import { EvidenceDetail } from '@/types/evidence';
import { ArtifactViewer } from './ArtifactViewer';
import { Metric } from '@/types/pipeline';

interface EvidenceDrawerProps {
  isOpen: boolean;
  evidence: EvidenceDetail | null;
  onClose: () => void;
}

export function EvidenceDrawer({ isOpen, evidence, onClose }: EvidenceDrawerProps) {
  if (!isOpen || !evidence) return null;

  const renderContent = () => {
    if (evidence.reference.type === 'metric') {
      const metric = evidence.content as Metric;
      return (
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-semibold text-gray-700">Metric Key</h4>
            <p className="text-sm font-mono text-gray-900 mt-1">{metric.key}</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-700">Value</h4>
            <p className="text-lg font-bold text-gray-900 mt-1">
              {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
              {metric.unit && <span className="text-sm text-gray-500 ml-2">{metric.unit}</span>}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-700">Timestamp</h4>
            <p className="text-sm text-gray-900 mt-1">
              {new Date(metric.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
      );
    }

    if (evidence.reference.type === 'artifact' && evidence.reference.artifactName) {
      const artifact = {
        name: evidence.reference.artifactName,
        type: 'json' as const,
        size: JSON.stringify(evidence.content).length,
        content: evidence.content
      };
      return <ArtifactViewer artifact={artifact} />;
    }

    if (evidence.reference.type === 'rationale') {
      return (
        <div className="bg-gray-50 px-6 py-4 rounded border border-gray-200">
          <p className="text-sm text-gray-900">{evidence.content as string}</p>
        </div>
      );
    }

    return (
      <pre className="bg-gray-900 text-gray-100 px-6 py-4 rounded text-xs overflow-x-auto">
        {JSON.stringify(evidence.content, null, 2)}
      </pre>
    );
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-30 z-40"
        onClick={onClose}
      />
      
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-white shadow-2xl z-50 overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Evidence</h3>
            <p className="text-sm text-gray-500 mt-1">
              {evidence.stepName} • {evidence.reference.stepId}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none px-2"
          >
            ×
          </button>
        </div>
        
        <div className="px-8 py-6 space-y-5">
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Reference Type</h4>
            <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded">
              {evidence.reference.type}
            </span>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Content</h4>
            {renderContent()}
          </div>
        </div>
      </div>
    </>
  );
}