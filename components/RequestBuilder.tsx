'use client';

import { useState, useEffect } from 'react';
import { Code, Copy, Check, AlertCircle, Wand2 } from 'lucide-react';
import { isValidJson, getDefaultRequestTemplate } from '@/lib/utils';

interface RequestBuilderProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RequestBuilder({ value, onChange }: RequestBuilderProps) {
  const [isValid, setIsValid] = useState(true);
  const [copied, setCopied] = useState(false);
  const [lineCount, setLineCount] = useState(1);

  useEffect(() => {
    setIsValid(value === '' || isValidJson(value));
    setLineCount(value.split('\n').length);
  }, [value]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFormat = () => {
    if (isValidJson(value)) {
      onChange(JSON.stringify(JSON.parse(value), null, 2));
    }
  };

  const handleLoadTemplate = () => {
    onChange(getDefaultRequestTemplate());
  };

  return (
    <div className="card h-full flex flex-col">
      <div className="card-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <Code className="w-4 h-4 text-purple-400" />
          </div>
          <h2 className="text-white font-medium">Request Body</h2>
          {!isValid && value && (
            <span className="flex items-center gap-1 text-xs text-red-400">
              <AlertCircle className="w-3 h-3" />
              Invalid JSON
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleLoadTemplate}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-dark-400 hover:text-white bg-dark-700 hover:bg-dark-600 rounded-md transition-colors"
          >
            <Wand2 className="w-3 h-3" />
            Template
          </button>
          <button
            onClick={handleFormat}
            disabled={!isValid || !value}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-dark-400 hover:text-white bg-dark-700 hover:bg-dark-600 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Format
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-dark-400 hover:text-white bg-dark-700 hover:bg-dark-600 rounded-md transition-colors"
          >
            {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 flex flex-col min-h-0">
        <div className="flex-1 relative code-block overflow-hidden">
          {/* Line numbers */}
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-dark-900/50 border-r border-dark-700 flex flex-col items-end py-4 pr-2 text-xs text-dark-500 font-mono overflow-hidden">
            {Array.from({ length: lineCount }, (_, i) => (
              <div key={i} className="leading-6">{i + 1}</div>
            ))}
          </div>
          
          {/* Editor */}
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`{\n  "input_data": {\n    "columns": ["feature1", "feature2"],\n    "data": [[1.0, 2.0]]\n  }\n}`}
            spellCheck={false}
            className={`w-full h-full pl-14 pr-4 py-4 bg-transparent text-sm text-dark-100 font-mono leading-6 resize-none focus:outline-none placeholder-dark-600 ${
              !isValid && value ? 'text-red-400' : ''
            }`}
            style={{ minHeight: '300px' }}
          />
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between mt-3 text-xs text-dark-500">
          <span>{lineCount} lines</span>
          <span className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isValid ? 'bg-green-500' : 'bg-red-500'}`} />
            {isValid ? 'Valid JSON' : 'Invalid JSON'}
          </span>
        </div>
      </div>
    </div>
  );
}




