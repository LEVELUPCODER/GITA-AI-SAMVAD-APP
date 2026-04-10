# Technical Architecture: Gita-Ai Samvad

This document details the advanced engineering principles, data flows, and hardware integration pipelines running under the hood of Gita-Ai Samvad.

## 🏗️ Core Application Architecture
- **Framework:** Custom Managed Expo SDK 54 / React Native.
- **Micro-interactions Environment:** `expo-linear-gradient`, `React Native Animated` (Strict Native Driver compliance).
- **Deployment & Patching:** **EAS Updates (Over-The-Air)** pipelines natively constructed, decoupling UI/JS patches from the Google Play Store update restrictions.

## 🧠 The "Divine RAG" Pipeline (Retrieval-Augmented Generation)
1. **Local Vector Search:** The application bundles `bhagavad_gita.json` directly into the asset bundle, containing all 600+ shlokas. 
2. **Offline Keyword Indexing:** Employs an on-device BM25 mapping function that statically ranks and streams the top 2 contextually matching verses dynamically into memory based on user queries—with 0ms network latency.
3. **Offline Fallback Protocol:** If the external LLM or network fails, the interceptor immediately falls back to rendering the pure RAG context as the physical answer, ensuring 100% uptime regardless of internet connectivity.

## 🌐 AI Proxy & Event Streaming
- **Provider:** OpenRouter.ai routing to Google's `gemini-2.5-flash`.
- **Latency Circumvention:** Employs **Real-time Server-Sent Events (SSE)** via `react-native-sse`. Instead of waiting 5+ seconds for standard `fetch()` Promisification, the UI consumes `delta.content` chunks, dripping them into a dynamic React State object to produce an instant "typing" effect on the frontend.
- **Language Localization State:** Dynamic prompt mutation depending on an explicitly declared Redux-style Global Context `Language = 'english' | 'hindi' | 'sanskrit'`.

## 🎙️ Hardware Native Interactions
We break out of standard JS sandboxes to utilize OS-level bindings:
- **Speech Capture:** `@react-native-voice/voice` requires core Android OS Microphone recording permissions to convert live vocal frequencies into string representations instantly injected into the RAG pipeline.
- **Speech Synthesis:** Uses native `expo-speech` hooks mapped tightly to UI Action buttons.
- **Audio Ambience:** Employs `expo-av` streaming on root component mount for immersive atmospheric startup states.
- **System Share Sheets:** Bound to OS-level `Share.share()` intent registries for outward dissemination of text limits.

## 💾 AppContext State Persistence
A `useReducer`-based Context Provider acts as the single source of truth:
- **Serialization Pipeline:** Flattens raw complex Object structures into Stringified Maps.
- **Persistent Storage:** Pipes to `AsyncStorage`, safely mounting all individual nodes (`favorites[]`, `chatHistory[]`, `responseDepth`, `language`) so state is beautifully restored through deep memory mapping the moment the React tree re-mounts.
