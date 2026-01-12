'use client';

import { useState } from 'react';
import { Eye, Key, EyeOff, Info, Globe } from 'lucide-react';

export interface VisionConfigType {
  endpoint: string;
  apiKey: string;
}

interface VisionConfigProps {
  config: VisionConfigType;
  onChange: (config: VisionConfigType) => void;
}

export default function VisionConfig({ config, onChange }: VisionConfigProps) {
  const [showApiKey, setShowApiKey] = useState(false);

  const handleChange = (field: keyof VisionConfigType, value: string) => {
    onChange({ ...config, [field]: value });
  };

  // Extract resource name from endpoint for display
  const getResourceName = (endpoint: string): string => {
    const match = endpoint.match(/https:\/\/([^.]+)\./);
    return match ? match[1] : 'your-resource';
  };

  return (
    <div className="card">
      <div className="card-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <Eye className="w-4 h-4 text-purple-400" />
          </div>
          <h2 className="text-white font-medium">Vision API Configuration</h2>
        </div>
        <div className="group relative">
          <Info className="w-4 h-4 text-dark-500 cursor-help" />
          <div className="absolute right-0 top-full mt-2 w-80 p-3 bg-dark-800 border border-dark-600 rounded-lg text-xs text-dark-300 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
            <p className="font-medium text-white mb-2">📍 Where to find these?</p>
            <p className="mb-2">In Azure Portal:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Go to your <strong>Azure AI Services</strong> resource</li>
              <li>Click <strong>Keys and Endpoint</strong></li>
              <li>Copy the <strong>Endpoint</strong> URL</li>
              <li>Copy <strong>Key 1</strong> or <strong>Key 2</strong></li>
            </ol>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Endpoint URL */}
        <div>
          <label className="block text-sm text-dark-300 mb-2">
            Azure AI Services Endpoint
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <Globe className="w-4 h-4 text-dark-500" />
            </div>
            <input
              type="url"
              value={config.endpoint}
              onChange={(e) => handleChange('endpoint', e.target.value)}
              placeholder="https://your-resource.cognitiveservices.azure.com"
              className="w-full pl-10 pr-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-dark-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
            />
          </div>
          <p className="mt-1 text-xs text-dark-500">
            Your Azure AI Services endpoint (e.g., https://<span className="text-purple-400">{getResourceName(config.endpoint)}</span>.cognitiveservices.azure.com)
          </p>
        </div>

        {/* API Key */}
        <div>
          <label className="block text-sm text-dark-300 mb-2">
            API Key
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <Key className="w-4 h-4 text-dark-500" />
            </div>
            <input
              type={showApiKey ? 'text' : 'password'}
              value={config.apiKey}
              onChange={(e) => handleChange('apiKey', e.target.value)}
              placeholder="Enter your API key (Key 1 or Key 2)"
              className="w-full pl-10 pr-12 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-dark-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all font-mono"
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300 transition-colors"
            >
              {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="mt-1 text-xs text-dark-500">
            Found in Azure Portal → Your AI Services → Keys and Endpoint
          </p>
        </div>

        {/* Connection Status */}
        <div className="flex items-center gap-2 p-3 bg-dark-800/50 rounded-lg">
          <div className={`w-2 h-2 rounded-full ${config.endpoint && config.apiKey ? 'bg-green-500' : 'bg-dark-500'}`} />
          <span className="text-sm text-dark-400">
            {config.endpoint && config.apiKey ? 'Ready to analyze images' : 'Enter endpoint and API key to continue'}
          </span>
        </div>

        {/* API Version Info */}
        <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
          <p className="text-xs text-purple-300">
            <strong>📚 API Info:</strong> Using Image Analysis API v4.0 (2024-02-01). 
            This is the latest version with enhanced features including dense captions and smart crops.
          </p>
        </div>
      </div>
    </div>
  );
}

