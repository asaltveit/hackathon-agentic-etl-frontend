// components/pipeline/RunSummary.tsx
import React from 'react';
import { PipelineRun } from '@/types/pipeline';
import { Card } from '@/components/ui/Card';

interface RunSummaryProps {
  run: PipelineRun;
}

export function RunSummary({ run }: RunSummaryProps) {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const statusColors = {
    complete: 'text-green-600',
    failed: 'text-red-600',
    running: 'text-yellow-600'
  };

  const statusIcons = {
    complete: '✓',
    failed: '✗',
    running: '⟳'
  };

  return (
    <Card>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className={`text-2xl ${statusColors[run.status]}`}>
                {statusIcons[run.status]}
              </span>
              <h2 className="text-xl font-semibold text-gray-900 capitalize">
                {run.status}
              </h2>
            </div>
            <p className="text-sm text-gray-500 mt-0.5">Run ID: {run.runId}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Duration</p>
            <p className="text-lg font-semibold text-gray-900 mt-0.5">
              {formatDuration(run.duration)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Processed</p>
            <p className="text-lg font-semibold text-gray-900 mt-0.5">
              {run.totalRows.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Rows Dropped</p>
            <p className="text-lg font-semibold text-red-600 mt-0.5">
              {run.rowsDropped.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Schema Changes</p>
            <p className="text-lg font-semibold text-gray-900 mt-0.5">
              {run.schemaChanges}
            </p>
          </div>
        </div>

        {run.rulesFailed > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded px-2.5 py-1.5">
            <p className="text-sm text-yellow-800">
              ⚠ {run.rulesFailed} validation rule{run.rulesFailed > 1 ? 's' : ''} failed
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}