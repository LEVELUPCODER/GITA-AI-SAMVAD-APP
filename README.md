# 🪷 Gita-Ai Samvad

**Gita-Ai Samvad** is an immersive, mobile-first AI application built with React Native and Expo. It delivers personalized, deeply contextual spiritual guidance by embodying the persona of Lord Krishna, drawing wisdom directly from the Bhagavad Gita using a custom Retrieval-Augmented Generation (RAG) architecture.

## ✨ Features
* **Divine RAG Pipeline**: Locally indexes 640+ Shlokas. Includes **Offline Fallback Mode**—if the internet drops, Krishna still delivers raw local verses without skipping a beat!
* **Seamless AI Brain**: Powered by the hyper-fast **OpenRouter Proxy** and Google's `gemini-2.5-flash` model. Features **Real-Time Streaming** via Server-Sent Events for instant typewriter-speed answers.
* **Localization Engine**: Dynamically translates and responds in English, pure Hindi, or Sanskrit with English definitions at the tap of a button.
* **Native Voice Integration**: Ask your questions verbally via the Microphone (`@react-native-voice/voice`) and hear Krishna's divine response read aloud via the Native Speech Synthesizer (`expo-speech`).
* **Full Persistence**: Your entire Chat History and Favorites are persisted locally using `AsyncStorage` so you never lose a profound realization.
* **OTA Resilience**: Integrated with **EAS Update** for instantaneous Over-The-Air feature deployments without needing a new `.apk`!

## 🛠 Tech Stack
* **Framework**: React Native / Expo SDK 54
* **AI Provider**: OpenRouter API (`google/gemini-2.5-flash`) via `react-native-sse`
* **Hardware APIs**: `@react-native-voice/voice`, `expo-speech`, `expo-av`
* **State Management**: React `useReducer` Context API + full AsyncStorage serialization
* **Styling**: Native StyleSheet & `expo-linear-gradient`

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
Because this app utilizes deep Android OS permissions (Microphone/Audio), you must build a standalone APK via the cloud builder:
```bash
npx eas-cli build -p android --profile preview
```

---
*Developed by **Amit Chanchal** | NIT Jamshedpur*
