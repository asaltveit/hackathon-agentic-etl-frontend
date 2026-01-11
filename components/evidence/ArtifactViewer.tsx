// components/evidence/ArtifactViewer.tsx
import React from 'react';
import { Artifact } from '@/types/pipeline';
import { Button } from '@/components/ui/Button';

interface ArtifactViewerProps {
  artifact: Artifact;
}

export function ArtifactViewer({ artifact }: ArtifactViewerProps) {
  const renderContent = () => {
    if (artifact.type === 'json') {
      return (
        <pre className="bg-gray-900 text-gray-100 px-6 py-4 rounded text-xs overflow-x-auto">
          {JSON.stringify(artifact.content, null, 2)}
        </pre>
      );
    }
    
    if (artifact.type === 'csv') {
      return (
        <pre className="bg-gray-50 px-6 py-4 rounded text-xs overflow-x-auto border border-gray-200">
          {typeof artifact.content === 'string' ? artifact.content : 'CSV content'}
        </pre>
      );
    }
    
    if (artifact.type === 'log') {
      return (
        <pre className="bg-gray-50 px-6 py-4 rounded text-xs overflow-x-auto border border-gray-200 font-mono">
          {typeof artifact.content === 'string' ? artifact.content : JSON.stringify(artifact.content)}
        </pre>
      );
    }
    
    return <p className="text-sm text-gray-500">Unsupported artifact type</p>;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-gray-900">{artifact.name}</h4>
          <p className="text-xs text-gray-500 mt-1">
            {artifact.type.toUpperCase()} • {(artifact.size / 1024).toFixed(1)} KB
            {artifact.rowCount && ` • ${artifact.rowCount.toLocaleString()} rows`}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button size="sm" variant="secondary">
            Copy
          </Button>
          <Button size="sm" variant="secondary">
            Download
          </Button>
        </div>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
}