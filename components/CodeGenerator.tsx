'use client';

import { useState } from 'react';
import { Code2, Copy, Check } from 'lucide-react';
import {
  generatePythonCode,
  generateJavaScriptCode,
  generateCSharpCode,
  type EndpointConfig,
} from '@/lib/utils';

interface CodeGeneratorProps {
  config: EndpointConfig;
  requestBody: string;
}

type Language = 'python' | 'javascript' | 'csharp';

const languageConfig: Record<Language, { name: string; icon: string; color: string }> = {
  python: { name: 'Python', icon: '🐍', color: 'bg-yellow-500/20 text-yellow-400' },
  javascript: { name: 'JavaScript', icon: '📜', color: 'bg-amber-500/20 text-amber-400' },
  csharp: { name: 'C#', icon: '💜', color: 'bg-purple-500/20 text-purple-400' },
};

export default function CodeGenerator({ config, requestBody }: CodeGeneratorProps) {
  const [selectedLang, setSelectedLang] = useState<Language>('python');
  const [copied, setCopied] = useState(false);

  const generateCode = (): string => {
    switch (selectedLang) {
      case 'python':
        return generatePythonCode(config, requestBody);
      case 'javascript':
        return generateJavaScriptCode(config, requestBody);
      case 'csharp':
        return generateCSharpCode(config, requestBody);
      default:
        return '';
    }
  };

  const code = generateCode();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card">
      <div className="card-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
            <Code2 className="w-4 h-4 text-green-400" />
          </div>
          <h2 className="text-white font-medium">Code Snippets</h2>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-dark-400 hover:text-white bg-dark-700 hover:bg-dark-600 rounded-md transition-colors"
        >
          {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      <div className="p-4">
        {/* Language tabs */}
        <div className="flex gap-2 mb-4">
          {(Object.keys(languageConfig) as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLang(lang)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedLang === lang
                  ? 'bg-azure-500 text-white'
                  : 'bg-dark-800 text-dark-400 hover:text-white hover:bg-dark-700'
              }`}
            >
              <span>{languageConfig[lang].icon}</span>
              {languageConfig[lang].name}
            </button>
          ))}
        </div>

        {/* Code display */}
        <div className="code-block p-4 overflow-x-auto">
          <pre className="text-sm text-dark-200 font-mono whitespace-pre">{code}</pre>
        </div>

        {/* Educational note */}
        <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
          <p className="text-xs text-green-300">
            <strong>💡 Learning Note:</strong> This code shows how to call your Azure ML endpoint from {languageConfig[selectedLang].name}. 
            Copy and modify it for your own applications!
          </p>
        </div>
      </div>
    </div>
  );
}




