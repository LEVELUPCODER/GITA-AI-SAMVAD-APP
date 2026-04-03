import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { ChatMessage } from '../context/AppContext';
import { Colors } from '../theme/colors';

interface ChatBubbleProps {
  message: ChatMessage;
  onSave?: (message: ChatMessage) => void;
  isSaved?: boolean;
  index: number;
}

export function ChatBubble({ message, onSave, isSaved, index }: ChatBubbleProps) {
  const isAssistant = message.role === 'assistant';
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: 50,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay: 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        isAssistant ? styles.assistantContainer : styles.userContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {/* Avatar */}
      <View style={[styles.avatar, isAssistant ? styles.assistantAvatar : styles.userAvatar]}>
        <Text style={styles.avatarText}>{isAssistant ? '🪷' : '👤'}</Text>
      </View>

      {/* Message bubble */}
      <View style={[styles.bubble, isAssistant ? styles.assistantBubble : styles.userBubble]}>
        {isAssistant && (
          <Text style={styles.roleLabel}>Krishna</Text>
        )}
        <Text style={[styles.messageText, isAssistant ? styles.assistantText : styles.userText]}>
          {message.content}
        </Text>

        {/* Save button for assistant messages */}
        {isAssistant && onSave && (
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => onSave(message)}
            activeOpacity={0.7}
          >
            <Text style={[styles.saveIcon, isSaved && styles.savedIcon]}>
              {isSaved ? '⭐' : '☆'}
            </Text>
            <Text style={[styles.saveText, isSaved && styles.savedText]}>
              {isSaved ? 'Saved' : 'Save'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingHorizontal: 12,
    alignItems: 'flex-start',
  },
  assistantContainer: {
    flexDirection: 'row',
  },
  userContainer: {
    flexDirection: 'row-reverse',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  assistantAvatar: {
    backgroundColor: 'rgba(186, 85, 211, 0.2)',
    borderWidth: 1,
    borderColor: Colors.border.pink,
  },
  userAvatar: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: Colors.border.subtle,
  },
  avatarText: {
    fontSize: 18,
  },
  bubble: {
    flex: 1,
    maxWidth: '82%',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 8,
  },
  assistantBubble: {
    backgroundColor: 'rgba(186, 85, 211, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(186, 85, 211, 0.15)',
    borderTopLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: Colors.border.subtle,
    borderTopRightRadius: 4,
  },
  roleLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.gold,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 23,
  },
  assistantText: {
    color: Colors.text.primary,
  },
  userText: {
    color: Colors.text.secondary,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    alignSelf: 'flex-start',
  },
  saveIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  savedIcon: {
    color: Colors.gold,
  },
  saveText: {
    fontSize: 12,
    color: Colors.text.tertiary,
    fontWeight: '500',
  },
  savedText: {
    color: Colors.gold,
  },
});
