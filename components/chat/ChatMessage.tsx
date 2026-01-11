// components/chat/ChatMessage.tsx
'use client';

import React from 'react';
import { ChatMessage as ChatMessageType } from '@/types/chat';
import { CitationBadge } from './CitationBadge';

interface ChatMessageProps {
  message: ChatMessageType;
  onCitationClick: (citationId: string) => void;
}

export function ChatMessage({ message, onCitationClick }: ChatMessageProps) {
  if (message.role === 'user') {
    return (
      <div className="flex justify-end mb-1.5">
        <div className="bg-blue-600 text-white px-3 py-1.5 rounded-lg max-w-[80%]">
          <p className="text-sm">{message.content}</p>
        </div>
      </div>
    );
  }

  const answer = message.answer;
  if (!answer) return null;

  const renderTextWithCitations = () => {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    const citationRegex = /([¹²³⁴⁵⁶⁷⁸⁹])/g;
    let match;
    
    while ((match = citationRegex.exec(answer.text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(
          <span key={`text-${lastIndex}`}>
            {answer.text.substring(lastIndex, match.index)}
          </span>
        );
      }
      
      const citationNumber = '¹²³⁴⁵⁶⁷⁸⁹'.indexOf(match[1]) + 1;
      const citation = answer.citations.find(c => c.number === citationNumber);
      
      if (citation) {
        parts.push(
          <CitationBadge
            key={`citation-${citation.id}`}
            citation={citation}
            onClick={() => onCitationClick(citation.id)}
          />
        );
      }
      
      lastIndex = match.index + match[0].length;
    }
    
    if (lastIndex < answer.text.length) {
      parts.push(
        <span key={`text-${lastIndex}`}>
          {answer.text.substring(lastIndex)}
        </span>
      );
    }
    
    return parts;
  };

  const formatCitationNumber = (num: number): string => {
    const superscripts = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'];
    return num.toString().split('').map(d => superscripts[parseInt(d)]).join('');
  };

  return (
    <div className="flex justify-start mb-1.5">
      <div className="bg-gray-100 px-3 py-2 rounded-lg max-w-[80%]">
        <div className="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">
          {renderTextWithCitations()}
        </div>
        
        {answer.citations.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-200 space-y-1">
            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Citations
            </p>
            {answer.citations.map(citation => (
              <button
                key={citation.id}
                onClick={() => onCitationClick(citation.id)}
                className="block w-full text-left text-xs text-gray-600 hover:text-blue-600 hover:bg-gray-50 px-2.5 py-1 rounded transition-colors"
              >
                <span className="font-medium">{formatCitationNumber(citation.number)}</span> {citation.label}
                <span className="float-right text-gray-400">[View]</span>
              </button>
            ))}
          </div>
        )}
        
        {!answer.hasEvidence && (
          <div className="mt-2 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-xs text-yellow-800">
              ⚠ I don't have evidence for that. The pipeline didn't log it.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}