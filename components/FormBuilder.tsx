'use client';

import { useState, useCallback } from 'react';
import {
  Plus,
  Trash2,
  GripVertical,
  Type,
  Hash,
  ToggleLeft,
  Image as ImageIcon,
  FileText,
  ChevronDown,
  Copy,
  Check,
  Sparkles,
  Eye,
  EyeOff,
  Upload,
  X,
  HelpCircle,
} from 'lucide-react';
import { fileToBase64, generateId } from '@/lib/utils';

export interface FormField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'boolean' | 'image' | 'file';
  value: string | number | boolean;
  base64Data?: string;
  fileName?: string;
}

interface FormBuilderProps {
  onJsonGenerated: (json: string) => void;
}

const fieldTypeConfig = {
  text: { icon: Type, label: 'Text', color: 'text-blue-400', bg: 'bg-blue-500/20' },
  number: { icon: Hash, label: 'Number', color: 'text-green-400', bg: 'bg-green-500/20' },
  boolean: { icon: ToggleLeft, label: 'Yes/No', color: 'text-purple-400', bg: 'bg-purple-500/20' },
  image: { icon: ImageIcon, label: 'Image', color: 'text-pink-400', bg: 'bg-pink-500/20' },
  file: { icon: FileText, label: 'File', color: 'text-orange-400', bg: 'bg-orange-500/20' },
};

const sampleTemplates = [
  {
    name: '🚢 Titanic Survival',
    fields: [
      { name: 'PassengerId', type: 'number' as const, value: 1 },
      { name: 'Pclass', type: 'number' as const, value: 3 },
      { name: 'Name', type: 'text' as const, value: 'John Doe' },
      { name: 'Sex', type: 'text' as const, value: 'male' },
      { name: 'Age', type: 'number' as const, value: 25 },
      { name: 'SibSp', type: 'number' as const, value: 0 },
      { name: 'Parch', type: 'number' as const, value: 0 },
      { name: 'Ticket', type: 'text' as const, value: 'A/5 21171' },
      { name: 'Fare', type: 'number' as const, value: 7.25 },
      { name: 'Cabin', type: 'text' as const, value: '' },
      { name: 'Embarked', type: 'text' as const, value: 'S' },
    ],
  },
  {
    name: '🚴 Bike Rental Prediction',
    fields: [
      { name: 'day', type: 'number' as const, value: 1 },
      { name: 'mnth', type: 'number' as const, value: 6 },
      { name: 'year', type: 'number' as const, value: 2024 },
      { name: 'season', type: 'number' as const, value: 2 },
      { name: 'holiday', type: 'number' as const, value: 0 },
      { name: 'weekday', type: 'number' as const, value: 1 },
      { name: 'workingday', type: 'number' as const, value: 1 },
      { name: 'weathersit', type: 'number' as const, value: 1 },
      { name: 'temp', type: 'number' as const, value: 0.5 },
      { name: 'atemp', type: 'number' as const, value: 0.5 },
      { name: 'hum', type: 'number' as const, value: 0.5 },
      { name: 'windspeed', type: 'number' as const, value: 0.2 },
    ],
  },
  {
    name: '🏠 House Price Prediction',
    fields: [
      { name: 'bedrooms', type: 'number' as const, value: 3 },
      { name: 'bathrooms', type: 'number' as const, value: 2 },
      { name: 'sqft', type: 'number' as const, value: 1500 },
      { name: 'location', type: 'text' as const, value: 'suburban' },
    ],
  },
  {
    name: '📊 Customer Churn',
    fields: [
      { name: 'tenure_months', type: 'number' as const, value: 12 },
      { name: 'monthly_charges', type: 'number' as const, value: 50 },
      { name: 'has_contract', type: 'boolean' as const, value: true },
      { name: 'internet_service', type: 'text' as const, value: 'fiber' },
    ],
  },
  {
    name: '🖼️ Image Classification',
    fields: [
      { name: 'image', type: 'image' as const, value: '' },
    ],
  },
];

