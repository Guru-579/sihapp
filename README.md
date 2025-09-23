# 🌾 Digital Kheti App - Smart Farming Assistant

A comprehensive React web application that provides AI-powered farming solutions including soil health analysis, weather monitoring, pest detection, and multilingual chatbot assistance.

## ✨ Features

### 🔐 Authentication
- Firebase Phone Authentication with OTP
- Test login (Mobile: 9999999999, OTP: 1234)
- Secure user session management

### 🌱 Soil Health Analysis
- **OCR Integration**: Upload soil health cards for automatic text extraction using Tesseract.js
- **Smart Analysis**: Extract pH, N-P-K values, organic carbon, and other parameters
- **Fertilizer Recommendations**: Rule-based engine provides specific fertilizer guidance
- **Visual Results**: Color-coded results with severity indicators

### 🌤️ Weather Integration
- **Real-time Data**: OpenWeatherMap API integration
- **Location-based**: Default location (Kovvada, Bhimavaram, AP)
- **3-day Forecast**: Detailed weather predictions
- **Smart Alerts**: Automatic notifications for severe weather conditions
- **Farming Recommendations**: Weather-based agricultural advice

### 🐛 Pest & Disease Detection
- **AI-Powered**: HuggingFace model integration for crop disease detection
- **Image Analysis**: Camera and file upload support
- **Treatment Plans**: Detailed treatment and prevention recommendations
- **Severity Assessment**: Risk level evaluation with appropriate actions

### 🤖 Multilingual AI Chatbot
- **OpenAI GPT-4o-mini**: Advanced conversational AI
- **Voice Support**: Speech-to-text and text-to-speech capabilities
- **Multilingual**: Support for English, Hindi, Telugu, and Punjabi
- **Agricultural Expertise**: Specialized knowledge in farming practices
- **Quick Questions**: Pre-defined common queries

### 🌍 Multilingual Support
- **4 Languages**: English, Hindi, Telugu, Punjabi
- **Dynamic Translation**: Real-time language switching
- **Localized Content**: All UI elements and responses translated

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Environment Setup**
Copy `.env.example` to `.env` and configure your API keys:

```env
# Firebase Configuration (Configure your own)
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# OpenWeatherMap API (Already configured)
VITE_OPENWEATHER_API_KEY=8cbf813529a280bcf3fdfc9a54536a9c

# OpenAI API (Already configured)
VITE_OPENAI_API_KEY=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

# HuggingFace API (Already configured)
VITE_HUGGINGFACE_API_KEY=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
```

3. **Start the development server**
```bash
npm run dev
```

4. **Open the application**
Navigate to [http://localhost:5173](http://localhost:5173)

## 🔧 API Configuration

### Firebase Setup
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication with Phone provider
3. Enable Firestore Database
4. Copy configuration to `.env` file

### Pre-configured APIs
- **OpenWeatherMap**: Weather data API (functional)
- **OpenAI**: GPT-4o-mini for chatbot (functional)
- **HuggingFace**: AI models for crop analysis (functional)

## 📱 Usage

### Test Login
- **Mobile Number**: 9999999999
- **OTP**: 1234

### Features Walkthrough

1. **Language Selection**: Choose your preferred language
2. **Authentication**: Login with phone number and OTP
3. **Dashboard**: Access all features from the main dashboard
4. **Soil Health**: Upload soil test images for analysis
5. **Weather**: View current conditions and forecasts
6. **Pest Detection**: Analyze crop images for diseases
7. **AI Chatbot**: Ask farming questions in your language

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern component library

### Backend Services
- **Firebase** - Authentication and database
- **OpenWeatherMap** - Weather data API
- **OpenAI GPT-4o-mini** - Conversational AI
- **HuggingFace** - AI model inference
- **Tesseract.js** - Client-side OCR

### Key Libraries
- **react-i18next** - Internationalization
- **tesseract.js** - OCR functionality
- **lucide-react** - Modern icons
- **sonner** - Toast notifications

## 📋 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
```

## 🌟 Key Features Implementation

### 1. Soil Health OCR
- Automatic text extraction from soil health cards
- Parameter parsing (pH, NPK, organic carbon)
- Rule-based fertilizer recommendations
- Visual result presentation

### 2. Weather Intelligence
- Real-time weather data integration
- Location-based forecasting
- Agricultural weather alerts
- Farming activity recommendations

### 3. AI Pest Detection
- Image-based crop disease identification
- Treatment and prevention recommendations
- Severity assessment and risk evaluation
- Comprehensive disease database

### 4. Multilingual Chatbot
- Natural language processing
- Voice input/output capabilities
- Agricultural domain expertise
- Multi-language support

## 🔒 Security Features

- Firebase Authentication integration
- Secure API key management
- Environment variable protection
- Input validation and sanitization

## 🌐 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

**Note**: Voice features require modern browser support for Web Speech API.

## 🚀 Future Enhancements

- Market price integration
- Advanced analytics dashboard
- Offline functionality
- Mobile app version
- IoT sensor integration

---

**Made with ❤️ for farmers worldwide** 🌾
"# SIH" 
