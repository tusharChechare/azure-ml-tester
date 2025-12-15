'use client';

import { useState } from 'react';
import { Link2, Key, Eye, EyeOff, Info, ChevronDown, ChevronUp } from 'lucide-react';
import type { EndpointConfig } from '@/lib/utils';

interface EndpointConfigProps {
  config: EndpointConfig;
  onChange: (config: EndpointConfig) => void;
}

export default function EndpointConfigComponent({ config, onChange }: EndpointConfigProps) {
  const [showApiKey, setShowApiKey] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleChange = (field: keyof EndpointConfig, value: string) => {
    onChange({ ...config, [field]: value });
  };

  return (
    <div className="card">
      <div className="card-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-azure-500/20 flex items-center justify-center">
            <Link2 className="w-4 h-4 text-azure-400" />
          </div>
          <h2 className="text-white font-medium">Endpoint Configuration</h2>
        </div>
        <div className="group relative">
          <Info className="w-4 h-4 text-dark-500 cursor-help" />
          <div className="absolute right-0 top-full mt-2 w-72 p-3 bg-dark-800 border border-dark-600 rounded-lg text-xs text-dark-300 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
            <p className="font-medium text-white mb-2">📍 Where to find these?</p>
            <p className="mb-2">In Azure ML Studio:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Go to <strong>Endpoints</strong></li>
              <li>Select your deployed model</li>
              <li>Copy the <strong>REST endpoint</strong> URL</li>
              <li>Go to <strong>Consume</strong> tab for the API key</li>
            </ol>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Endpoint URL */}
        <div>
          <label className="block text-sm text-dark-300 mb-2">
            Endpoint URL
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <Link2 className="w-4 h-4 text-dark-500" />
            </div>
            <input
              type="url"
              value={config.url}
              onChange={(e) => handleChange('url', e.target.value)}
              placeholder="https://your-endpoint.region.inference.ml.azure.com/score"
              className="w-full pl-10 pr-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-dark-500 focus:border-azure-500 focus:ring-2 focus:ring-azure-500/20 transition-all"
            />
          </div>
          <p className="mt-1 text-xs text-dark-500">
            The REST endpoint URL from your Azure ML deployment
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
              placeholder="Enter your API key"
              className="w-full pl-10 pr-12 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-dark-500 focus:border-azure-500 focus:ring-2 focus:ring-azure-500/20 transition-all font-mono"
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
            Your API key is stored locally and never sent to any server except your Azure endpoint
          </p>
        </div>

        {/* Advanced Settings Toggle */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-sm text-dark-400 hover:text-white transition-colors"
        >
          {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          Advanced Settings
        </button>

        {/* Advanced Settings */}
        {showAdvanced && (
          <div className="animate-fade-in">
            <label className="block text-sm text-dark-300 mb-2">
              API Key Header Name
            </label>
            <input
              type="text"
              value={config.keyHeaderName}
              onChange={(e) => handleChange('keyHeaderName', e.target.value)}
              placeholder="Authorization"
              className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-dark-500 focus:border-azure-500 focus:ring-2 focus:ring-azure-500/20 transition-all font-mono"
            />
            <p className="mt-1 text-xs text-dark-500">
              Usually &quot;Authorization&quot; for Azure ML, or &quot;api-key&quot; for some deployments
            </p>
          </div>
        )}

        {/* Connection Status */}
        <div className="flex items-center gap-2 p-3 bg-dark-800/50 rounded-lg">
          <div className={`w-2 h-2 rounded-full ${config.url && config.apiKey ? 'bg-green-500' : 'bg-dark-500'}`} />
          <span className="text-sm text-dark-400">
            {config.url && config.apiKey ? 'Ready to connect' : 'Enter endpoint details to connect'}
          </span>
        </div>
      </div>
    </div>
  );
}




