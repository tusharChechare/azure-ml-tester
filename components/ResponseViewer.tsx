'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, Clock, Copy, Check, Download, BarChart3 } from 'lucide-react';
import { prettyJson, formatDuration } from '@/lib/utils';

interface ResponseViewerProps {
  response: {
    data: unknown;
    status: number;
    duration: number;
  } | null;
  loading: boolean;
  error: string | null;
}

interface PredictionResult {
  label?: string;
  class?: string;
  probability?: number;
  confidence?: number;
  score?: number;
}

export default function ResponseViewer({ response, loading, error }: ResponseViewerProps) {
  const [copied, setCopied] = useState(false);
  const [view, setView] = useState<'json' | 'visual'>('json');

  const handleCopy = async () => {
    if (response?.data) {
      await navigator.clipboard.writeText(prettyJson(response.data));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (response?.data) {
      const blob = new Blob([prettyJson(response.data)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `response-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  // Try to extract predictions for visual display
  const extractPredictions = (): PredictionResult[] => {
    if (!response?.data) return [];
    
    try {
      const data = response.data as Record<string, unknown>;
      
      // Common Azure ML response formats
      if (Array.isArray(data)) {
        return data.map((item, index) => ({
          label: `Result ${index + 1}`,
          score: typeof item === 'number' ? item : undefined,
        }));
      }
      
      if (data.predictions && Array.isArray(data.predictions)) {
        return (data.predictions as unknown[]).map((pred, index) => ({
          label: `Prediction ${index + 1}`,
          ...(typeof pred === 'object' ? pred : { score: pred }),
        })) as PredictionResult[];
      }
      
      if (data.result && Array.isArray(data.result)) {
        return (data.result as unknown[]).map((item, index) => ({
          label: `Result ${index + 1}`,
          score: typeof item === 'number' ? item : undefined,
        }));
      }
      
      return [];
    } catch {
      return [];
    }
  };

  const predictions = extractPredictions();

  const getStatusInfo = () => {
    if (loading) {
      return { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/20', text: 'Sending request...' };
    }
    if (error) {
      return { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/20', text: 'Error' };
    }
    if (response) {
      if (response.status >= 200 && response.status < 300) {
        return { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/20', text: 'Success' };
      }
      return { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/20', text: 'Failed' };
    }
    return { icon: Clock, color: 'text-dark-400', bg: 'bg-dark-700', text: 'Waiting' };
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <div className="card h-full flex flex-col">
      <div className="card-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg ${statusInfo.bg} flex items-center justify-center`}>
            <StatusIcon className={`w-4 h-4 ${statusInfo.color}`} />
          </div>
          <h2 className="text-white font-medium">Response</h2>
          {response && (
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
              response.status >= 200 && response.status < 300 ? 'status-success' : 'status-error'
            }`}>
              {response.status}
            </span>
          )}
          {response && (
            <span className="text-xs text-dark-400">
              {formatDuration(response.duration)}
            </span>
          )}
        </div>
        
        {response && (
          <div className="flex items-center gap-2">
            {predictions.length > 0 && (
              <div className="flex rounded-lg overflow-hidden border border-dark-600">
                <button
                  onClick={() => setView('json')}
                  className={`px-3 py-1.5 text-xs transition-colors ${
                    view === 'json' ? 'bg-azure-500 text-white' : 'text-dark-400 hover:text-white'
                  }`}
                >
                  JSON
                </button>
                <button
                  onClick={() => setView('visual')}
                  className={`px-3 py-1.5 text-xs transition-colors ${
                    view === 'visual' ? 'bg-azure-500 text-white' : 'text-dark-400 hover:text-white'
                  }`}
                >
                  Visual
                </button>
              </div>
            )}
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-dark-400 hover:text-white bg-dark-700 hover:bg-dark-600 rounded-md transition-colors"
            >
              {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-dark-400 hover:text-white bg-dark-700 hover:bg-dark-600 rounded-md transition-colors"
            >
              <Download className="w-3 h-3" />
              Download
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 p-4 overflow-hidden flex flex-col">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="relative inline-flex">
                <div className="w-12 h-12 rounded-full border-4 border-dark-700 border-t-azure-500 animate-spin" />
              </div>
              <p className="mt-4 text-dark-400">Sending request to Azure ML...</p>
              <p className="text-xs text-dark-500 mt-1">This may take a few seconds</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
            <p className="text-red-400 font-medium mb-2">Request Failed</p>
            <p className="text-sm text-dark-400 text-center max-w-md">{error}</p>
            
            {/* Error explanation */}
            <div className="mt-4 p-4 bg-dark-800 rounded-lg max-w-md">
              <p className="text-xs text-dark-400 mb-2">💡 <strong className="text-white">Common causes:</strong></p>
              <ul className="text-xs text-dark-500 space-y-1 list-disc list-inside">
                <li>CORS not enabled on Azure ML endpoint</li>
                <li>Invalid API key or endpoint URL</li>
                <li>Endpoint is not running</li>
                <li>Incorrect request format</li>
              </ul>
            </div>
          </div>
        ) : response ? (
          <div className="flex-1 overflow-hidden flex flex-col">
            {view === 'json' ? (
              <div className="flex-1 code-block p-4 overflow-auto">
                <pre className="text-sm text-dark-200 font-mono whitespace-pre-wrap">
                  {prettyJson(response.data as string | object)}
                </pre>
              </div>
            ) : (
              <div className="flex-1 overflow-auto">
                <div className="space-y-3">
                  {predictions.map((pred, index) => (
                    <div key={index} className="p-4 bg-dark-800 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">
                          {pred.label || pred.class || `Result ${index + 1}`}
                        </span>
                        <span className="text-azure-400 font-mono">
                          {(pred.probability ?? pred.confidence ?? pred.score ?? 0).toFixed(4)}
                        </span>
                      </div>
                      <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-azure-500 to-purple-500 rounded-full transition-all duration-500"
                          style={{
                            width: `${(pred.probability ?? pred.confidence ?? pred.score ?? 0) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Response timing info */}
            <div className="mt-3 p-3 bg-azure-500/10 border border-azure-500/30 rounded-lg flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-azure-400" />
              <span className="text-xs text-azure-300">
                Response received in <strong>{formatDuration(response.duration)}</strong>
              </span>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-dark-800 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-dark-500" />
              </div>
              <p className="text-dark-400 mb-2">No response yet</p>
              <p className="text-xs text-dark-500">Configure your endpoint and send a request</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

