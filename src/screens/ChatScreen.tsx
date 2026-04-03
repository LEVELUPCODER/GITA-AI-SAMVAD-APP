import React, { useRef, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { ChatBubble } from '../components/ChatBubble';
import { ChatInput } from '../components/ChatInput';
import { Header } from '../components/Header';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { useAppContext, generateMessageId, ChatMessage } from '../context/AppContext';
import { getKrishnaGuidance } from '../services/geminiService';
import { Colors } from '../theme/colors';

export function ChatScreen() {
  const { state, dispatch } = useAppContext();
  const flatListRef = useRef<FlatList>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (state.chatHistory.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 300);
    }
  }, [state.chatHistory.length, state.isLoading]);

  const handleSend = async (text: string) => {
    // Add user message
    const userMsg: ChatMessage = {
      id: generateMessageId(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };
    dispatch({ type: 'ADD_MESSAGE', message: userMsg });
    dispatch({ type: 'SET_LOADING', isLoading: true });

    try {
      const response = await getKrishnaGuidance(text, state.responseDepth);
      const assistantMsg: ChatMessage = {
        id: generateMessageId(),
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
      };
      dispatch({ type: 'ADD_MESSAGE', message: assistantMsg });
    } catch (error: any) {
      const errorMsg: ChatMessage = {
        id: generateMessageId(),
        role: 'assistant',
        content: error.message || '🙏 A divine interruption occurred. Please try again.',
        timestamp: Date.now(),
      };
      dispatch({ type: 'ADD_MESSAGE', message: errorMsg });
    } finally {
      dispatch({ type: 'SET_LOADING', isLoading: false });
    }
  };

  const handleSave = (message: ChatMessage) => {
    const isSaved = state.favorites.some(f => f.id === message.id);
    if (isSaved) {
      dispatch({ type: 'REMOVE_FAVORITE', messageId: message.id });
    } else {
      dispatch({ type: 'ADD_FAVORITE', message });
    }
  };

  const handleToggleDepth = () => {
    const newDepth = state.responseDepth === 'short' ? 'detailed' : 'short';
    dispatch({ type: 'SET_RESPONSE_DEPTH', depth: newDepth });
  };

  const handleNewChat = () => {
    if (state.chatHistory.length > 0) {
      Alert.alert(
        '✨ New Samvad',
        'Start a fresh conversation with Krishna?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Yes',
            onPress: () => dispatch({ type: 'CLEAR_CHAT' }),
          },
        ]
      );
    }
  };

  const renderMessage = ({ item, index }: { item: ChatMessage; index: number }) => (
    <ChatBubble
      message={item}
      index={index}
      onSave={item.role === 'assistant' ? handleSave : undefined}
      isSaved={state.favorites.some(f => f.id === item.id)}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyLotus}>🪷</Text>
      <Text style={styles.emptyTitle}>Hare Krishna, Parth!</Text>
      <Text style={styles.emptySubtitle}>
        Ask me anything about life, duty, purpose, or the path to inner peace.
      </Text>
      <View style={styles.suggestionsContainer}>
        {[
          'What is the meaning of karma?',
          'How to overcome fear and anxiety?',
          'What is true happiness?',
        ].map((suggestion, i) => (
          <View key={i} style={styles.suggestionPill}>
            <Text
              style={styles.suggestionText}
              onPress={() => handleSend(suggestion)}
            >
              {suggestion}
            </Text>
          </View>
        ))}
      </View>
      <Text style={styles.verseCount}>📚 640 Gita verses loaded</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      <Header
        responseDepth={state.responseDepth}
        onToggleDepth={handleToggleDepth}
        onNewChat={handleNewChat}
      />

      <FlatList
        ref={flatListRef}
        data={state.chatHistory}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        contentContainerStyle={[
          styles.messageList,
          state.chatHistory.length === 0 && styles.emptyList,
        ]}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={state.isLoading ? <LoadingIndicator /> : null}
        showsVerticalScrollIndicator={false}
      />

      <ChatInput onSend={handleSend} disabled={state.isLoading} />

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Developed by <Text style={styles.footerBold}>Amit Chanchal</Text> | NIT Jamshedpur
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg.primary,
  },
  messageList: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyLotus: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.gold,
    marginBottom: 8,
    textShadowColor: 'rgba(255, 215, 0, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  emptySubtitle: {
    fontSize: 15,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  suggestionsContainer: {
    width: '100%',
    gap: 10,
  },
  suggestionPill: {
    backgroundColor: Colors.bg.card,
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.border.gold,
  },
  suggestionText: {
    color: Colors.text.secondary,
    fontSize: 14,
    textAlign: 'center',
  },
  verseCount: {
    fontSize: 12,
    color: Colors.text.tertiary,
    marginTop: 24,
  },
  footer: {
    paddingVertical: 6,
    alignItems: 'center',
    backgroundColor: Colors.bg.primary,
  },
  footerText: {
    fontSize: 11,
    color: Colors.text.tertiary,
    fontStyle: 'italic',
  },
  footerBold: {
    fontWeight: '700',
    color: Colors.text.secondary,
  },
});
