// lib/mockData.ts
import { PipelineRun, SchemaChange, RuleFailure, ColumnStats } from '@/types/pipeline';

export const mockRun: PipelineRun = {
  runId: 'run_abc123',
  status: 'complete',
  startTime: '2024-01-10T10:00:00Z',
  endTime: '2024-01-10T10:04:32Z',
  duration: 272,
  totalRows: 45234,
  rowsDropped: 2340,
  schemaChanges: 3,
  rulesFailed: 2,
  steps: [
    {
      stepId: 'step_load_001',
      name: 'Load Data',
      agentName: 'LoaderAgent',
      agentVersion: 'v1.0',
      status: 'complete',
      startTime: '2024-01-10T10:00:00Z',
      endTime: '2024-01-10T10:00:45Z',
      duration: 45,
      inputRows: 0,
      outputRows: 45234,
      rationale: 'Loaded data from CSV source',
      artifacts: [
        {
          name: 'raw_data.csv',
          type: 'csv',
          size: 2048576,
          rowCount: 45234,
          columnCount: 12,
          content: 'email,age,status,name,signup_date\ntest@example.com,25,active,John,2024-01-01\n...'
        }
      ],
      metrics: [
        { key: 'rows_loaded', value: 45234, timestamp: '2024-01-10T10:00:45Z' },
        { key: 'load_duration_ms', value: 45000, unit: 'ms', timestamp: '2024-01-10T10:00:45Z' }
      ],
      checks: [
        { name: 'File exists', status: 'passed', severity: 'error' },
        { name: 'Valid CSV format', status: 'passed', severity: 'error' }
      ]
    },
    {
      stepId: 'step_clean_002',
      name: 'Data Cleaning',
      agentName: 'CleaningAgent',
      agentVersion: 'v2.3',
      status: 'complete',
      startTime: '2024-01-10T10:00:45Z',
      endTime: '2024-01-10T10:01:57Z',
      duration: 72,
      inputRows: 45234,
      outputRows: 42894,
      rationale: 'Removed rows with invalid email format and normalized null values',
      artifacts: [
        {
          name: 'input_data.csv',
          type: 'csv',
          size: 2048576,
          rowCount: 45234,
          columnCount: 12,
          content: 'email,age,status,name\ntest@example.com,25,active,John\n...'
        },
        {
          name: 'output_data.csv',
          type: 'csv',
          size: 1945600,
          rowCount: 42894,
          columnCount: 12,
          content: 'email,age,status,name\ntest@example.com,25,active,John\nvalid@test.com,30,active,Jane\n...'
        },
        {
          name: 'dropped_rows.json',
          type: 'json',
          size: 102400,
          content: {
            reason: 'invalid_email',
            count: 2340,
            sample_ids: ['1234', '1235', '1236'],
            samples: [
              { row_id: '1234', email: 'invalid@', reason: 'no domain' },
              { row_id: '1235', email: '@@test', reason: 'invalid format' },
              { row_id: '1236', email: 'nodomain', reason: 'missing @' }
            ]
          }
        },
        {
          name: 'rules.json',
          type: 'json',
          size: 4096,
          content: {
            email_format: {
              pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
              description: 'Validates email structure (local@domain)'
            }
          }
        }
      ],
      metrics: [
        { key: 'rows_processed', value: 45234, timestamp: '2024-01-10T10:01:57Z' },
        { key: 'rows_dropped', value: 2340, timestamp: '2024-01-10T10:01:57Z' },
        { key: 'validation_errors', value: 2340, timestamp: '2024-01-10T10:01:57Z' }
      ],
      checks: [
        { name: 'Schema validation', status: 'passed', severity: 'error' },
        { name: 'Email format', status: 'failed', failureCount: 2340, severity: 'error' },
        { name: 'Age range', status: 'failed', failureCount: 5, severity: 'warning' }
      ]
    },
    {
      stepId: 'step_validate_003',
      name: 'Validation',
      agentName: 'ValidationAgent',
      agentVersion: 'v1.5',
      status: 'complete',
      startTime: '2024-01-10T10:01:57Z',
      endTime: '2024-01-10T10:02:30Z',
      duration: 33,
      inputRows: 42894,
      outputRows: 42894,
      rationale: 'Validated data quality with threshold=0.8',
      artifacts: [
        {
          name: 'validation_report.json',
          type: 'json',
          size: 8192,
          content: {
            threshold: 0.8,
            quality_score: 0.95,
            passed: true
          }
        }
      ],
      metrics: [
        { key: 'quality_score', value: 0.95, timestamp: '2024-01-10T10:02:30Z' },
        { key: 'threshold', value: 0.8, timestamp: '2024-01-10T10:02:30Z' }
      ],
      checks: [
        { name: 'Quality threshold', status: 'passed', severity: 'error' }
      ]
    },
    {
      stepId: 'step_transform_004',
      name: 'Transform',
      agentName: 'TransformAgent',
      agentVersion: 'v3.1',
      status: 'complete',
      startTime: '2024-01-10T10:02:30Z',
      endTime: '2024-01-10T10:03:45Z',
      duration: 75,
      inputRows: 42894,
      outputRows: 42894,
      rationale: 'Normalized status field to enum for validation and added computed score',
      artifacts: [
        {
          name: 'schema_input.json',
          type: 'json',
          size: 2048,
          content: {
            columns: [
              { name: 'email', type: 'string(255)' },
              { name: 'age', type: 'int' },
              { name: 'status', type: 'string(50)' },
              { name: 'name', type: 'string(255)' },
              { name: 'legacy_id', type: 'int' }
            ]
          }
        },
        {
          name: 'schema_output.json',
          type: 'json',
          size: 2560,
          content: {
            columns: [
              { name: 'email', type: 'string(255)' },
              { name: 'age', type: 'int' },
              { name: 'status', type: 'enum(active,inactive,pending)' },
              { name: 'name', type: 'string(255)' },
              { name: 'signup_date', type: 'datetime' },
              { name: 'user_score', type: 'float' }
            ],
            changes: {
              added_cols: ['signup_date', 'user_score'],
              removed_cols: ['legacy_id'],
              changed_cols: [{ name: 'status', from: 'string(50)', to: 'enum(active,inactive,pending)' }]
            }
          }
        }
      ],
      metrics: [
        { key: 'columns_added', value: 2, timestamp: '2024-01-10T10:03:45Z' },
        { key: 'columns_removed', value: 1, timestamp: '2024-01-10T10:03:45Z' },
        { key: 'columns_modified', value: 1, timestamp: '2024-01-10T10:03:45Z' }
      ],
      checks: [
        { name: 'Schema compatibility', status: 'passed', severity: 'warning' }
      ]
    },
    {
      stepId: 'step_publish_005',
      name: 'Publish',
      agentName: 'PublishAgent',
      agentVersion: 'v1.0',
      status: 'complete',
      startTime: '2024-01-10T10:03:45Z',
      endTime: '2024-01-10T10:04:32Z',
      duration: 47,
      inputRows: 42894,
      outputRows: 42894,
      rationale: 'Published data to output destination',
      artifacts: [
        {
          name: 'publish_log.json',
          type: 'json',
          size: 1024,
          content: {
            destination: 's3://bucket/output.csv',
            status: 'success'
          }
        }
      ],
      metrics: [
        { key: 'rows_published', value: 42894, timestamp: '2024-01-10T10:04:32Z' }
      ],
      checks: [
        { name: 'Destination reachable', status: 'passed', severity: 'error' }
      ]
    }
  ]
};

