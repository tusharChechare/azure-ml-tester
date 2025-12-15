// Utility functions for ML API Tester

export interface RequestHistoryItem {
  id: string;
  timestamp: Date;
  endpoint: string;
  method: string;
  requestBody: string;
  responseBody: string;
  statusCode: number;
  duration: number;
  isImage: boolean;
  imagePreview?: string;
}

export interface EndpointConfig {
  url: string;
  apiKey: string;
  keyHeaderName: string;
}

// Generate unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

// Format JSON with syntax highlighting classes
export function formatJsonWithHighlighting(json: string): string {
  try {
    const parsed = JSON.parse(json);
    const formatted = JSON.stringify(parsed, null, 2);
    
    return formatted
      .replace(/"([^"]+)":/g, '<span class="json-key">"$1"</span>:')
      .replace(/: "([^"]+)"/g, ': <span class="json-string">"$1"</span>')
      .replace(/: (\d+\.?\d*)/g, ': <span class="json-number">$1</span>')
      .replace(/: (true|false)/g, ': <span class="json-boolean">$1</span>')
      .replace(/: (null)/g, ': <span class="json-null">$1</span>');
  } catch {
    return json;
  }
}

// Pretty print JSON
export function prettyJson(json: string | object): string {
  try {
    const obj = typeof json === 'string' ? JSON.parse(json) : json;
    return JSON.stringify(obj, null, 2);
  } catch {
    return typeof json === 'string' ? json : JSON.stringify(json);
  }
}

// Validate JSON
export function isValidJson(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

// Convert file to base64
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = error => reject(error);
  });
}

// Generate cURL command
export function generateCurl(config: EndpointConfig, body: string): string {
  const { url, apiKey, keyHeaderName } = config;
  
  let curl = `curl -X POST "${url}" \\\n`;
  curl += `  -H "Content-Type: application/json" \\\n`;
  curl += `  -H "${keyHeaderName}: ${apiKey}" \\\n`;
  curl += `  -d '${body.replace(/'/g, "'\\''")}'`;
  
  return curl;
}

// Generate Python code
export function generatePythonCode(config: EndpointConfig, body: string): string {
  const { url, apiKey, keyHeaderName } = config;
  
  return `import requests
import json

url = "${url}"

headers = {
    "Content-Type": "application/json",
    "${keyHeaderName}": "${apiKey}"
}

data = ${body}

response = requests.post(url, headers=headers, json=data)

print(f"Status Code: {response.status_code}")
print(f"Response: {response.json()}")`;
}

// Generate JavaScript code
export function generateJavaScriptCode(config: EndpointConfig, body: string): string {
  const { url, apiKey, keyHeaderName } = config;
  
  return `const url = "${url}";

const headers = {
  "Content-Type": "application/json",
  "${keyHeaderName}": "${apiKey}"
};

const data = ${body};

fetch(url, {
  method: "POST",
  headers: headers,
  body: JSON.stringify(data)
})
  .then(response => response.json())
  .then(result => {
    console.log("Success:", result);
  })
  .catch(error => {
    console.error("Error:", error);
  });`;
}

// Generate C# code
export function generateCSharpCode(config: EndpointConfig, body: string): string {
  const { url, apiKey, keyHeaderName } = config;
  
  return `using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

class Program
{
    static async Task Main()
    {
        var url = "${url}";
        
        using var client = new HttpClient();
        
        client.DefaultRequestHeaders.Add("${keyHeaderName}", "${apiKey}");
        
        var json = @"${body.replace(/"/g, '""')}";
        var content = new StringContent(json, Encoding.UTF8, "application/json");
        
        var response = await client.PostAsync(url, content);
        var result = await response.Content.ReadAsStringAsync();
        
        Console.WriteLine($"Status: {response.StatusCode}");
        Console.WriteLine($"Response: {result}");
    }
}`;
}

// Format duration
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

// Format timestamp
export function formatTimestamp(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(date);
}

// Get status color class
export function getStatusColorClass(statusCode: number): string {
  if (statusCode >= 200 && statusCode < 300) return 'status-success';
  if (statusCode >= 400) return 'status-error';
  return 'status-pending';
}

// Truncate string
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '...';
}

// Local storage helpers
export function saveToLocalStorage(key: string, data: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

export function loadFromLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

// Default Azure ML request template
export function getDefaultRequestTemplate(): string {
  return JSON.stringify({
    "input_data": {
      "columns": ["feature1", "feature2", "feature3"],
      "data": [[1.0, 2.0, 3.0]]
    }
  }, null, 2);
}

// Image classification request template
export function getImageRequestTemplate(base64Image: string): string {
  return JSON.stringify({
    "input_data": {
      "columns": ["image"],
      "data": [[base64Image]]
    }
  }, null, 2);
}




