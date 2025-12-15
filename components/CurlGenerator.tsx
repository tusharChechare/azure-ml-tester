'use client';

import { useState } from 'react';
import { Terminal, Copy, Check, Info } from 'lucide-react';
import { generateCurl, type EndpointConfig } from '@/lib/utils';

interface CurlGeneratorProps {
  config: EndpointConfig;
  requestBody: string;
}

export default function CurlGenerator({ config, requestBody }: CurlGeneratorProps) {
  const [copied, setCopied] = useState(false);

  const curlCommand = generateCurl(config, requestBody);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(curlCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card">
      <div className="card-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
            <Terminal className="w-4 h-4 text-orange-400" />
          </div>
          <h2 className="text-white font-medium">cURL Command</h2>
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
        {/* cURL display */}
        <div className="code-block p-4 overflow-x-auto">
          <pre className="text-sm text-dark-200 font-mono whitespace-pre">{curlCommand}</pre>
        </div>

        {/* Breakdown */}
        <div className="mt-4 space-y-3">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-azure-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-dark-400">
              <p className="font-medium text-white mb-2">Command Breakdown:</p>
              <ul className="space-y-1">
                <li><code className="text-orange-400">curl -X POST</code> - HTTP POST request</li>
                <li><code className="text-orange-400">-H &quot;Content-Type: application/json&quot;</code> - Set content type header</li>
                <li><code className="text-orange-400">-H &quot;{config.keyHeaderName}: ...&quot;</code> - Authentication header</li>
                <li><code className="text-orange-400">-d &apos;...&apos;</code> - Request body (JSON data)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Educational note */}
        <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
          <p className="text-xs text-orange-300">
            <strong>💡 Learning Note:</strong> cURL is a command-line tool for making HTTP requests. 
            You can run this command in your terminal to test the API directly!
          </p>
        </div>
      </div>
    </div>
  );
}




