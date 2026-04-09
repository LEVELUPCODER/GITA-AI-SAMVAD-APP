# 🪷 Gita-Ai Samvad: Comprehensive Project Breakdown

This document provides a holistic view of the application, perfect for showcasing your architectural decisions and explaining the application to recruiters or LinkedIn followers.

---

## 📱 How to Use This App
Using Gita-Ai Samvad is designed to be as serene and intuitive as possible:
1. **Ask a Life Doubt:** Open the app and type any real-world problem or personal doubt into the chat bar (e.g., *"How do I deal with failure at my job?"*).
2. **Select Response Depth:** Tap the icon in the header to toggle between **Short** (quick, actionable advice) or **Deep** (a thorough philosophical breakdown) responses.
3. **Receive Divine Guidance:** The app consults the Bhagavad Gita and returns a personalized answer, speaking directly to you as "Parth".
4. **Save Wisdom:** Tap the ⭐ **Save** button under any response you want to keep. You can revisit these saved pearls of wisdom anytime in the 'Favorites' tab.

---

## ✨ Features In Detail
* **Dual-Depth Responses:** A dynamic toggle that instructs the AI to alter its prompt engineering on the fly based on user preference.
* **Intelligent Favorite System:** A fully functional persistence layer. Users can build their own offline library of personalized spiritual guidance.
* **Premium Dark Aesthetics:** Glassmorphic UI elements, glowing gold gradients (`expo-linear-gradient`), and hardware-accelerated floating micro-animations make the app feel incredibly modern.

---

## ⚙️ How Everything Works (The Architecture)
The application handles requests using a highly optimized **Retrieval-Augmented Generation (RAG)** pipeline completely hosted on the client-side:

1. **User Input:** The user types a question.
2. **Offline Keyword Search (BM25):** The app's `searchService.ts` runs a rapid keyword-matching algorithm against a locally bundled JSON dataset containing 640+ Bhagavad Gita verses.
3. **Context Extraction:** The top 2 most relevant verses are extracted. 
4. **Prompt Augmentation:** The extracted verses are wrapped into a strict system prompt instructing the LLM to act as Lord Krishna and answer the user's specific context *strictly* using the provided verses.
5. **OpenRouter API Call:** The app makes a native `fetch` request to the OpenRouter proxy, triggering Google's `gemini-2.5-flash` model.
6. **UI Rendering:** The result is instantly streamed and rendered in the customized `ChatBubble` component.

---

## 🌐 Offline vs. Online Capabilities
To minimize cloud costs and maximize speed, the app leverages a hybrid approach:
* **🟢 Fully Offline (Local Operation):** The heavy lifting of the dataset indexing, the keyword vector searching, the prompt building, and the saved Favorites persistence all occur completely offline on your device processor. This saves massive bandwidth.
* **🔵 Requires Online connection:** The final generation step requires passing the constructed prompt to OpenRouter to utilize the LLM. You cannot get new responses without an internet connection.

---

## ⚖️ Pros and Cons of this Architecture

### 👍 Pros
* **Extremely Fast:** By keeping the database bundled on the phone, we eliminate the latency of querying a remote vector database (like Pinecone).
* **Cost Effective:** OpenRouter proxying heavily reduces costs, and caching the database on the phone completely eliminates database hosting fees.
* **Fully Cross-Platform:** Thanks to Expo, this identical codebase flawlessly compiles to native Android (`.apk`), native iOS, and the Web simultaneously.

### 👎 Cons
* **No Offline Inference:** Because we rely on the `gemini-2.5-flash` model, the app physically cannot answer new questions in Airplane mode.
* **Static Dataset:** If new verses or translations need to be added to the Gita dataset, the app requires an OTA (Over-The-Air) update to refresh the local JSON file.

---

## 🖥️ Detailed Tech Stack
* **Frontend Framework**: React Native (Expo SDK 54)
* **Language**: TypeScript (Strict)
* **AI Provider**: OpenRouter API (`google/gemini-2.5-flash`)
* **State Management**: React Context API + `useReducer`
* **Local Persistence**: `@react-native-async-storage/async-storage`
* **Animations**: React Native Animated API (`react-native-reanimated`)
* **Build Pipeline**: EAS (Expo Application Services) Cloud Builder
