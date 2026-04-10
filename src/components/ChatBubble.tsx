import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Share } from 'react-native';
import * as Speech from 'expo-speech';
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
  const [isReading, setIsReading] = useState(false);

  const handleRead = () => {
    if (isReading) {
      Speech.stop();
      setIsReading(false);
    } else {
      setIsReading(true);
      Speech.speak(message.content, {
        rate: 0.9,
        pitch: 0.9,
        onDone: () => setIsReading(false),
        onStopped: () => setIsReading(false),
        onError: () => setIsReading(false),
      });
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${message.content}\n\n- Divine Guidance via Gita AI Samvad`,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

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
        <Text 
          style={[styles.messageText, isAssistant ? styles.assistantText : styles.userText]}
          selectable={true}
        >
          {message.content}
        </Text>

        {/* Action buttons for assistant messages */}
        {isAssistant && (
          <View style={styles.actionContainer}>
            {onSave && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => onSave(message)}
                activeOpacity={0.7}
              >
                <Text style={[styles.actionIcon, isSaved && styles.savedIcon]}>
                  {isSaved ? '⭐' : '☆'}
                </Text>
                <Text style={[styles.actionText, isSaved && styles.savedText]}>
                  {isSaved ? 'Saved' : 'Save'}
                </Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleShare}
              activeOpacity={0.7}
            >
              <Text style={styles.actionIcon}>📤</Text>
              <Text style={styles.actionText}>Share</Text>
            </TouchableOpacity>

            {/* Read Aloud Button */}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleRead}
              activeOpacity={0.7}
            >
              <Text style={[styles.actionIcon, isReading && styles.savedIcon]}>
                {isReading ? '🔇' : '🔊'}
              </Text>
              <Text style={[styles.actionText, isReading && styles.savedText]}>
                {isReading ? 'Stop' : 'Read'}
              </Text>
            </TouchableOpacity>
          </View>
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
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  savedIcon: {
    color: Colors.gold,
  },
  actionText: {
    fontSize: 12,
    color: Colors.text.tertiary,
    fontWeight: '500',
  },
  savedText: {
    color: Colors.gold,
  },
});