export const mockSchemaChanges: SchemaChange[] = [
  {
    columnName: 'signup_date',
    changeType: 'added',
    afterType: 'datetime',
    stepId: 'step_transform_004'
  },
  {
    columnName: 'user_score',
    changeType: 'added',
    afterType: 'float',
    stepId: 'step_transform_004'
  },
  {
    columnName: 'legacy_id',
    changeType: 'removed',
    beforeType: 'int',
    stepId: 'step_transform_004'
  },
  {
    columnName: 'status',
    changeType: 'modified',
    beforeType: 'string(50)',
    afterType: 'enum(active,inactive,pending)',
    stepId: 'step_transform_004'
  }
];

export const mockRuleFailures: RuleFailure[] = [
  {
    ruleName: 'Email format',
    failureCount: 2340,
    severity: 'error',
    samples: [
      { rowId: '1234', value: 'invalid@', reason: 'no domain' },
      { rowId: '1235', value: '@@test', reason: 'invalid format' },
      { rowId: '1236', value: 'nodomain', reason: 'missing @' },
      { rowId: '1237', value: 'test@', reason: 'incomplete domain' },
      { rowId: '1238', value: '@example.com', reason: 'missing local part' }
    ]
  },
  {
    ruleName: 'Age range (0-120)',
    failureCount: 5,
    severity: 'warning',
    samples: [
      { rowId: '5001', value: '150', reason: 'exceeds maximum' },
      { rowId: '5002', value: '-5', reason: 'below minimum' },
      { rowId: '5003', value: '999', reason: 'exceeds maximum' }
    ]
  }
];

export const mockColumnStats: ColumnStats = {
  columnName: 'email',
  before: {
    total: 45234,
    nulls: 120,
    unique: 44890,
    invalid: 2340
  },
  after: {
    total: 42894,
    nulls: 0,
    unique: 42894,
    invalid: 0
  },
  changes: [
    'Dropped 2,340 rows with invalid email format',
    'Normalized 120 null values to empty string (later removed)'
  ]
};