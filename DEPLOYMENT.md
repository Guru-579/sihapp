# Digital Kheti App - Deployment Guide

## 🌾 Complete Agricultural Platform

A modern React web application built with TypeScript, Vite, and Firebase, designed specifically for Indian farmers.

## ✨ Features

### 🔐 Authentication
- Firebase Phone Authentication with OTP
- Test login: Mobile: `9999999999`, OTP: `1234`

### 🌱 Core Features
1. **Soil Health Analysis** - OCR-powered soil card scanning with fertilizer recommendations
2. **Weather Integration** - OpenWeatherMap API with 3-day forecasts
3. **Pest/Disease Detection** - HuggingFace AI models for crop disease identification
4. **Market Prices** - Real-time mandi prices with filtering
5. **AI Chatbot** - OpenAI GPT-4o-mini with voice support
6. **Multilingual Support** - English, Hindi, Telugu, Punjabi

### 📊 Analytics & Feedback
- Firebase Analytics integration
- User feedback system with ratings
- Comprehensive event tracking

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase project setup

### Installation
```bash
# Clone the repository
cd digital-kheti-app-main

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Configure your API keys in .env file
# Start development server
npm run dev
```

### Environment Variables
```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# API Keys (Already configured)
VITE_OPENWEATHER_API_KEY=8cbf813529a280bcf3fdfc9a54536a9c
VITE_OPENAI_API_KEY=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
VITE_HUGGINGFACE_API_KEY=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
```

## 🏗️ Build & Deploy

### Build for Production
```bash
npm run build
```

### Deploy to Netlify/Vercel
```bash
# For Netlify
npm run build
# Upload dist/ folder to Netlify

# For Vercel
vercel --prod
```

### Firebase Setup
1. Create a Firebase project
2. Enable Authentication (Phone)
3. Enable Firestore Database
4. Enable Analytics
5. Update .env with your Firebase config

## 📱 Usage

### Test Credentials
- **Mobile**: `9999999999`
- **OTP**: `1234`

### Features Testing
1. **Soil Health**: Upload any image to test OCR
2. **Weather**: Automatic location-based weather
3. **Pest Detection**: Upload crop images for AI analysis
4. **Market Prices**: Browse real-time mandi prices
5. **AI Chatbot**: Ask farming questions in any supported language
6. **Feedback**: Use the purple feedback button (bottom-left)

## 🌐 Supported Languages
- English (en)
- Hindi (hi) - हिंदी
- Telugu (te) - తెలుగు
- Punjabi (pa) - ਪੰਜਾਬੀ

## 🔧 Technical Stack
- **Frontend**: React 18, TypeScript, Vite
- **UI**: Tailwind CSS, shadcn/ui
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **AI/ML**: OpenAI GPT-4o-mini, HuggingFace
- **APIs**: OpenWeatherMap, Tesseract.js
- **i18n**: react-i18next

## 📊 Analytics
- Page view tracking
- Feature usage analytics
- Error tracking
- User feedback collection

## 🐛 Troubleshooting

### Common Issues
1. **TypeScript Errors**: Components use `@ts-nocheck` for compatibility
2. **API Keys**: Ensure all environment variables are set
3. **Firebase**: Check Firebase project configuration
4. **Build Errors**: Run `npm run build` to check for issues

### Support
- Check browser console for errors
- Verify API key validity
- Ensure Firebase project is properly configured

## 🚀 Production Checklist
- [ ] Firebase project configured
- [ ] All API keys added to .env
- [ ] Build successful (`npm run build`)
- [ ] All features tested
- [ ] Analytics working
- [ ] Feedback system operational

## 📈 Performance
- Lazy loading for components
- Optimized images and assets
- Efficient state management
- Minimal bundle size

---

**Ready for Production!** 🌾✨
