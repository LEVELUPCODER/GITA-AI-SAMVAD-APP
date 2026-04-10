import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ResponseDepth } from '../services/geminiService';

export type Language = 'english' | 'hindi' | 'sanskrit';

// Types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface AppState {
  chatHistory: ChatMessage[];
  favorites: ChatMessage[];
  responseDepth: ResponseDepth;
  language: Language;
  isLoading: boolean;
}

type AppAction =
  | { type: 'ADD_MESSAGE'; message: ChatMessage }
  | { type: 'SET_LOADING'; isLoading: boolean }
  | { type: 'CLEAR_CHAT' }
  | { type: 'ADD_FAVORITE'; message: ChatMessage }
  | { type: 'REMOVE_FAVORITE'; messageId: string }
  | { type: 'SET_RESPONSE_DEPTH'; depth: ResponseDepth }
  | { type: 'SET_LANGUAGE'; language: Language }
  | { type: 'UPDATE_MESSAGE_CONTENT'; messageId: string; content: string }
  | { type: 'LOAD_STATE'; state: Partial<AppState> };

const initialState: AppState = {
  chatHistory: [],
  favorites: [],
  responseDepth: 'short',
  language: 'english',
  isLoading: false,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return { ...state, chatHistory: [...state.chatHistory, action.message] };
    case 'SET_LOADING':
      return { ...state, isLoading: action.isLoading };
    case 'CLEAR_CHAT':
      return { ...state, chatHistory: [] };
    case 'ADD_FAVORITE':
      if (state.favorites.find(f => f.id === action.message.id)) return state;
      return { ...state, favorites: [...state.favorites, action.message] };
    case 'REMOVE_FAVORITE':
      return { ...state, favorites: state.favorites.filter(f => f.id !== action.messageId) };
    case 'SET_RESPONSE_DEPTH':
      return { ...state, responseDepth: action.depth };
    case 'SET_LANGUAGE':
      return { ...state, language: action.language };
    case 'UPDATE_MESSAGE_CONTENT':
      return {
        ...state,
        chatHistory: state.chatHistory.map(msg =>
          msg.id === action.messageId
            ? { ...msg, content: action.content }
            : msg
        )
      };
    case 'LOAD_STATE':
      return { ...state, ...action.state };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType>({ state: initialState, dispatch: () => {} });

const STORAGE_KEY = '@gita_samvad_state';

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load persisted state on mount
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          dispatch({ type: 'LOAD_STATE', state: parsed });
        }
      } catch (e) {
        console.log('Failed to load saved state');
      }
    })();
  }, []);

  // Persist state changes
  useEffect(() => {
    const toSave = {
      favorites: state.favorites,
      responseDepth: state.responseDepth,
      language: state.language,
      chatHistory: state.chatHistory,
    };
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave)).catch(() => {});
  }, [state.favorites, state.responseDepth, state.language, state.chatHistory]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}

export function generateMessageId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}
