'use client';

import { Cloud, BookOpen, Github } from 'lucide-react';

export default function Header() {
  return (
    <header className="border-b border-dark-700 bg-dark-900/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-azure-500 to-azure-700 flex items-center justify-center">
                <Cloud className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-dark-900" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">ML API Tester</h1>
              <p className="text-xs text-dark-400">Azure Machine Learning</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-4">
            <a
              href="https://learn.microsoft.com/en-us/azure/machine-learning/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-dark-400 hover:text-white hover:bg-dark-800 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span className="text-sm hidden sm:inline">Docs</span>
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-dark-400 hover:text-white hover:bg-dark-800 transition-colors"
            >
              <Github className="w-4 h-4" />
              <span className="text-sm hidden sm:inline">GitHub</span>
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}




