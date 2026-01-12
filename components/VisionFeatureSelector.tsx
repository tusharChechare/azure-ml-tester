'use client';

import { 
  MessageSquare, 
  Tags, 
  Box, 
  FileText, 
  Users, 
  Crop,
  MessageCircle,
  Info
} from 'lucide-react';

export interface VisionFeatures {
  caption: boolean;
  denseCaptions: boolean;
  tags: boolean;
  objects: boolean;
  people: boolean;
  read: boolean;
  smartCrops: boolean;
}

export interface SmartCropAspectRatio {
  id: string;
  name: string;
  ratio: number;
  description: string;
}

export const ASPECT_RATIO_PRESETS: SmartCropAspectRatio[] = [
  { id: 'square', name: 'Square', ratio: 1.0, description: '1:1 - Profile pics, Instagram' },
  { id: 'landscape', name: 'Landscape', ratio: 1.5, description: '3:2 - Standard photos' },
  { id: 'portrait', name: 'Portrait', ratio: 0.67, description: '2:3 - Pinterest, posters' },
  { id: 'widescreen', name: 'Widescreen', ratio: 1.78, description: '16:9 - YouTube, presentations' },
  { id: 'vertical', name: 'Vertical', ratio: 0.56, description: '9:16 - TikTok, Stories' },
];

interface VisionFeatureSelectorProps {
  features: VisionFeatures;
  onChange: (features: VisionFeatures) => void;
  smartCropRatios?: number[];
  onSmartCropRatiosChange?: (ratios: number[]) => void;
}

const featureConfig = [
  {
    id: 'caption' as keyof VisionFeatures,
    name: 'Caption',
    description: 'Generate a description of the image',
    icon: MessageSquare,
    color: 'text-blue-400',
    bg: 'bg-blue-500/20',
    recommended: true,
  },
  {
    id: 'tags' as keyof VisionFeatures,
    name: 'Tags',
    description: 'Identify objects and concepts',
    icon: Tags,
    color: 'text-green-400',
    bg: 'bg-green-500/20',
    recommended: true,
  },
  {
    id: 'objects' as keyof VisionFeatures,
    name: 'Objects',
    description: 'Detect and locate objects with bounding boxes',
    icon: Box,
    color: 'text-amber-400',
    bg: 'bg-amber-500/20',
    recommended: true,
  },
  {
    id: 'read' as keyof VisionFeatures,
    name: 'Read (OCR)',
    description: 'Extract text from the image',
    icon: FileText,
    color: 'text-purple-400',
    bg: 'bg-purple-500/20',
    recommended: true,
  },
  {
    id: 'denseCaptions' as keyof VisionFeatures,
    name: 'Dense Captions',
    description: 'Detailed descriptions for image regions',
    icon: MessageCircle,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/20',
    recommended: false,
  },
  {
    id: 'people' as keyof VisionFeatures,
    name: 'People',
    description: 'Detect people in the image',
    icon: Users,
    color: 'text-pink-400',
    bg: 'bg-pink-500/20',
    recommended: false,
  },
  {
    id: 'smartCrops' as keyof VisionFeatures,
    name: 'Smart Crops',
    description: 'Suggest optimal crop regions',
    icon: Crop,
    color: 'text-orange-400',
    bg: 'bg-orange-500/20',
    recommended: false,
  },
];

