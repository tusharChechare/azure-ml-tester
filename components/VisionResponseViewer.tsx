'use client';

import { useState } from 'react';
import { 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Copy, 
  Check,
  MessageSquare,
  Tags,
  Box,
  FileText,
  Users,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { formatDuration, prettyJson } from '@/lib/utils';

interface BoundingBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface VisionResponse {
  captionResult?: {
    text: string;
    confidence: number;
  };
  denseCaptionsResult?: {
    values: Array<{
      text: string;
      confidence: number;
      boundingBox: BoundingBox;
    }>;
  };
  tagsResult?: {
    values: Array<{
      name: string;
      confidence: number;
    }>;
  };
  objectsResult?: {
    values: Array<{
      tags: Array<{ name: string; confidence: number }>;
      boundingBox: BoundingBox;
    }>;
  };
  peopleResult?: {
    values: Array<{
      boundingBox: BoundingBox;
      confidence: number;
    }>;
  };
  readResult?: {
    blocks: Array<{
      lines: Array<{
        text: string;
        boundingPolygon: Array<{ x: number; y: number }>;
      }>;
    }>;
  };
  smartCropsResult?: {
    values: Array<{
      aspectRatio: number;
      boundingBox: BoundingBox;
    }>;
  };
}

interface VisionResponseViewerProps {
  response: {
    data: VisionResponse | null;
    status: number;
    duration: number;
  } | null;
  loading: boolean;
  error: string | null;
  imagePreview: string | null;
}

export default function VisionResponseViewer({ 
  response, 
  loading, 
  error, 
  imagePreview 
}: VisionResponseViewerProps) {
  const [view, setView] = useState<'visual' | 'json'>('visual');
  const [copied, setCopied] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    caption: true,
    tags: true,
    objects: true,
    text: true,
    people: false,
  });

  const handleCopy = async () => {
    if (response?.data) {
      await navigator.clipboard.writeText(prettyJson(response.data as object));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const getStatusInfo = () => {
    if (loading) {
      return { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/20', text: 'Analyzing...' };
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
  const data = response?.data;

  // Get all bounding boxes for overlay
  const getAllBoundingBoxes = (): Array<{ box: BoundingBox; label: string; color: string }> => {
    const boxes: Array<{ box: BoundingBox; label: string; color: string }> = [];
    
    if (data?.objectsResult?.values) {
      data.objectsResult.values.forEach((obj) => {
        const label = obj.tags[0]?.name || 'object';
        boxes.push({ box: obj.boundingBox, label, color: '#f59e0b' });
      });
    }
    
    if (data?.peopleResult?.values) {
      data.peopleResult.values.forEach((person, i) => {
        boxes.push({ box: person.boundingBox, label: `Person ${i + 1}`, color: '#ec4899' });
      });
    }
    
    return boxes;
  };

  const boundingBoxes = getAllBoundingBoxes();

  return (
    <div className="card h-full flex flex-col">
      <div className="card-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg ${statusInfo.bg} flex items-center justify-center`}>
            <StatusIcon className={`w-4 h-4 ${statusInfo.color}`} />
          </div>
          <h2 className="text-white font-medium">Analysis Results</h2>
          {response && (
            <>
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                response.status >= 200 && response.status < 300 ? 'status-success' : 'status-error'
              }`}>
                {response.status}
              </span>
              <span className="text-xs text-dark-400">
                {formatDuration(response.duration)}
              </span>
            </>
          )}
        </div>
        
        {response && (
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg overflow-hidden border border-dark-600">
              <button
                onClick={() => setView('visual')}
                className={`px-3 py-1.5 text-xs transition-colors ${
                  view === 'visual' ? 'bg-purple-500 text-white' : 'text-dark-400 hover:text-white'
                }`}
              >
                Visual
              </button>
              <button
                onClick={() => setView('json')}
                className={`px-3 py-1.5 text-xs transition-colors ${
                  view === 'json' ? 'bg-purple-500 text-white' : 'text-dark-400 hover:text-white'
                }`}
              >
                JSON
              </button>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-dark-400 hover:text-white bg-dark-700 hover:bg-dark-600 rounded-md transition-colors"
            >
              {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {loading ? (
          <div className="flex-1 flex items-center justify-center h-64">
            <div className="text-center">
              <div className="relative inline-flex">
                <div className="w-12 h-12 rounded-full border-4 border-dark-700 border-t-purple-500 animate-spin" />
              </div>
              <p className="mt-4 text-dark-400">Analyzing image with Azure AI Vision...</p>
              <p className="text-xs text-dark-500 mt-1">This may take a few seconds</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex-1 flex flex-col items-center justify-center h-64">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
            <p className="text-red-400 font-medium mb-2">Analysis Failed</p>
            <p className="text-sm text-dark-400 text-center max-w-md">{error}</p>
          </div>
        ) : response && data ? (
          view === 'json' ? (
            <div className="code-block p-4 overflow-auto max-h-[500px]">
              <pre className="text-sm text-dark-200 font-mono whitespace-pre-wrap">
                {prettyJson(data as object)}
              </pre>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Image with Bounding Boxes */}
              {imagePreview && boundingBoxes.length > 0 && (
                <div className="relative bg-dark-800 rounded-lg overflow-hidden">
                  <div className="relative inline-block w-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imagePreview}
                      alt="Analyzed"
                      className="w-full h-auto max-h-64 object-contain"
                      id="vision-image"
                    />
                    {/* Bounding box overlays - simplified version */}
                    <svg 
                      className="absolute inset-0 w-full h-full pointer-events-none"
                      viewBox="0 0 100 100"
                      preserveAspectRatio="none"
                    >
                      {boundingBoxes.map((item, index) => (
                        <g key={index}>
                          <rect
                            x={`${item.box.x / 10}%`}
                            y={`${item.box.y / 10}%`}
                            width={`${item.box.w / 10}%`}
                            height={`${item.box.h / 10}%`}
                            fill="none"
                            stroke={item.color}
                            strokeWidth="0.5"
                          />
                          <text
                            x={`${item.box.x / 10}%`}
                            y={`${(item.box.y / 10) - 1}%`}
                            fill={item.color}
                            fontSize="3"
                            fontWeight="bold"
                          >
                            {item.label}
                          </text>
                        </g>
                      ))}
                    </svg>
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-1 bg-dark-900/80 rounded text-xs text-dark-400">
                    {boundingBoxes.length} objects detected
                  </div>
                </div>
              )}

              {/* Caption */}
              {data.captionResult && (
                <div className="bg-dark-800 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleSection('caption')}
                    className="w-full p-3 flex items-center justify-between hover:bg-dark-700/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-blue-400" />
                      <span className="text-white font-medium">Caption</span>
                    </div>
                    {expandedSections.caption ? <ChevronUp className="w-4 h-4 text-dark-400" /> : <ChevronDown className="w-4 h-4 text-dark-400" />}
                  </button>
                  {expandedSections.caption && (
                    <div className="px-3 pb-3">
                      <p className="text-dark-200 italic">&quot;{data.captionResult.text}&quot;</p>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 h-2 bg-dark-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${data.captionResult.confidence * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-dark-400">
                          {(data.captionResult.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tags */}
              {data.tagsResult?.values && data.tagsResult.values.length > 0 && (
                <div className="bg-dark-800 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleSection('tags')}
                    className="w-full p-3 flex items-center justify-between hover:bg-dark-700/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Tags className="w-4 h-4 text-green-400" />
                      <span className="text-white font-medium">Tags</span>
                      <span className="px-1.5 py-0.5 bg-dark-700 rounded text-xs text-dark-400">
                        {data.tagsResult.values.length}
                      </span>
                    </div>
                    {expandedSections.tags ? <ChevronUp className="w-4 h-4 text-dark-400" /> : <ChevronDown className="w-4 h-4 text-dark-400" />}
                  </button>
                  {expandedSections.tags && (
                    <div className="px-3 pb-3">
                      <div className="flex flex-wrap gap-2">
                        {data.tagsResult.values.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm flex items-center gap-1"
                          >
                            {tag.name}
                            <span className="text-xs text-green-500/70">
                              {(tag.confidence * 100).toFixed(0)}%
                            </span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Objects */}
              {data.objectsResult?.values && data.objectsResult.values.length > 0 && (
                <div className="bg-dark-800 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleSection('objects')}
                    className="w-full p-3 flex items-center justify-between hover:bg-dark-700/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Box className="w-4 h-4 text-amber-400" />
                      <span className="text-white font-medium">Objects Detected</span>
                      <span className="px-1.5 py-0.5 bg-dark-700 rounded text-xs text-dark-400">
                        {data.objectsResult.values.length}
                      </span>
                    </div>
                    {expandedSections.objects ? <ChevronUp className="w-4 h-4 text-dark-400" /> : <ChevronDown className="w-4 h-4 text-dark-400" />}
                  </button>
                  {expandedSections.objects && (
                    <div className="px-3 pb-3 space-y-2">
                      {data.objectsResult.values.map((obj, index) => (
                        <div key={index} className="p-2 bg-dark-700/50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-amber-400 font-medium">
                              {obj.tags[0]?.name || 'Unknown'}
                            </span>
                            <span className="text-xs text-dark-400">
                              {(obj.tags[0]?.confidence * 100).toFixed(1)}%
                            </span>
                          </div>
                          <p className="text-xs text-dark-500 mt-1">
                            Position: ({obj.boundingBox.x}, {obj.boundingBox.y}) | 
                            Size: {obj.boundingBox.w}×{obj.boundingBox.h}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* People */}
              {data.peopleResult?.values && data.peopleResult.values.length > 0 && (
                <div className="bg-dark-800 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleSection('people')}
                    className="w-full p-3 flex items-center justify-between hover:bg-dark-700/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-pink-400" />
                      <span className="text-white font-medium">People Detected</span>
                      <span className="px-1.5 py-0.5 bg-dark-700 rounded text-xs text-dark-400">
                        {data.peopleResult.values.length}
                      </span>
                    </div>
                    {expandedSections.people ? <ChevronUp className="w-4 h-4 text-dark-400" /> : <ChevronDown className="w-4 h-4 text-dark-400" />}
                  </button>
                  {expandedSections.people && (
                    <div className="px-3 pb-3">
                      <p className="text-dark-300 text-sm">
                        {data.peopleResult.values.length} person(s) detected in the image.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* OCR Text */}
              {data.readResult?.blocks && data.readResult.blocks.length > 0 && (
                <div className="bg-dark-800 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleSection('text')}
                    className="w-full p-3 flex items-center justify-between hover:bg-dark-700/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-purple-400" />
                      <span className="text-white font-medium">Extracted Text (OCR)</span>
                    </div>
                    {expandedSections.text ? <ChevronUp className="w-4 h-4 text-dark-400" /> : <ChevronDown className="w-4 h-4 text-dark-400" />}
                  </button>
                  {expandedSections.text && (
                    <div className="px-3 pb-3">
                      <div className="p-3 bg-dark-700/50 rounded-lg font-mono text-sm text-dark-200">
                        {data.readResult.blocks.map((block, blockIndex) => (
                          <div key={blockIndex} className="mb-2">
                            {block.lines.map((line, lineIndex) => (
                              <p key={lineIndex}>{line.text}</p>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* No results message */}
              {!data.captionResult && !data.tagsResult && !data.objectsResult && !data.readResult && (
                <div className="text-center py-8">
                  <Eye className="w-12 h-12 text-dark-500 mx-auto mb-3" />
                  <p className="text-dark-400">No analysis results available</p>
                  <p className="text-xs text-dark-500">Try selecting different features</p>
                </div>
              )}
            </div>
          )
        ) : (
          <div className="flex-1 flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-dark-800 flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-dark-500" />
              </div>
              <p className="text-dark-400 mb-2">No analysis yet</p>
              <p className="text-xs text-dark-500">Upload an image and click Analyze</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

