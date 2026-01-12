'use client';

import { useState, useEffect } from 'react';
import { Send, Image as ImageIcon, Code, ChevronDown, ChevronUp, Zap, BookOpen, Sparkles, Layers, Shield, AlertTriangle, Eye } from 'lucide-react';
import Header from '@/components/Header';
import ServiceSelector, { type ServiceType } from '@/components/ServiceSelector';
import EndpointConfigComponent from '@/components/EndpointConfig';
import RequestBuilder from '@/components/RequestBuilder';
import ImageUploader from '@/components/ImageUploader';
import FormBuilder from '@/components/FormBuilder';
import ResponseViewer from '@/components/ResponseViewer';
import CodeGenerator from '@/components/CodeGenerator';
import CurlGenerator from '@/components/CurlGenerator';
import RequestHistory from '@/components/RequestHistory';
// Vision components
import VisionConfig, { type VisionConfigType } from '@/components/VisionConfig';
import VisionFeatureSelector, { type VisionFeatures } from '@/components/VisionFeatureSelector';
import VisionTemplates from '@/components/VisionTemplates';
import VisionResponseViewer, { type VisionResponse } from '@/components/VisionResponseViewer';
import VisionCodeGenerator from '@/components/VisionCodeGenerator';
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
  // Service selection
  const [selectedService, setSelectedService] = useState<ServiceType>('ml-studio');

  // ML Studio - Endpoint configuration
  const [config, setConfig] = useState<EndpointConfig>({
    url: '',
    apiKey: '',
    keyHeaderName: 'Authorization',
  });

  // Vision API configuration
  const [visionConfig, setVisionConfig] = useState<VisionConfigType>({
    endpoint: '',
    apiKey: '',
  });

  const [visionFeatures, setVisionFeatures] = useState<VisionFeatures>({
    caption: true,
    tags: true,
    objects: true,
    read: true,
    denseCaptions: false,
    people: false,
    smartCrops: false,
  });

  const [smartCropRatios, setSmartCropRatios] = useState<number[]>([1.0]);

  // Request/Response state
  const [inputMode, setInputMode] = useState<InputMode>('visual');
  const [requestBody, setRequestBody] = useState(getDefaultRequestTemplate());
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageIsUrl, setImageIsUrl] = useState(false); // Track if image is URL or base64
  const [response, setResponse] = useState<{ data: unknown; status: number; duration: number } | null>(null);
  const [visionResponse, setVisionResponse] = useState<{ data: VisionResponse | null; status: number; duration: number } | null>(null);
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
    const savedVisionConfig = loadFromLocalStorage<VisionConfigType>('ml-tester-vision-config', visionConfig);
    const savedHistory = loadFromLocalStorage<RequestHistoryItem[]>('ml-tester-history', []);
    const savedUseProxy = loadFromLocalStorage<boolean>('ml-tester-use-proxy', true);
    const savedService = loadFromLocalStorage<ServiceType>('ml-tester-service', 'ml-studio');
    setConfig(savedConfig);
    setVisionConfig(savedVisionConfig);
    setHistory(savedHistory);
    setUseProxy(savedUseProxy);
    setSelectedService(savedService);
  }, []);

  // Save config to localStorage
  useEffect(() => {
    if (config.url || config.apiKey) {
      saveToLocalStorage('ml-tester-config', config);
    }
  }, [config]);

  // Save vision config
  useEffect(() => {
    if (visionConfig.endpoint || visionConfig.apiKey) {
      saveToLocalStorage('ml-tester-vision-config', visionConfig);
    }
  }, [visionConfig]);

  // Save history to localStorage
  useEffect(() => {
    saveToLocalStorage('ml-tester-history', history);
  }, [history]);

  // Save proxy preference
  useEffect(() => {
    saveToLocalStorage('ml-tester-use-proxy', useProxy);
  }, [useProxy]);

  // Save service preference
  useEffect(() => {
    saveToLocalStorage('ml-tester-service', selectedService);
  }, [selectedService]);

  const handleImageSelect = (base64OrUrl: string, body: string, isUrl: boolean = false) => {
    setImagePreview(base64OrUrl);
    setImageIsUrl(isUrl);
    setRequestBody(body);
  };

  const handleFormJsonGenerated = (json: string) => {
    setRequestBody(json);
  };

  // ML Studio request handler
  const handleSendMLRequest = async () => {
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
        const proxyRes = await fetch('/api/proxy/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            endpoint: config.url,
            apiKey: config.apiKey.startsWith('Bearer ') ? config.apiKey : `Bearer ${config.apiKey}`,
            keyHeaderName: config.keyHeaderName,
            requestBody: requestBody,
          }),
        });

        const proxyData = await proxyRes.json();
        if (proxyData.error) throw new Error(proxyData.error);
        data = proxyData.data;
        status = proxyData.status;
      } else {
        const res = await fetch(config.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            [config.keyHeaderName]: config.apiKey.startsWith('Bearer ') ? config.apiKey : `Bearer ${config.apiKey}`,
          },
          body: requestBody,
        });
        data = await res.json();
        status = res.status;
      }

      const duration = Date.now() - startTime;
      setResponse({ data, status, duration });

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
        errorMessage += 'This is likely a CORS error. Try enabling "Use Proxy".';
        setShowCorsHelp(true);
      } else if (err instanceof Error) {
        errorMessage += err.message;
      }
      setError(errorMessage);
      setResponse({ data: { error: errorMessage }, status: 0, duration });
    } finally {
      setLoading(false);
    }
  };

  // Vision API request handler
  const handleSendVisionRequest = async () => {
    if (!visionConfig.endpoint || !visionConfig.apiKey) {
      setError('Please configure Vision API endpoint and API key');
      return;
    }

    if (!imagePreview) {
      setError('Please upload an image to analyze');
      return;
    }

    const enabledFeatures = Object.entries(visionFeatures)
      .filter(([, enabled]) => enabled)
      .map(([feature]) => feature);

    if (enabledFeatures.length === 0) {
      setError('Please select at least one analysis feature');
      return;
    }

    setLoading(true);
    setError(null);
    setVisionResponse(null);

    const startTime = Date.now();

    try {
      // Send imageUrl or imageBase64 based on mode
      const requestPayload: Record<string, unknown> = {
        serviceType: 'vision',
        visionEndpoint: visionConfig.endpoint,
        apiKey: visionConfig.apiKey,
        visionFeatures: enabledFeatures,
        smartCropRatios: enabledFeatures.includes('smartCrops') ? smartCropRatios : undefined,
      };

      if (imageIsUrl) {
        requestPayload.imageUrl = imagePreview;
      } else {
        requestPayload.imageBase64 = imagePreview;
      }

      const proxyRes = await fetch('/api/proxy/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestPayload),
      });

      const proxyData = await proxyRes.json();
      
      if (proxyData.error) {
        throw new Error(proxyData.error);
      }

      const duration = Date.now() - startTime;
      setVisionResponse({
        data: proxyData.data,
        status: proxyData.status,
        duration,
      });
    } catch (err) {
      const duration = Date.now() - startTime;
      let errorMessage = 'Vision API request failed. ';
      if (err instanceof Error) {
        errorMessage += err.message;
      }
      setError(errorMessage);
      setVisionResponse({
        data: null,
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
    if (item.imagePreview) setImagePreview(item.imagePreview);
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
            Azure AI Services Tester
          </h1>
          <p className="text-dark-400 max-w-2xl mx-auto">
            Test Azure Machine Learning models and Azure AI Vision services.
            Perfect for learning how AI APIs work in real applications.
          </p>
        </div>

        {/* Service Selector */}
        <ServiceSelector 
          selectedService={selectedService} 
          onServiceChange={setSelectedService} 
        />

        {/* ============ ML STUDIO MODE ============ */}
        {selectedService === 'ml-studio' && (
          <>
            {/* Quick tips */}
            <div className="mb-8 p-4 bg-gradient-to-r from-azure-500/10 to-purple-500/10 border border-azure-500/30 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-azure-500/20 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5 text-azure-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">📚 ML Studio Quick Start</h3>
                  <ol className="text-sm text-dark-400 space-y-1">
                    <li>1. Enter your Azure ML endpoint URL and API key</li>
                    <li>2. Choose <strong className="text-violet-400">Visual Form</strong>, <strong className="text-purple-400">JSON</strong>, or <strong className="text-pink-400">Image</strong> mode</li>
                    <li>3. Build your request and click &quot;Send Request&quot;</li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <EndpointConfigComponent config={config} onChange={setConfig} />

                {/* CORS Proxy Toggle */}
                <div className="p-4 bg-dark-800/50 border border-dark-700 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${useProxy ? 'bg-green-500/20' : 'bg-yellow-500/20'}`}>
                        <Shield className={`w-5 h-5 ${useProxy ? 'text-green-400' : 'text-yellow-400'}`} />
                      </div>
                      <div>
                        <span className="text-white font-medium">CORS Proxy Mode</span>
                        <p className="text-xs text-dark-400 mt-0.5">
                          {useProxy ? 'Requests go through server proxy' : 'Direct browser calls'}
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={useProxy} onChange={(e) => setUseProxy(e.target.checked)} className="sr-only peer" />
                      <div className="w-14 h-7 bg-dark-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500"></div>
                    </label>
                  </div>
                  {showCorsHelp && !useProxy && (
                    <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-yellow-300">CORS error detected. Enable proxy above.</p>
                    </div>
                  )}
                </div>

                {/* Input Mode Toggle */}
                <div className="p-1 bg-dark-800/50 rounded-2xl border border-dark-700">
                  <div className="grid grid-cols-3 gap-1">
                    <button onClick={() => setInputMode('visual')} className={`relative flex flex-col items-center justify-center gap-1.5 py-4 px-3 rounded-xl font-medium transition-all ${inputMode === 'visual' ? 'bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30 text-white border border-violet-500/50' : 'text-dark-400 hover:text-white hover:bg-dark-700/50'}`}>
                      {inputMode === 'visual' && <div className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-green-500 rounded-full text-[10px] text-white font-bold">EASY</div>}
                      <Sparkles className="w-5 h-5" />
                      <span className="text-sm">Visual Form</span>
                    </button>
                    <button onClick={() => setInputMode('json')} className={`flex flex-col items-center justify-center gap-1.5 py-4 px-3 rounded-xl font-medium transition-all ${inputMode === 'json' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50' : 'text-dark-400 hover:text-white hover:bg-dark-700/50'}`}>
                      <Code className="w-5 h-5" />
                      <span className="text-sm">JSON Editor</span>
                    </button>
                    <button onClick={() => setInputMode('image')} className={`flex flex-col items-center justify-center gap-1.5 py-4 px-3 rounded-xl font-medium transition-all ${inputMode === 'image' ? 'bg-pink-500/20 text-pink-400 border border-pink-500/50' : 'text-dark-400 hover:text-white hover:bg-dark-700/50'}`}>
                      <ImageIcon className="w-5 h-5" />
                      <span className="text-sm">Image Upload</span>
                    </button>
                  </div>
                </div>

                <div className="min-h-[450px]">
                  {inputMode === 'visual' && <FormBuilder onJsonGenerated={handleFormJsonGenerated} />}
                  {inputMode === 'json' && <RequestBuilder value={requestBody} onChange={setRequestBody} />}
                  {inputMode === 'image' && <ImageUploader onImageSelect={handleImageSelect} />}
                </div>

                <button onClick={handleSendMLRequest} disabled={loading || !config.url || !config.apiKey} className="w-full btn-primary py-4 px-6 rounded-xl text-white font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? (<><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending...</>) : (<><Send className="w-5 h-5" />Send Request<Zap className="w-4 h-4 opacity-70" /></>)}
                </button>

                <button onClick={() => setShowCodeSnippets(!showCodeSnippets)} className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-dark-800 hover:bg-dark-700 rounded-xl text-dark-400 hover:text-white transition-colors">
                  {showCodeSnippets ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  <Layers className="w-4 h-4" />
                  {showCodeSnippets ? 'Hide' : 'Show'} Code Snippets
                </button>

                {showCodeSnippets && (
                  <div className="space-y-6 animate-fade-in">
                    <CurlGenerator config={config} requestBody={requestBody} />
                    <CodeGenerator config={config} requestBody={requestBody} />
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="min-h-[450px]">
                  <ResponseViewer response={response} loading={loading} error={error} />
                </div>
                <RequestHistory history={history} onSelect={handleHistorySelect} onClear={handleClearHistory} />
              </div>
            </div>
          </>
        )}

        {/* ============ VISION MODE ============ */}
        {selectedService === 'vision' && (
          <>
            {/* Quick tips */}
            <div className="mb-8 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <Eye className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">👁️ Vision API Quick Start</h3>
                  <ol className="text-sm text-dark-400 space-y-1">
                    <li>1. Enter your Azure AI Services endpoint and API key</li>
                    <li>2. Select analysis features (caption, tags, objects, OCR)</li>
                    <li>3. Upload an image and click &quot;Analyze Image&quot;</li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <VisionConfig config={visionConfig} onChange={setVisionConfig} />

                <VisionTemplates onSelectTemplate={setVisionFeatures} />

                <VisionFeatureSelector 
                  features={visionFeatures} 
                  onChange={setVisionFeatures}
                  smartCropRatios={smartCropRatios}
                  onSmartCropRatiosChange={setSmartCropRatios}
                />

                {/* Image Upload for Vision */}
                <div className="min-h-[300px]">
                  <ImageUploader onImageSelect={(base64OrUrl, _body, isUrl) => { 
                    setImagePreview(base64OrUrl); 
                    setImageIsUrl(isUrl || false);
                  }} />
                </div>

                <button onClick={handleSendVisionRequest} disabled={loading || !visionConfig.endpoint || !visionConfig.apiKey || !imagePreview} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 py-4 px-6 rounded-xl text-white font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                  {loading ? (<><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Analyzing...</>) : (<><Eye className="w-5 h-5" />Analyze Image<Sparkles className="w-4 h-4 opacity-70" /></>)}
                </button>

                <button onClick={() => setShowCodeSnippets(!showCodeSnippets)} className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-dark-800 hover:bg-dark-700 rounded-xl text-dark-400 hover:text-white transition-colors">
                  {showCodeSnippets ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  <Layers className="w-4 h-4" />
                  {showCodeSnippets ? 'Hide' : 'Show'} Code Snippets
                </button>

                {showCodeSnippets && (
                  <div className="animate-fade-in">
                    <VisionCodeGenerator config={visionConfig} features={visionFeatures} />
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <VisionResponseViewer 
                  response={visionResponse} 
                  loading={loading} 
                  error={error} 
                  imagePreview={imagePreview}
                />
              </div>
            </div>
          </>
        )}

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-dark-700">
          <div className="text-center text-dark-500 text-sm">
            <p className="mb-2">🎓 Educational Tool for Azure AI Services</p>
            <p className="text-xs">Your API keys are stored locally and never sent to external servers.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