export default function VisionFeatureSelector({ 
  features, 
  onChange,
  smartCropRatios = [1.0],
  onSmartCropRatiosChange
}: VisionFeatureSelectorProps) {
  const handleToggle = (featureId: keyof VisionFeatures) => {
    onChange({
      ...features,
      [featureId]: !features[featureId],
    });
  };

  const toggleAspectRatio = (ratio: number) => {
    if (!onSmartCropRatiosChange) return;
    
    const currentRatios = [...smartCropRatios];
    const index = currentRatios.findIndex(r => Math.abs(r - ratio) < 0.01);
    
    if (index >= 0) {
      // Remove if already selected (but keep at least one)
      if (currentRatios.length > 1) {
        currentRatios.splice(index, 1);
      }
    } else {
      // Add if not selected
      currentRatios.push(ratio);
    }
    
    onSmartCropRatiosChange(currentRatios);
  };

  const isRatioSelected = (ratio: number) => {
    return smartCropRatios.some(r => Math.abs(r - ratio) < 0.01);
  };

  const selectedCount = Object.values(features).filter(Boolean).length;

  const selectRecommended = () => {
    onChange({
      caption: true,
      tags: true,
      objects: true,
      read: true,
      denseCaptions: false,
      people: false,
      smartCrops: false,
    });
  };

  const selectAll = () => {
    onChange({
      caption: true,
      denseCaptions: true,
      tags: true,
      objects: true,
      people: true,
      read: true,
      smartCrops: true,
    });
  };

  const clearAll = () => {
    onChange({
      caption: false,
      denseCaptions: false,
      tags: false,
      objects: false,
      people: false,
      read: false,
      smartCrops: false,
    });
  };

  return (
    <div className="card">
      <div className="card-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
            <Tags className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <h2 className="text-white font-medium">Analysis Features</h2>
            <p className="text-xs text-dark-500">{selectedCount} features selected</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={selectRecommended}
            className="px-3 py-1.5 text-xs text-purple-400 hover:text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 rounded-md transition-colors"
          >
            Recommended
          </button>
          <button
            onClick={selectAll}
            className="px-3 py-1.5 text-xs text-dark-400 hover:text-white bg-dark-700 hover:bg-dark-600 rounded-md transition-colors"
          >
            All
          </button>
          <button
            onClick={clearAll}
            className="px-3 py-1.5 text-xs text-dark-400 hover:text-white bg-dark-700 hover:bg-dark-600 rounded-md transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="p-4">
        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {featureConfig.map((feature) => {
            const Icon = feature.icon;
            const isSelected = features[feature.id];

            return (
              <button
                key={feature.id}
                onClick={() => handleToggle(feature.id)}
                className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                  isSelected
                    ? `${feature.bg} border-current ${feature.color}`
                    : 'bg-dark-800/50 border-dark-600 hover:border-dark-500'
                }`}
              >
                {/* Recommended badge */}
                {feature.recommended && (
                  <div className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 bg-green-500 rounded text-[9px] text-white font-bold">
                    REC
                  </div>
                )}

                <div className="flex items-start gap-3">
                  {/* Checkbox */}
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                    isSelected
                      ? `${feature.bg} border-current ${feature.color}`
                      : 'border-dark-500'
                  }`}>
                    {isSelected && (
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>

                  {/* Icon */}
                  <div className={`w-8 h-8 rounded-lg ${feature.bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-4 h-4 ${feature.color}`} />
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-medium text-sm ${isSelected ? 'text-white' : 'text-dark-300'}`}>
                      {feature.name}
                    </h3>
                    <p className={`text-xs mt-0.5 ${isSelected ? 'text-dark-300' : 'text-dark-500'}`}>
                      {feature.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Smart Crops Aspect Ratio Selection */}
        {features.smartCrops && onSmartCropRatiosChange && (
          <div className="mt-4 p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <Crop className="w-4 h-4 text-orange-400" />
              <h3 className="text-sm font-medium text-orange-400">Smart Crop Aspect Ratios</h3>
              <span className="px-1.5 py-0.5 bg-orange-500/20 rounded text-[10px] text-orange-300">
                {smartCropRatios.length} selected
              </span>
            </div>
            
            <p className="text-xs text-dark-400 mb-3">
              Select the aspect ratios you want crop suggestions for:
            </p>
            
            <div className="flex flex-wrap gap-2">
              {ASPECT_RATIO_PRESETS.map((preset) => {
                const selected = isRatioSelected(preset.ratio);
                return (
                  <button
                    key={preset.id}
                    onClick={() => toggleAspectRatio(preset.ratio)}
                    className={`group relative px-3 py-2 rounded-lg border-2 transition-all ${
                      selected
                        ? 'bg-orange-500/20 border-orange-500 text-orange-300'
                        : 'bg-dark-800 border-dark-600 text-dark-400 hover:border-dark-500 hover:text-dark-300'
                    }`}
                    title={preset.description}
                  >
                    <div className="flex flex-col items-center gap-0.5">
                      <span className="text-sm font-medium">{preset.name}</span>
                      <span className={`text-[10px] ${selected ? 'text-orange-400' : 'text-dark-500'}`}>
                        {preset.ratio.toFixed(2)}
                      </span>
                    </div>
                    
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-dark-900 border border-dark-600 rounded text-[10px] text-dark-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      {preset.description}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-dark-600" />
                    </div>
                  </button>
                );
              })}
            </div>
            
            <div className="mt-3 text-[10px] text-dark-500">
              💡 The API will return the best crop region for each selected aspect ratio
            </div>
          </div>
        )}

        {/* Warning if no features selected */}
        {selectedCount === 0 && (
          <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <p className="text-xs text-amber-300">
              Please select at least one feature to analyze the image.
            </p>
          </div>
        )}

        {/* Educational note */}
        <div className="mt-4 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
          <p className="text-xs text-purple-300">
            <strong>💡 Learning Note:</strong> Each feature calls a different AI model. 
            More features = more processing time. Start with recommended features to learn the basics!
          </p>
        </div>
      </div>
    </div>
  );
}