export default function FormBuilder({ onJsonGenerated }: FormBuilderProps) {
  const [fields, setFields] = useState<FormField[]>([
    { id: generateId(), name: 'feature1', type: 'number', value: 0 },
  ]);
  const [showPreview, setShowPreview] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Generate JSON from fields
  const generateJson = useCallback(() => {
    const columns = fields.map(f => f.name);
    const data = fields.map(f => {
      if (f.type === 'image' || f.type === 'file') {
        return f.base64Data || '';
      }
      if (f.type === 'number') {
        return Number(f.value) || 0;
      }
      if (f.type === 'boolean') {
        return f.value === true || f.value === 'true';
      }
      return f.value;
    });

    const json = {
      input_data: {
        columns,
        data: [data],
      },
    };

    return JSON.stringify(json, null, 2);
  }, [fields]);

  // Update parent when fields change
  const updateParent = useCallback((newFields: FormField[]) => {
    setFields(newFields);
    const tempFields = newFields;
    const columns = tempFields.map(f => f.name);
    const data = tempFields.map(f => {
      if (f.type === 'image' || f.type === 'file') {
        return f.base64Data || '';
      }
      if (f.type === 'number') {
        return Number(f.value) || 0;
      }
      if (f.type === 'boolean') {
        return f.value === true || f.value === 'true';
      }
      return f.value;
    });
    const json = { input_data: { columns, data: [data] } };
    onJsonGenerated(JSON.stringify(json, null, 2));
  }, [onJsonGenerated]);

  const addField = () => {
    const newField: FormField = {
      id: generateId(),
      name: `feature${fields.length + 1}`,
      type: 'text',
      value: '',
    };
    updateParent([...fields, newField]);
  };

  const removeField = (id: string) => {
    if (fields.length > 1) {
      updateParent(fields.filter(f => f.id !== id));
    }
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    updateParent(fields.map(f => (f.id === id ? { ...f, ...updates } : f)));
  };

  const handleFileUpload = async (id: string, file: File) => {
    try {
      const base64 = await fileToBase64(file);
      updateField(id, { 
        base64Data: base64, 
        fileName: file.name,
        value: file.name 
      });
    } catch (error) {
      console.error('Failed to process file:', error);
    }
  };

  const loadTemplate = (template: typeof sampleTemplates[0]) => {
    const newFields = template.fields.map(f => ({
      id: generateId(),
      name: f.name,
      type: f.type,
      value: f.value,
    }));
    updateParent(newFields);
    setShowTemplates(false);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generateJson());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Drag and drop handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    
    const newFields = [...fields];
    const draggedField = newFields[draggedIndex];
    newFields.splice(draggedIndex, 1);
    newFields.splice(index, 0, draggedField);
    setFields(newFields);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    onJsonGenerated(generateJson());
  };

  return (
    <div className="card h-full flex flex-col">
      <div className="card-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-violet-400" />
          </div>
          <div>
            <h2 className="text-white font-medium">Visual Form Builder</h2>
            <p className="text-xs text-dark-500">Build your request without code</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Templates dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-dark-400 hover:text-white bg-dark-700 hover:bg-dark-600 rounded-md transition-colors"
            >
              <FileText className="w-3 h-3" />
              Templates
              <ChevronDown className={`w-3 h-3 transition-transform ${showTemplates ? 'rotate-180' : ''}`} />
            </button>
            
            {showTemplates && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-dark-800 border border-dark-600 rounded-lg shadow-xl z-50 overflow-hidden animate-fade-in">
                <div className="p-2 border-b border-dark-700">
                  <p className="text-xs text-dark-400">Quick Start Templates</p>
                </div>
                {sampleTemplates.map((template, index) => (
                  <button
                    key={index}
                    onClick={() => loadTemplate(template)}
                    className="w-full px-3 py-2.5 text-left text-sm text-dark-300 hover:text-white hover:bg-dark-700 transition-colors flex items-center gap-2"
                  >
                    <div className="w-2 h-2 rounded-full bg-azure-500" />
                    {template.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-dark-400 hover:text-white bg-dark-700 hover:bg-dark-600 rounded-md transition-colors"
          >
            {showPreview ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            {showPreview ? 'Hide' : 'Show'} JSON
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {/* Educational tip */}
        <div className="mb-4 p-3 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/30 rounded-lg">
          <div className="flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-violet-300">
                <strong>💡 How it works:</strong> Add fields that match your ML model&apos;s input features. 
                Each field name should match exactly what your model expects!
              </p>
            </div>
          </div>
        </div>

        {/* Fields */}
        <div className="space-y-3">
          {fields.map((field, index) => (
            <div
              key={field.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`group bg-dark-800/80 border border-dark-600 rounded-xl p-4 transition-all hover:border-dark-500 ${
                draggedIndex === index ? 'opacity-50 scale-[0.98]' : ''
              }`}
            >
              {/* Field header */}
              <div className="flex items-center gap-3 mb-3">
                <div className="cursor-grab active:cursor-grabbing text-dark-600 hover:text-dark-400 transition-colors">
                  <GripVertical className="w-4 h-4" />
                </div>
                
                <span className="text-xs text-dark-500 font-medium">
                  Field {index + 1}
                </span>

                <div className="flex-1" />

                {fields.length > 1 && (
                  <button
                    onClick={() => removeField(field.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-dark-500 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Field content */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Field name */}
                <div>
                  <label className="block text-xs text-dark-400 mb-1.5">Field Name</label>
                  <input
                    type="text"
                    value={field.name}
                    onChange={(e) => updateField(field.id, { name: e.target.value })}
                    placeholder="e.g., age, price, image"
                    className="w-full px-3 py-2.5 bg-dark-900 border border-dark-600 rounded-lg text-sm text-white placeholder-dark-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
                  />
                </div>

                {/* Field type */}
                <div>
                  <label className="block text-xs text-dark-400 mb-1.5">Type</label>
                  <div className="relative">
                    <select
                      value={field.type}
                      onChange={(e) => updateField(field.id, { 
                        type: e.target.value as FormField['type'],
                        value: e.target.value === 'boolean' ? false : e.target.value === 'number' ? 0 : '',
                        base64Data: undefined,
                        fileName: undefined,
                      })}
                      className="w-full px-3 py-2.5 bg-dark-900 border border-dark-600 rounded-lg text-sm text-white appearance-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all cursor-pointer"
                    >
                      {Object.entries(fieldTypeConfig).map(([key, config]) => (
                        <option key={key} value={key}>{config.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400 pointer-events-none" />
                  </div>
                </div>

                {/* Field value */}
                <div>
                  <label className="block text-xs text-dark-400 mb-1.5">Value</label>
                  
                  {field.type === 'text' && (
                    <input
                      type="text"
                      value={field.value as string}
                      onChange={(e) => updateField(field.id, { value: e.target.value })}
                      placeholder="Enter text value"
                      className="w-full px-3 py-2.5 bg-dark-900 border border-dark-600 rounded-lg text-sm text-white placeholder-dark-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
                    />
                  )}

                  {field.type === 'number' && (
                    <input
                      type="number"
                      value={field.value as number}
                      onChange={(e) => updateField(field.id, { value: parseFloat(e.target.value) || 0 })}
                      placeholder="Enter number"
                      className="w-full px-3 py-2.5 bg-dark-900 border border-dark-600 rounded-lg text-sm text-white placeholder-dark-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
                    />
                  )}

                  {field.type === 'boolean' && (
                    <div className="flex items-center gap-4 h-[42px]">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name={`bool-${field.id}`}
                          checked={field.value === true}
                          onChange={() => updateField(field.id, { value: true })}
                          className="w-4 h-4 text-violet-500 bg-dark-900 border-dark-600 focus:ring-violet-500"
                        />
                        <span className="text-sm text-green-400">Yes / True</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name={`bool-${field.id}`}
                          checked={field.value === false}
                          onChange={() => updateField(field.id, { value: false })}
                          className="w-4 h-4 text-violet-500 bg-dark-900 border-dark-600 focus:ring-violet-500"
                        />
                        <span className="text-sm text-red-400">No / False</span>
                      </label>
                    </div>
                  )}

                  {(field.type === 'image' || field.type === 'file') && (
                    <div>
                      {field.base64Data ? (
                        <div className="flex items-center gap-2">
                          {field.type === 'image' && (
                            <div className="w-10 h-10 rounded-lg bg-dark-700 overflow-hidden flex-shrink-0">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img 
                                src={field.base64Data} 
                                alt="Preview" 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <span className="text-xs text-dark-400 truncate flex-1">
                            {field.fileName}
                          </span>
                          <button
                            onClick={() => updateField(field.id, { base64Data: undefined, fileName: undefined, value: '' })}
                            className="p-1 text-dark-500 hover:text-red-400 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex items-center justify-center gap-2 px-3 py-2.5 bg-dark-900 border border-dashed border-dark-500 rounded-lg text-sm text-dark-400 hover:text-white hover:border-violet-500 cursor-pointer transition-all">
                          <Upload className="w-4 h-4" />
                          <span>Upload {field.type}</span>
                          <input
                            type="file"
                            accept={field.type === 'image' ? 'image/*' : '*/*'}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload(field.id, file);
                            }}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Type indicator badge */}
              <div className="mt-3 flex items-center gap-2">
                {(() => {
                  const config = fieldTypeConfig[field.type];
                  const Icon = config.icon;
                  return (
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs ${config.bg} ${config.color}`}>
                      <Icon className="w-3 h-3" />
                      {config.label}
                    </span>
                  );
                })()}
              </div>
            </div>
          ))}
        </div>

        {/* Add field button */}
        <button
          onClick={addField}
          className="w-full mt-4 py-3 px-4 border-2 border-dashed border-dark-600 hover:border-violet-500 rounded-xl text-dark-400 hover:text-violet-400 flex items-center justify-center gap-2 transition-all hover:bg-violet-500/5"
        >
          <Plus className="w-5 h-5" />
          Add Field
        </button>

        {/* JSON Preview */}
        {showPreview && (
          <div className="mt-6 animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-dark-400">Generated JSON Preview</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-2 py-1 text-xs text-dark-400 hover:text-white bg-dark-700 hover:bg-dark-600 rounded transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="code-block p-4 max-h-48 overflow-auto">
              <pre className="text-xs text-dark-300 font-mono">{generateJson()}</pre>
            </div>
          </div>
        )}

        {/* Educational note */}
        <div className="mt-4 p-3 bg-violet-500/10 border border-violet-500/30 rounded-lg">
          <p className="text-xs text-violet-300">
            <strong>📚 Learning Note:</strong> The form above creates a JSON request that your ML model understands. 
            Field names become &quot;columns&quot; and values become &quot;data&quot; in the API request.
          </p>
        </div>
      </div>
    </div>
  );
}

