'use client';

import { History, Trash2, CheckCircle, XCircle, Image as ImageIcon, Code } from 'lucide-react';
import { formatTimestamp, formatDuration, truncate, type RequestHistoryItem } from '@/lib/utils';

interface RequestHistoryProps {
  history: RequestHistoryItem[];
  onSelect: (item: RequestHistoryItem) => void;
  onClear: () => void;
}

export default function RequestHistory({ history, onSelect, onClear }: RequestHistoryProps) {
  if (history.length === 0) {
    return (
      <div className="card">
        <div className="card-header flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-dark-700 flex items-center justify-center">
              <History className="w-4 h-4 text-dark-400" />
            </div>
            <h2 className="text-white font-medium">Request History</h2>
          </div>
        </div>
        <div className="p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-dark-800 flex items-center justify-center mx-auto mb-3">
            <History className="w-6 h-6 text-dark-500" />
          </div>
          <p className="text-dark-400 text-sm">No requests yet</p>
          <p className="text-dark-500 text-xs mt-1">Your request history will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
            <History className="w-4 h-4 text-indigo-400" />
          </div>
          <h2 className="text-white font-medium">Request History</h2>
          <span className="px-2 py-0.5 bg-dark-700 rounded text-xs text-dark-400">
            {history.length}
          </span>
        </div>
        <button
          onClick={onClear}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded-md transition-colors"
        >
          <Trash2 className="w-3 h-3" />
          Clear All
        </button>
      </div>

      <div className="p-4 max-h-[400px] overflow-y-auto">
        <div className="space-y-2">
          {history.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              className="w-full p-3 bg-dark-800 hover:bg-dark-700 rounded-lg transition-colors text-left group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  {item.statusCode >= 200 && item.statusCode < 300 ? (
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                        item.statusCode >= 200 && item.statusCode < 300 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {item.statusCode}
                      </span>
                      <span className="text-xs text-dark-500">
                        {formatDuration(item.duration)}
                      </span>
                      {item.isImage ? (
                        <ImageIcon className="w-3 h-3 text-pink-400" />
                      ) : (
                        <Code className="w-3 h-3 text-purple-400" />
                      )}
                    </div>
                    <p className="text-xs text-dark-400 mt-1 font-mono">
                      {truncate(item.endpoint, 40)}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-dark-500">
                  {formatTimestamp(new Date(item.timestamp))}
                </span>
              </div>
              
              {/* Preview on hover */}
              <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {item.isImage && item.imagePreview ? (
                  <div className="h-12 w-12 rounded bg-dark-700 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={item.imagePreview} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <p className="text-xs text-dark-500 font-mono truncate">
                    {truncate(item.requestBody, 60)}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Educational note */}
      <div className="px-4 pb-4">
        <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-lg">
          <p className="text-xs text-indigo-300">
            <strong>💡 Learning Note:</strong> Request history helps you track and compare different API calls. 
            Click on any item to load it back into the editor.
          </p>
        </div>
      </div>
    </div>
  );
}

