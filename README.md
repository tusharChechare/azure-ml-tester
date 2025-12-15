# 🧪 Azure ML Tester

> A visual tool to test Azure Machine Learning model endpoints - No coding required! Built for learning.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Azure ML](https://img.shields.io/badge/Azure-Machine%20Learning-0078D4?style=flat&logo=microsoft-azure)](https://azure.microsoft.com/services/machine-learning/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

![Azure ML Tester Screenshot](https://via.placeholder.com/800x400/1e293b/60a5fa?text=Azure+ML+Tester)

## ✨ Features

### 🎨 Visual Form Builder
Build API requests without writing JSON! Perfect for non-technical learners.
- Add fields dynamically
- Choose field types (Text, Number, Boolean, Image, File)
- Drag and drop to reorder
- Live JSON preview

### 📋 Ready-to-Use Templates
- 🚢 **Titanic Survival** - Classic ML classification
- 🚴 **Bike Rental Prediction** - Regression model
- 🏠 **House Price Prediction** - Real estate ML
- 📊 **Customer Churn** - Business analytics
- 🖼️ **Image Classification** - Computer vision

### 🛠️ Developer Tools
- **JSON Editor** - Syntax highlighting & validation
- **cURL Generator** - Copy-paste terminal commands
- **Code Snippets** - Python, JavaScript, C# examples
- **Request History** - Track and replay requests

### 🛡️ Built-in CORS Proxy
No more CORS errors! Toggle the proxy to bypass browser restrictions.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Azure ML endpoint (for testing)

### Installation

```bash
# Clone the repository
git clone https://github.com/tusharChechare/azure-ml-tester.git

# Navigate to project
cd azure-ml-tester

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage Guide

### Step 1: Configure Endpoint
Enter your Azure ML endpoint URL and API key from Azure ML Studio.

### Step 2: Choose Input Mode
- **Visual Form** - Best for beginners (no coding!)
- **JSON Editor** - For advanced users
- **Image Upload** - For classification models

### Step 3: Build Request
Use templates or create custom fields matching your model's input.

### Step 4: Send & Analyze
Click "Send Request" and view the formatted response.

## 🎓 For Educators

This tool is designed for teaching Azure Machine Learning concepts:

| Concept | How This Tool Helps |
|---------|---------------------|
| REST APIs | Visual representation of HTTP requests |
| JSON Format | Live preview shows data structure |
| Authentication | API key handling demonstration |
| CORS | Built-in proxy explains web security |
| Code Integration | Multi-language code snippets |

### Classroom Activities
1. Deploy a model in Azure ML Studio
2. Use this tool to test the endpoint
3. Compare code snippets in different languages
4. Discuss CORS and API security

## 🏗️ Tech Stack

| Technology | Purpose |
|------------|---------|
| [Next.js 14](https://nextjs.org/) | React framework with API routes |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe JavaScript |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first styling |
| [Lucide React](https://lucide.dev/) | Beautiful icons |

## 📁 Project Structure

```
azure-ml-tester/
├── app/
│   ├── api/proxy/       # CORS proxy endpoint
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Main page
├── components/
│   ├── FormBuilder.tsx      # Visual form builder
│   ├── EndpointConfig.tsx   # URL & key input
│   ├── RequestBuilder.tsx   # JSON editor
│   ├── ImageUploader.tsx    # Image upload
│   ├── ResponseViewer.tsx   # Response display
│   ├── CodeGenerator.tsx    # Code snippets
│   ├── CurlGenerator.tsx    # cURL commands
│   └── RequestHistory.tsx   # History panel
├── lib/
│   └── utils.ts         # Utility functions
└── public/              # Static assets
```

## ☁️ Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tusharChechare/azure-ml-tester)

### Deploy to Azure Static Web Apps

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## 🔒 Security

- API keys are stored **locally** in your browser
- Keys are **never sent** to any external server except your Azure ML endpoint
- CORS proxy runs on your deployment only

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for Azure Machine Learning learners
- Inspired by the need for visual API testing tools
- Thanks to the Next.js and Tailwind CSS communities

## 📬 Contact

**Tushar Chechare** - [GitHub](https://github.com/tusharChechare)

Project Link: [https://github.com/tusharChechare/azure-ml-tester](https://github.com/tusharChechare/azure-ml-tester)

---

<p align="center">
  Made with ❤️ for Azure ML Learners
</p>
