'use client';

import { useState, useCallback } from 'react';
import { Image as ImageIcon, Upload, X, Link as LinkIcon, Eye, EyeOff } from 'lucide-react';
import { fileToBase64, getImageRequestTemplate } from '@/lib/utils';

interface ImageUploaderProps {
  onImageSelect: (base64: string, requestBody: string) => void;
}

export default function ImageUploader({ onImageSelect }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showBase64, setShowBase64] = useState(false);
  const [base64Data, setBase64Data] = useState<string>('');
  const [urlInput, setUrlInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const base64 = await fileToBase64(file);
      setPreview(base64);
      setBase64Data(base64);
      onImageSelect(base64, getImageRequestTemplate(base64));
    } catch (err) {
      setError('Failed to process image');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleUrlLoad = async () => {
    if (!urlInput) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(urlInput);
      const blob = await response.blob();
      const base64 = await fileToBase64(new File([blob], 'image'));
      setPreview(base64);
      setBase64Data(base64);
      onImageSelect(base64, getImageRequestTemplate(base64));
    } catch (err) {
      setError('Failed to load image from URL');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearImage = () => {
    setPreview(null);
    setBase64Data('');
    setUrlInput('');
    setError(null);
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = Array.from(e.clipboardData.items);
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          await processFile(file);
          break;
        }
      }
    }
  };

  return (
    <div className="card h-full flex flex-col">
      <div className="card-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center">
            <ImageIcon className="w-4 h-4 text-pink-400" />
          </div>
          <h2 className="text-white font-medium">Image Upload</h2>
        </div>
        {preview && (
          <button
            onClick={clearImage}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded-md transition-colors"
          >
            <X className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>

      <div className="flex-1 p-4 flex flex-col" onPaste={handlePaste}>
        {!preview ? (
          <>
            {/* Drop zone */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`dropzone flex-1 flex flex-col items-center justify-center p-8 transition-all cursor-pointer ${
                isDragging ? 'active' : ''
              }`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer text-center">
                <div className="w-16 h-16 rounded-full bg-dark-700 flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-dark-400" />
                </div>
                <p className="text-white font-medium mb-1">Drop image here</p>
                <p className="text-sm text-dark-400 mb-4">or click to browse</p>
                <p className="text-xs text-dark-500">Supports: JPEG, PNG, WebP, GIF</p>
                <p className="text-xs text-dark-500 mt-1">You can also paste (Ctrl+V)</p>
              </label>
            </div>

            {/* URL input */}
            <div className="mt-4">
              <label className="block text-sm text-dark-400 mb-2">Or load from URL</label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full pl-10 pr-4 py-2.5 bg-dark-800 border border-dark-600 rounded-lg text-sm text-white placeholder-dark-500 focus:border-azure-500 focus:ring-2 focus:ring-azure-500/20 transition-all"
                  />
                </div>
                <button
                  onClick={handleUrlLoad}
                  disabled={!urlInput || loading}
                  className="px-4 py-2.5 bg-azure-500 hover:bg-azure-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Loading...' : 'Load'}
                </button>
              </div>
            </div>

            {error && (
              <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400">
                {error}
              </div>
            )}
          </>
        ) : (
          <>
            {/* Image preview */}
            <div className="flex-1 flex flex-col">
              <div className="relative flex-1 bg-dark-800 rounded-lg overflow-hidden flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preview}
                  alt="Preview"
                  className="max-w-full max-h-[250px] object-contain"
                />
              </div>

              {/* Image info */}
              <div className="mt-3 p-3 bg-dark-800 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-dark-400">Base64 Encoded</span>
                  <button
                    onClick={() => setShowBase64(!showBase64)}
                    className="flex items-center gap-1.5 text-xs text-azure-400 hover:text-azure-300"
                  >
                    {showBase64 ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    {showBase64 ? 'Hide' : 'Show'}
                  </button>
                </div>
                {showBase64 && (
                  <div className="p-2 bg-dark-900 rounded border border-dark-700 text-xs text-dark-400 font-mono break-all max-h-24 overflow-y-auto">
                    {base64Data}
                  </div>
                )}
                <div className="mt-2 text-xs text-dark-500">
                  Size: {Math.round(base64Data.length / 1024)} KB (base64)
                </div>
              </div>

              {/* Educational note */}
              <div className="mt-3 p-3 bg-azure-500/10 border border-azure-500/30 rounded-lg">
                <p className="text-xs text-azure-300">
                  <strong>💡 Learning Note:</strong> The image is converted to Base64 format before being sent to the ML endpoint. This is how binary data (images) are transmitted in JSON requests.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}




