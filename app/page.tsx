'use client';

import { useState, useEffect } from 'react';
import { Send, Image as ImageIcon, Code, ChevronDown, ChevronUp, Zap, BookOpen, Sparkles, Layers, Shield, AlertTriangle } from 'lucide-react';
import Header from '@/components/Header';
import EndpointConfigComponent from '@/components/EndpointConfig';
import RequestBuilder from '@/components/RequestBuilder';
import ImageUploader from '@/components/ImageUploader';
import FormBuilder from '@/components/FormBuilder';
import ResponseViewer from '@/components/ResponseViewer';
import CodeGenerator from '@/components/CodeGenerator';
import CurlGenerator from '@/components/CurlGenerator';
import RequestHistory from '@/components/RequestHistory';
import {
  generateId,
  getDefaultRequestTemplate,
  loadFromLocalStorage,
  saveToLocalStorage,
  isValidJson,
  type EndpointConfig,
  type RequestHistoryItem,
} from '@/lib/utils';

type InputMode = 'visual' | 'json' | 'image';

export default function Home() {
  // Endpoint configuration
  const [config, setConfig] = useState<EndpointConfig>({
    url: '',
    apiKey: '',
    keyHeaderName: 'Authorization',
  });

  // Request/Response state
  const [inputMode, setInputMode] = useState<InputMode>('visual');
  const [requestBody, setRequestBody] = useState(getDefaultRequestTemplate());
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [response, setResponse] = useState<{ data: unknown; status: number; duration: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Proxy mode for CORS issues
  const [useProxy, setUseProxy] = useState(true);
  const [showCorsHelp, setShowCorsHelp] = useState(false);

  // UI state
  const [showCodeSnippets, setShowCodeSnippets] = useState(false);
  const [history, setHistory] = useState<RequestHistoryItem[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedConfig = loadFromLocalStorage<EndpointConfig>('ml-tester-config', config);
    const savedHistory = loadFromLocalStorage<RequestHistoryItem[]>('ml-tester-history', []);
    const savedUseProxy = loadFromLocalStorage<boolean>('ml-tester-use-proxy', true);
    setConfig(savedConfig);
    setHistory(savedHistory);
    setUseProxy(savedUseProxy);
  }, []);

  // Save config to localStorage
  useEffect(() => {
    if (config.url || config.apiKey) {
      saveToLocalStorage('ml-tester-config', config);
    }
  }, [config]);

  // Save history to localStorage
  useEffect(() => {
    saveToLocalStorage('ml-tester-history', history);
  }, [history]);

  // Save proxy preference
  useEffect(() => {
    saveToLocalStorage('ml-tester-use-proxy', useProxy);
  }, [useProxy]);

  const handleImageSelect = (base64: string, body: string) => {
    setImagePreview(base64);
    setRequestBody(body);
  };

  const handleFormJsonGenerated = (json: string) => {
    setRequestBody(json);
  };

  const handleSendRequest = async () => {
    if (!config.url || !config.apiKey) {
      setError('Please configure endpoint URL and API key');
      return;
    }

    if (!isValidJson(requestBody)) {
      setError('Invalid JSON in request body');
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);

    const startTime = Date.now();

    try {
      let data: unknown;
      let status: number;

      if (useProxy) {
        // Use server-side proxy to avoid CORS
        const proxyRes = await fetch('/api/proxy/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            endpoint: config.url,
            apiKey: config.apiKey.startsWith('Bearer ') ? config.apiKey : `Bearer ${config.apiKey}`,
            keyHeaderName: config.keyHeaderName,
            requestBody: requestBody,
          }),
        });

        const proxyData = await proxyRes.json();
        
        if (proxyData.error) {
          throw new Error(proxyData.error);
        }
        
        data = proxyData.data;
        status = proxyData.status;
      } else {
        // Direct call (may fail due to CORS)
        const res = await fetch(config.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            [config.keyHeaderName]: config.apiKey.startsWith('Bearer ') 
              ? config.apiKey 
              : `Bearer ${config.apiKey}`,
          },
          body: requestBody,
        });

        data = await res.json();
        status = res.status;
      }

      const duration = Date.now() - startTime;

      setResponse({
        data,
        status,
        duration,
      });

      // Add to history
      const historyItem: RequestHistoryItem = {
        id: generateId(),
        timestamp: new Date(),
        endpoint: config.url,
        method: 'POST',
        requestBody,
        responseBody: JSON.stringify(data),
        statusCode: status,
        duration,
        isImage: inputMode === 'image',
        imagePreview: imagePreview || undefined,
      };

      setHistory((prev) => [historyItem, ...prev.slice(0, 49)]);
    } catch (err) {
      const duration = Date.now() - startTime;
      
      let errorMessage = 'Failed to send request. ';
      if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
        errorMessage += 'This is likely a CORS error. Try enabling "Use Proxy" or enable CORS on your Azure ML endpoint.';
        setShowCorsHelp(true);
      } else if (err instanceof Error) {
        errorMessage += err.message;
      }

      setError(errorMessage);
      setResponse({
        data: { error: errorMessage },
        status: 0,
        duration,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleHistorySelect = (item: RequestHistoryItem) => {
    setRequestBody(item.requestBody);
    setInputMode(item.isImage ? 'image' : 'json');
    if (item.imagePreview) {
      setImagePreview(item.imagePreview);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    saveToLocalStorage('ml-tester-history', []);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero section */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold gradient-text mb-2">
            Azure ML Model Tester
          </h1>
          <p className="text-dark-400 max-w-2xl mx-auto">
            Test your deployed Azure Machine Learning models by sending requests and viewing responses.
            Perfect for learning how ML APIs work in real applications.
          </p>
        </div>

        {/* Quick tips */}
        <div className="mb-8 p-4 bg-gradient-to-r from-azure-500/10 to-purple-500/10 border border-azure-500/30 rounded-xl">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-azure-500/20 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-5 h-5 text-azure-400" />
            </div>
            <div>
              <h3 className="text-white font-medium mb-1">📚 Quick Start Guide</h3>
              <ol className="text-sm text-dark-400 space-y-1">
                <li>1. Enter your Azure ML endpoint URL and API key from Azure ML Studio</li>
                <li>2. Choose <strong className="text-violet-400">Visual Form</strong> (easiest), <strong className="text-purple-400">JSON</strong> (advanced), or <strong className="text-pink-400">Image</strong> mode</li>
                <li>3. Build your request and click &quot;Send Request&quot;</li>
                <li>4. <strong className="text-green-400">✓ Proxy Mode enabled</strong> - No CORS issues!</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Configuration & Input */}
          <div className="lg:col-span-2 space-y-6">
            {/* Endpoint Configuration */}
            <EndpointConfigComponent config={config} onChange={setConfig} />

            {/* CORS Proxy Toggle */}
            <div className="p-4 bg-dark-800/50 border border-dark-700 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${useProxy ? 'bg-green-500/20' : 'bg-yellow-500/20'}`}>
                    <Shield className={`w-5 h-5 ${useProxy ? 'text-green-400' : 'text-yellow-400'}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">CORS Proxy Mode</span>
                      {useProxy && (
                        <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
                          Recommended
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-dark-400 mt-0.5">
                      {useProxy 
                        ? 'Requests go through server proxy - no CORS issues!' 
                        : 'Direct browser calls - requires CORS enabled on Azure ML'}
                    </p>
                  </div>
                </div>
                
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useProxy}
                    onChange={(e) => setUseProxy(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-dark-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500"></div>
                </label>
              </div>
              
              {/* CORS Help */}
              {showCorsHelp && !useProxy && (
                <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg animate-fade-in">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-yellow-300 font-medium">CORS Error Detected</p>
                      <p className="text-xs text-yellow-400/80 mt-1">
                        Either enable the proxy above, or enable CORS on your Azure ML endpoint using:
                      </p>
                      <code className="block mt-2 p-2 bg-dark-900 rounded text-xs text-dark-300 font-mono">
                        az ml online-endpoint update --name YOUR_ENDPOINT --set defaults.allow_origins=&quot;*&quot;
                      </code>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Mode Toggle - Now with 3 options */}
            <div className="p-1 bg-dark-800/50 rounded-2xl border border-dark-700">
              <div className="grid grid-cols-3 gap-1">
                <button
                  onClick={() => setInputMode('visual')}
                  className={`relative flex flex-col items-center justify-center gap-1.5 py-4 px-3 rounded-xl font-medium transition-all ${
                    inputMode === 'visual'
                      ? 'bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30 text-white border border-violet-500/50 shadow-lg shadow-violet-500/20'
                      : 'text-dark-400 hover:text-white hover:bg-dark-700/50'
                  }`}
                >
                  {inputMode === 'visual' && (
                    <div className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-green-500 rounded-full text-[10px] text-white font-bold">
                      EASY
                    </div>
                  )}
                  <Sparkles className="w-5 h-5" />
                  <span className="text-sm">Visual Form</span>
                  <span className="text-[10px] opacity-60">No coding needed</span>
                </button>
                
                <button
                  onClick={() => setInputMode('json')}
                  className={`flex flex-col items-center justify-center gap-1.5 py-4 px-3 rounded-xl font-medium transition-all ${
                    inputMode === 'json'
                      ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50'
                      : 'text-dark-400 hover:text-white hover:bg-dark-700/50'
                  }`}
                >
                  <Code className="w-5 h-5" />
                  <span className="text-sm">JSON Editor</span>
                  <span className="text-[10px] opacity-60">Advanced users</span>
                </button>
                
                <button
                  onClick={() => setInputMode('image')}
                  className={`flex flex-col items-center justify-center gap-1.5 py-4 px-3 rounded-xl font-medium transition-all ${
                    inputMode === 'image'
                      ? 'bg-pink-500/20 text-pink-400 border border-pink-500/50'
                      : 'text-dark-400 hover:text-white hover:bg-dark-700/50'
                  }`}
                >
                  <ImageIcon className="w-5 h-5" />
                  <span className="text-sm">Image Upload</span>
                  <span className="text-[10px] opacity-60">Classification</span>
                </button>
              </div>
            </div>

            {/* Request Builder - Based on mode */}
            <div className="min-h-[450px]">
              {inputMode === 'visual' && (
                <FormBuilder onJsonGenerated={handleFormJsonGenerated} />
              )}
              {inputMode === 'json' && (
                <RequestBuilder value={requestBody} onChange={setRequestBody} />
              )}
              {inputMode === 'image' && (
                <ImageUploader onImageSelect={handleImageSelect} />
              )}
            </div>

            {/* Send Button */}
            <button
              onClick={handleSendRequest}
              disabled={loading || !config.url || !config.apiKey}
              className="w-full btn-primary py-4 px-6 rounded-xl text-white font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending Request...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Request
                  {useProxy && <Shield className="w-4 h-4 opacity-70" />}
                  {!useProxy && <Zap className="w-4 h-4 opacity-70" />}
                </>
              )}
            </button>

            {/* Code Snippets Toggle */}
            <button
              onClick={() => setShowCodeSnippets(!showCodeSnippets)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-dark-800 hover:bg-dark-700 rounded-xl text-dark-400 hover:text-white transition-colors"
            >
              {showCodeSnippets ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              <Layers className="w-4 h-4" />
              {showCodeSnippets ? 'Hide' : 'Show'} Code Snippets & cURL
            </button>

            {/* Code Snippets */}
            {showCodeSnippets && (
              <div className="space-y-6 animate-fade-in">
                <CurlGenerator config={config} requestBody={requestBody} />
                <CodeGenerator config={config} requestBody={requestBody} />
              </div>
            )}
          </div>

          {/* Right column - Response & History */}
          <div className="space-y-6">
            {/* Response Viewer */}
            <div className="min-h-[450px]">
              <ResponseViewer response={response} loading={loading} error={error} />
            </div>

            {/* Request History */}
            <RequestHistory
              history={history}
              onSelect={handleHistorySelect}
              onClear={handleClearHistory}
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-dark-700">
          <div className="text-center text-dark-500 text-sm">
            <p className="mb-2">
              🎓 Educational Tool for Azure Machine Learning
            </p>
            <p className="text-xs">
              Built for teaching how ML models are consumed in real applications.
              Your API keys are stored locally and never sent to any external servers.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
