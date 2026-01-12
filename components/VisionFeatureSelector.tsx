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

interface VisionFeatureSelectorProps {
  features: VisionFeatures;
  onChange: (features: VisionFeatures) => void;
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

export default function VisionFeatureSelector({ features, onChange }: VisionFeatureSelectorProps) {
  const handleToggle = (featureId: keyof VisionFeatures) => {
    onChange({
      ...features,
      [featureId]: !features[featureId],
    });
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

