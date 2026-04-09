# 🪷 Gita-Ai Samvad

**Gita-Ai Samvad** is an immersive, mobile-first AI application built with React Native and Expo. It delivers personalized, deeply contextual spiritual guidance by embodying the persona of Lord Krishna, drawing wisdom directly from the Bhagavad Gita using a custom Retrieval-Augmented Generation (RAG) architecture.

## ✨ Features
* **Divine RAG Pipeline**: Locally indexes 640+ Shlokas, fetching the most relevant verses to the user's doubt before dynamically sending them to the AI to answer. 
* **Seamless AI Brain**: Powered by the hyper-fast **OpenRouter Proxy**, utilizing Google's `gemini-2.5-flash` model to guarantee swift, accurate, and scalable responses.
* **Premium UI/UX**: Designed with a "Divine Drift" aesthetic featuring glassmorphism, glowing typography, smooth micro-animations, and a seamless Dark Mode natively integrated.
* **Save for Later**: Persist your favorite divine guidance offline utilizing Async Storage.
* **Cross-Platform**: Compile beautifully to Android, iOS, and Web via Expo.

## 🛠 Tech Stack
* **Framework**: React Native / Expo SDK 54
* **AI Provider**: OpenRouter API (`google/gemini-2.5-flash`)
* **State Management**: React `useReducer` Context API + AsyncStorage
* **Styling**: Native StyleSheet & `expo-linear-gradient`
* **Animations**: React Native Animated (Strict Native Driver for performance)

## 🚀 Quick Start (Local Development)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/LEVELUPCODER/Gita_ai_samvad.git
   cd Gita_ai_samvad
   ```

2. **Install core dependencies:**
   ```bash
   npm install
   ```

3. **Configure your API Key:**
   Create a `.env` file in the root directory and add a free API key generated from [OpenRouter.ai](https://openrouter.ai):
   ```env
   EXPO_PUBLIC_OPENROUTER_API_KEY=your_openrouter_api_key_here
   ```

4. **Start the Metro Bundler:**
   ```bash
   npx expo start
   ```

## 📦 Production EAS Build
To build a standalone APK, ensure you are logged into your Expo account (`npx eas-cli login`) and trigger the cloud builder:
```bash
npx eas-cli build -p android --profile preview
```

---
*Developed with dedication by **Amit Chanchal** | NIT Jamshedpur*
