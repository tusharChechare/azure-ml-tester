'use client';

import { Target, Search, FileText, Microscope } from 'lucide-react';
import type { VisionFeatures } from './VisionFeatureSelector';

interface VisionTemplatesProps {
  onSelectTemplate: (features: VisionFeatures) => void;
}

const templates = [
  {
    id: 'quick',
    name: 'Quick Analysis',
    description: 'Caption + Tags',
    icon: Target,
    color: 'text-blue-400',
    bg: 'bg-blue-500/20',
    hoverBg: 'hover:bg-blue-500/30',
    features: {
      caption: true,
      tags: true,
      objects: false,
      read: false,
      denseCaptions: false,
      people: false,
      smartCrops: false,
    },
    level: 'Beginner',
  },
  {
    id: 'objects',
    name: 'Object Detection',
    description: 'Find & locate objects',
    icon: Search,
    color: 'text-amber-400',
    bg: 'bg-amber-500/20',
    hoverBg: 'hover:bg-amber-500/30',
    features: {
      caption: true,
      tags: true,
      objects: true,
      read: false,
      denseCaptions: false,
      people: false,
      smartCrops: false,
    },
    level: 'Intermediate',
  },
  {
    id: 'ocr',
    name: 'Text Extraction',
    description: 'OCR for documents',
    icon: FileText,
    color: 'text-purple-400',
    bg: 'bg-purple-500/20',
    hoverBg: 'hover:bg-purple-500/30',
    features: {
      caption: false,
      tags: false,
      objects: false,
      read: true,
      denseCaptions: false,
      people: false,
      smartCrops: false,
    },
    level: 'Practical',
  },
  {
    id: 'full',
    name: 'Full Analysis',
    description: 'All features enabled',
    icon: Microscope,
    color: 'text-green-400',
    bg: 'bg-green-500/20',
    hoverBg: 'hover:bg-green-500/30',
    features: {
      caption: true,
      tags: true,
      objects: true,
      read: true,
      denseCaptions: true,
      people: true,
      smartCrops: false,
    },
    level: 'Advanced',
  },
];

export default function VisionTemplates({ onSelectTemplate }: VisionTemplatesProps) {
  return (
    <div className="mb-4">
      <p className="text-sm text-dark-400 mb-3">Quick Templates:</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {templates.map((template) => {
          const Icon = template.icon;
          return (
            <button
              key={template.id}
              onClick={() => onSelectTemplate(template.features)}
              className={`p-3 rounded-xl ${template.bg} ${template.hoverBg} border border-transparent hover:border-current ${template.color} transition-all group text-left`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon className={`w-4 h-4 ${template.color}`} />
                <span className={`text-xs font-medium ${template.color}`}>{template.name}</span>
              </div>
              <p className="text-[10px] text-dark-400 group-hover:text-dark-300">
                {template.description}
              </p>
              <span className="inline-block mt-1 px-1.5 py-0.5 bg-dark-800/50 rounded text-[9px] text-dark-500">
                {template.level}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

