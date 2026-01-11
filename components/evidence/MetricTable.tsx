// components/evidence/MetricTable.tsx
import React from 'react';
import { Metric } from '@/types/pipeline';

interface MetricTableProps {
  metrics: Metric[];
}

export function MetricTable({ metrics }: MetricTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-6 font-semibold text-gray-700">Metric</th>
            <th className="text-left py-3 px-6 font-semibold text-gray-700">Value</th>
            <th className="text-left py-3 px-6 font-semibold text-gray-700">Unit</th>
            <th className="text-left py-3 px-6 font-semibold text-gray-700">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {metrics.map((metric, index) => (
            <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-6 font-mono text-xs">{metric.key}</td>
              <td className="py-3 px-6 font-semibold text-gray-900">
                {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
              </td>
              <td className="py-3 px-6 text-gray-600">{metric.unit || '—'}</td>
              <td className="py-3 px-6 text-gray-600 text-xs">
                {new Date(metric.timestamp).toLocaleTimeString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}