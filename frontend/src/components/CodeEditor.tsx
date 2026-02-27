import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { 
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-64 text-white/60">Loading editor...</div>
});

interface CodeEditorProps {
  code: string;
  language: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  theme?: 'vs-dark' | 'light';
  height?: string;
  className?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  language = 'java',
  onChange,
  readOnly = false,
  theme = 'vs-dark',
  height = '400px',
  className = ''
}) => {
  const handleEditorChange = (value: string | undefined) => {
    if (onChange && value !== undefined) {
      onChange(value);
    }
  };

  const getLanguageFromExtension = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase();
    const languageMap: Record<string, string> = {
      'java': 'java',
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'py': 'python',
      'cs': 'csharp',
      'cobol': 'cobol',
      'cbl': 'cobol',
      'cob': 'cobol'
    };
    return languageMap[ext || ''] || 'plaintext';
  };

  const editorLanguage = getLanguageFromExtension(language) || language;

  return (
    <div className={`border border-slate-700 rounded-lg overflow-hidden ${className}`}>
      <MonacoEditor
        height={height}
        language={editorLanguage}
        value={code}
        onChange={handleEditorChange}
        theme={theme}
        options={{
          readOnly: readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          wordWrap: 'on',
          folding: true,
          lineHeight: 20,
          tabSize: 2,
          insertSpaces: true,
          cursorStyle: 'line',
          cursorBlinking: 'blink',
          bracketPairColorization: { enabled: true },
          guides: {
            indentation: true,
            highlightActiveIndentation: true
          }
        }}
      />
    </div>
  );
};

export default CodeEditor;