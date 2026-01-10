// types/pipeline.ts
export interface PipelineRun {
    runId: string;
    status: 'complete' | 'failed' | 'running';
    startTime: string;
    endTime: string;
    duration: number; // seconds
    totalRows: number;
    rowsDropped: number;
    schemaChanges: number;
    rulesFailed: number;
    steps: Step[];
  }
  
  export interface Step {
    stepId: string;
    name: string;
    agentName: string;
    agentVersion: string;
    status: 'complete' | 'failed' | 'running';
    startTime: string;
    endTime: string;
    duration: number; // seconds
    inputRows: number;
    outputRows: number;
    rationale: string;
    artifacts: Artifact[];
    metrics: Metric[];
    checks: Check[];
  }
  
  export interface Artifact {
    name: string;
    type: 'csv' | 'json' | 'log';
    size: number; // bytes
    rowCount?: number;
    columnCount?: number;
    content: unknown; // Could be JSON object or CSV string
  }
  
  export interface Metric {
    key: string;
    value: number | string;
    unit?: string;
    timestamp: string;
  }
  
  export interface Check {
    name: string;
    status: 'passed' | 'failed';
    failureCount?: number;
    severity: 'error' | 'warning' | 'info';
  }
  
  export interface SchemaChange {
    columnName: string;
    changeType: 'added' | 'removed' | 'modified';
    beforeType?: string;
    afterType?: string;
    stepId: string;
  }
  
  export interface RuleFailure {
    ruleName: string;
    failureCount: number;
    severity: 'error' | 'warning';
    samples: Array<{
      rowId: string;
      value: string;
      reason: string;
    }>;
  }
  
  export interface ColumnStats {
    columnName: string;
    before: {
      total: number;
      nulls: number;
      unique: number;
      invalid?: number;
    };
    after: {
      total: number;
      nulls: number;
      unique: number;
      invalid?: number;
    };
    changes: string[];
  }