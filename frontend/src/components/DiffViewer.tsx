import React, { useState } from 'react';

interface DiffLine {
  lineNumber: number;
  content: string;
  type: 'addition' | 'deletion' | 'context';
}

interface DiffViewerProps {
  originalCode: string;
  suggestedCode: string;
  fileName: string;
  language: string;
  onAccept?: () => void;
  onReject?: () => void;
  className?: string;
}

const DiffViewer: React.FC<DiffViewerProps> = ({
  originalCode,
  suggestedCode,
  fileName,
  language,
  onAccept,
  onReject,
  className = ''
}) => {
  const [viewMode, setViewMode] = useState<'unified' | 'side-by-side'>('unified');

  const generateDiff = (original: string, suggested: string): DiffLine[] => {
    const originalLines = original.split('\n');
    const suggestedLines = suggested.split('\n');
    const diff: DiffLine[] = [];
    
    // Simple diff algorithm - in a real implementation you'd use a proper diff library
    const maxLines = Math.max(originalLines.length, suggestedLines.length);
    
    for (let i = 0; i < maxLines; i++) {
      const originalLine = originalLines[i] || '';
      const suggestedLine = suggestedLines[i] || '';
      
      if (originalLine === suggestedLine) {
        // Context line
        diff.push({
          lineNumber: i + 1,
          content: originalLine,
          type: 'context'
        });
      } else {
        // Show both original and suggested
        if (originalLine) {
          diff.push({
            lineNumber: i + 1,
            content: originalLine,
            type: 'deletion'
          });
        }
        if (suggestedLine) {
          diff.push({
            lineNumber: i + 1,
            content: suggestedLine,
            type: 'addition'
          });
        }
      }
    }
    
    return diff;
  };

  const diff = generateDiff(originalCode, suggestedCode);

  const getLineClassName = (type: string) => {
    switch (type) {
      case 'addition':
        return 'bg-green-900/30 text-green-300 border-l-4 border-green-500';
      case 'deletion':
        return 'bg-red-900/30 text-red-300 border-l-4 border-red-500';
      default:
        return 'text-slate-300';
    }
  };

  const getLineIcon = (type: string) => {
    switch (type) {
      case 'addition':
        return '+';
      case 'deletion':
        return '-';
      default:
        return ' ';
    }
  };

  return (
    <div className={`bg-slate-900 rounded-lg border border-slate-700 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-slate-800 border-b border-slate-700">
        <div>
          <h3 className="text-white font-medium">{fileName}</h3>
          <p className="text-slate-400 text-sm">{language}</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex bg-slate-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('unified')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                viewMode === 'unified'
                  ? 'bg-slate-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Unified
            </button>
            <button
              onClick={() => setViewMode('side-by-side')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                viewMode === 'side-by-side'
                  ? 'bg-slate-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Side by Side
            </button>
          </div>
        </div>
      </div>

      {/* Diff Content */}
      <div className="max-h-96 overflow-y-auto">
        {viewMode === 'unified' ? (
          <div className="font-mono text-sm">
            {diff.map((line, index) => (
              <div
                key={index}
                className={`flex px-4 py-1 ${getLineClassName(line.type)}`}
              >
                <span className="w-8 text-slate-500 text-right pr-2">
                  {line.lineNumber}
                </span>
                <span className="w-4 text-slate-500">
                  {getLineIcon(line.type)}
                </span>
                <span className="flex-1">{line.content}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-0">
            {/* Original */}
            <div className="border-r border-slate-700">
              <div className="bg-slate-800 px-4 py-2 border-b border-slate-700">
                <span className="text-slate-400 text-sm font-medium">Original</span>
              </div>
              <div className="font-mono text-sm">
                {originalCode.split('\n').map((line, index) => (
                  <div key={index} className="flex px-4 py-1 text-slate-300">
                    <span className="w-8 text-slate-500 text-right pr-2">{index + 1}</span>
                    <span className="flex-1">{line}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested */}
            <div>
              <div className="bg-slate-800 px-4 py-2 border-b border-slate-700">
                <span className="text-slate-400 text-sm font-medium">Suggested</span>
              </div>
              <div className="font-mono text-sm">
                {suggestedCode.split('\n').map((line, index) => (
                  <div key={index} className="flex px-4 py-1 text-slate-300">
                    <span className="w-8 text-slate-500 text-right pr-2">{index + 1}</span>
                    <span className="flex-1">{line}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      {(onAccept || onReject) && (
        <div className="flex items-center justify-end space-x-3 p-4 bg-slate-800 border-t border-slate-700">
          {onReject && (
            <button
              onClick={onReject}
              className="px-4 py-2 text-slate-300 hover:text-white border border-slate-600 rounded-lg hover:bg-slate-700 transition-colors"
            >
              Reject
            </button>
          )}
          {onAccept && (
            <button
              onClick={onAccept}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              Accept Changes
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DiffViewer;