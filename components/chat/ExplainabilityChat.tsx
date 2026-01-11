// components/chat/ExplainabilityChat.tsx
'use client';

import React, { useState } from 'react';
import { ChatMessage as ChatMessageType } from '@/types/chat';
import { ChatMessage } from './ChatMessage';
import { Button } from '@/components/ui/Button';
import { parseCitationsFromText } from '@/lib/citationUtils';
import { EvidenceReference } from '@/types/evidence';

interface ExplainabilityChatProps {
  runId: string;
  onCitationClick: (reference: EvidenceReference) => void;
}

export function ExplainabilityChat({ runId, onCitationClick }: ExplainabilityChatProps) {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getMockResponse = (question: string): ChatMessageType => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('drop') || lowerQuestion.includes('removed')) {
      return {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: '',
        timestamp: new Date().toISOString(),
        answer: parseCitationsFromText(
          '2,340 rows were dropped because they failed email validation ¹.\n\nThis happened in the "Data Cleaning" step ², which applied the email_format rule ³. The rule checks for valid email structure (local@domain).\n\nSample failures ⁴:\n• row 1234: "invalid@" (no domain)\n• row 1235: "@@test" (invalid format)',
          [
            { runId, stepId: 'step_clean_002', metricKey: 'rows_dropped', type: 'metric' },
            { runId, stepId: 'step_clean_002', type: 'step' },
            { runId, stepId: 'step_clean_002', artifactName: 'rules.json', type: 'artifact' },
            { runId, stepId: 'step_clean_002', artifactName: 'dropped_rows.json', type: 'artifact' }
          ]
        )
      };
    }
    
    if (lowerQuestion.includes('schema') || lowerQuestion.includes('column')) {
      return {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: '',
        timestamp: new Date().toISOString(),
        answer: parseCitationsFromText(
          'The schema changed in the "Transform" step ¹:\n• Added 2 columns: signup_date, user_score ²\n• Removed 1 column: legacy_id ³\n• Changed type: status (string → enum) ⁴\n\nRationale ⁵: "Normalized status field to enum for validation and added computed score."',
          [
            { runId, stepId: 'step_transform_004', type: 'step' },
            { runId, stepId: 'step_transform_004', artifactName: 'schema_output.json', type: 'artifact' },
            { runId, stepId: 'step_transform_004', artifactName: 'schema_output.json', type: 'artifact' },
            { runId, stepId: 'step_transform_004', artifactName: 'schema_output.json', type: 'artifact' },
            { runId, stepId: 'step_transform_004', type: 'rationale' }
          ]
        )
      };
    }
    
    if (lowerQuestion.includes('rule') || lowerQuestion.includes('fail')) {
      return {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: '',
        timestamp: new Date().toISOString(),
        answer: parseCitationsFromText(
          '2 validation rules failed ¹:\n\n1. Email format: 2,340 failures ² (severity: ERROR)\n2. Age range: 5 failures ³ (severity: WARNING)\n\nThe email format rule ⁴ checks for valid email structure. Sample failures are logged in the dropped_rows artifact ⁵.',
          [
            { runId, stepId: 'step_clean_002', metricKey: 'validation_errors', type: 'metric' },
            { runId, stepId: 'step_clean_002', metricKey: 'validation_errors', type: 'metric' },
            { runId, stepId: 'step_clean_002', metricKey: 'validation_errors', type: 'metric' },
            { runId, stepId: 'step_clean_002', artifactName: 'rules.json', type: 'artifact' },
            { runId, stepId: 'step_clean_002', artifactName: 'dropped_rows.json', type: 'artifact' }
          ]
        )
      };
    }
    
    if (lowerQuestion.includes('threshold') || lowerQuestion.includes('simulate')) {
      return {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: '',
        timestamp: new Date().toISOString(),
        answer: {
          text: '⚠ I do not have simulation data for that threshold.\n\nThe pipeline logged validation with threshold=0.8 ¹, but did not run simulations for other values.\n\nTo answer this, you would need to:\n• Rerun the pipeline with threshold=0.5, or\n• Use the simulation feature (if enabled)',
          citations: [
            {
              id: 'cit-1',
              number: 1,
              reference: { runId, stepId: 'step_validate_003', metricKey: 'threshold', type: 'metric' },
              label: 'Metric: threshold (step_validate_003)'
            }
          ],
          hasEvidence: false
        }
      };
    }
    
    return {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
      answer: {
        text: '⚠ I do not have specific evidence to answer that question.\n\nThe pipeline logs steps, artifacts, metrics, and checks. I can help you understand:\n• What changed in the schema\n• Why rows were dropped\n• Which rules failed\n• Before/after statistics\n\nPlease ask a more specific question about the pipeline run.',
        citations: [],
        hasEvidence: false
      }
    };
  };

  const handleSend = async (question?: string) => {
    const questionToSend = question || input;
    if (!questionToSend.trim()) return;
    
    const userMessage: ChatMessageType = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: questionToSend,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    setTimeout(() => {
      const response = getMockResponse(questionToSend);
      setMessages(prev => [...prev, response]);
      setIsLoading(false);
    }, 500);
  };

  const handleCitationClick = (citationId: string) => {
    for (const message of messages) {
      if (message.answer) {
        const citation = message.answer.citations.find(c => c.id === citationId);
        if (citation) {
          onCitationClick(citation.reference);
          return;
        }
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border border-gray-200 rounded-lg">
      <div className="px-3 py-2 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900">Ask about this run</h3>
        <p className="text-xs text-gray-500 mt-0.5">
          All answers are grounded in logged evidence
        </p>
      </div>
      
      <div className="flex-1 overflow-y-auto px-3 py-2">
        {messages.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500 mb-2">
              Ask a question about this pipeline run
            </p>
            <div className="space-y-1">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleSend('Why were 2,340 rows dropped?');
                }}
                disabled={isLoading}
                className="block w-full text-left text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2.5 py-1.5 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Why were 2,340 rows dropped?
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleSend('What changed in the schema?');
                }}
                disabled={isLoading}
                className="block w-full text-left text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2.5 py-1.5 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                What changed in the schema?
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleSend('Which rules failed?');
                }}
                disabled={isLoading}
                className="block w-full text-left text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2.5 py-1.5 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Which rules failed?
              </button>
            </div>
          </div>
        ) : (
          messages.map(message => (
            <ChatMessage
              key={message.id}
              message={message}
              onCitationClick={handleCitationClick}
            />
          ))
        )}
        
        {isLoading && (
          <div className="flex justify-start mb-2">
            <div className="bg-gray-100 px-3 py-2 rounded-lg">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="px-3 py-2 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your question..."
            className="flex-1 px-2.5 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <Button onClick={() => handleSend()} disabled={isLoading || !input.trim()}>
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}