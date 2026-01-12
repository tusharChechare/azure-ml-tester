'use client';

import { useState } from 'react';
import { Code2, Copy, Check } from 'lucide-react';
import type { VisionConfigType } from './VisionConfig';
import type { VisionFeatures } from './VisionFeatureSelector';

interface VisionCodeGeneratorProps {
  config: VisionConfigType;
  features: VisionFeatures;
}

type Language = 'python' | 'javascript' | 'csharp' | 'curl';

const languageConfig: Record<Language, { name: string; icon: string; color: string }> = {
  python: { name: 'Python', icon: '🐍', color: 'bg-yellow-500/20 text-yellow-400' },
  javascript: { name: 'JavaScript', icon: '📜', color: 'bg-amber-500/20 text-amber-400' },
  csharp: { name: 'C#', icon: '💜', color: 'bg-purple-500/20 text-purple-400' },
  curl: { name: 'cURL', icon: '🔧', color: 'bg-orange-500/20 text-orange-400' },
};

function getEnabledFeatures(features: VisionFeatures): string[] {
  const enabled: string[] = [];
  if (features.caption) enabled.push('caption');
  if (features.denseCaptions) enabled.push('denseCaptions');
  if (features.tags) enabled.push('tags');
  if (features.objects) enabled.push('objects');
  if (features.people) enabled.push('people');
  if (features.read) enabled.push('read');
  if (features.smartCrops) enabled.push('smartCrops');
  return enabled;
}

function generatePythonCode(config: VisionConfigType, features: VisionFeatures): string {
  const enabledFeatures = getEnabledFeatures(features);
  return `import requests

endpoint = "${config.endpoint}"
api_key = "${config.apiKey}"

# Image Analysis API URL
api_url = f"{endpoint}/computervision/imageanalysis:analyze"

# Features to analyze
params = {
    "api-version": "2024-02-01",
    "features": "${enabledFeatures.join(',')}"
}

headers = {
    "Ocp-Apim-Subscription-Key": api_key,
    "Content-Type": "application/json"
}

# Option 1: Analyze image from URL
image_url = "https://example.com/image.jpg"
body = {"url": image_url}

response = requests.post(api_url, params=params, headers=headers, json=body)

# Option 2: Analyze local image file
# with open("image.jpg", "rb") as image_file:
#     headers["Content-Type"] = "application/octet-stream"
#     response = requests.post(api_url, params=params, headers=headers, data=image_file)

result = response.json()
print(f"Caption: {result.get('captionResult', {}).get('text', 'N/A')}")
print(f"Tags: {[tag['name'] for tag in result.get('tagsResult', {}).get('values', [])]}")`;
}

function generateJavaScriptCode(config: VisionConfigType, features: VisionFeatures): string {
  const enabledFeatures = getEnabledFeatures(features);
  return `const endpoint = "${config.endpoint}";
const apiKey = "${config.apiKey}";

const features = "${enabledFeatures.join(',')}";
const apiUrl = \`\${endpoint}/computervision/imageanalysis:analyze?api-version=2024-02-01&features=\${features}\`;

// Option 1: Analyze image from URL
async function analyzeImageUrl(imageUrl) {
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": apiKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ url: imageUrl })
  });
  
  const result = await response.json();
  console.log("Caption:", result.captionResult?.text);
  console.log("Tags:", result.tagsResult?.values.map(t => t.name));
  return result;
}

// Option 2: Analyze image file (browser)
async function analyzeImageFile(file) {
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": apiKey,
      "Content-Type": "application/octet-stream"
    },
    body: file
  });
  
  return await response.json();
}

// Usage
analyzeImageUrl("https://example.com/image.jpg");`;
}

function generateCSharpCode(config: VisionConfigType, features: VisionFeatures): string {
  const enabledFeatures = getEnabledFeatures(features);
  return `using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

class Program
{
    static async Task Main()
    {
        var endpoint = "${config.endpoint}";
        var apiKey = "${config.apiKey}";
        var features = "${enabledFeatures.join(',')}";
        
        var apiUrl = $"{endpoint}/computervision/imageanalysis:analyze?api-version=2024-02-01&features={features}";
        
        using var client = new HttpClient();
        client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", apiKey);
        
        // Option 1: Analyze image from URL
        var imageUrl = "https://example.com/image.jpg";
        var json = $@"{{""url"":""{imageUrl}""}}";
        var content = new StringContent(json, Encoding.UTF8, "application/json");
        
        var response = await client.PostAsync(apiUrl, content);
        var result = await response.Content.ReadAsStringAsync();
        
        Console.WriteLine(result);
        
        // Option 2: Analyze local image file
        // var imageBytes = File.ReadAllBytes("image.jpg");
        // var binaryContent = new ByteArrayContent(imageBytes);
        // binaryContent.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
        // var response = await client.PostAsync(apiUrl, binaryContent);
    }
}`;
}

function generateCurlCode(config: VisionConfigType, features: VisionFeatures): string {
  const enabledFeatures = getEnabledFeatures(features);
  return `# Analyze image from URL
curl -X POST "${config.endpoint}/computervision/imageanalysis:analyze?api-version=2024-02-01&features=${enabledFeatures.join(',')}" \\
  -H "Ocp-Apim-Subscription-Key: ${config.apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://example.com/image.jpg"}'

# Analyze local image file
# curl -X POST "${config.endpoint}/computervision/imageanalysis:analyze?api-version=2024-02-01&features=${enabledFeatures.join(',')}" \\
#   -H "Ocp-Apim-Subscription-Key: ${config.apiKey}" \\
#   -H "Content-Type: application/octet-stream" \\
#   --data-binary @image.jpg`;
}

export default function VisionCodeGenerator({ config, features }: VisionCodeGeneratorProps) {
  const [selectedLang, setSelectedLang] = useState<Language>('python');
  const [copied, setCopied] = useState(false);

  const generateCode = (): string => {
    switch (selectedLang) {
      case 'python':
        return generatePythonCode(config, features);
      case 'javascript':
        return generateJavaScriptCode(config, features);
      case 'csharp':
        return generateCSharpCode(config, features);
      case 'curl':
        return generateCurlCode(config, features);
      default:
        return '';
    }
  };

  const code = generateCode();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card">
      <div className="card-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <Code2 className="w-4 h-4 text-purple-400" />
          </div>
          <h2 className="text-white font-medium">Vision API Code Snippets</h2>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-dark-400 hover:text-white bg-dark-700 hover:bg-dark-600 rounded-md transition-colors"
        >
          {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      <div className="p-4">
        {/* Language tabs */}
        <div className="flex gap-2 mb-4">
          {(Object.keys(languageConfig) as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLang(lang)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedLang === lang
                  ? 'bg-purple-500 text-white'
                  : 'bg-dark-800 text-dark-400 hover:text-white hover:bg-dark-700'
              }`}
            >
              <span>{languageConfig[lang].icon}</span>
              {languageConfig[lang].name}
            </button>
          ))}
        </div>

        {/* Code display */}
        <div className="code-block p-4 overflow-x-auto max-h-80">
          <pre className="text-sm text-dark-200 font-mono whitespace-pre">{code}</pre>
        </div>

        {/* Educational note */}
        <div className="mt-4 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
          <p className="text-xs text-purple-300">
            <strong>💡 Learning Note:</strong> The Vision API uses <code className="bg-dark-800 px-1 rounded">Ocp-Apim-Subscription-Key</code> for authentication, 
            unlike ML Studio which uses <code className="bg-dark-800 px-1 rounded">Bearer</code> tokens. Notice the difference in the headers!
          </p>
        </div>
      </div>
    </div>
  );
}

