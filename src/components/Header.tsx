import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../theme/colors';
import { ResponseDepth } from '../services/geminiService';
import { Language } from '../context/AppContext';

interface HeaderProps {
  responseDepth: ResponseDepth;
  onToggleDepth: () => void;
  language: Language;
  onToggleLanguage: () => void;
  onNewChat: () => void;
}

export function Header({ responseDepth, onToggleDepth, language, onToggleLanguage, onNewChat }: HeaderProps) {
  return (
    <LinearGradient
      colors={['rgba(10, 10, 15, 1)', 'rgba(10, 10, 15, 0.92)']}
      style={styles.container}
    >
      <View style={styles.titleRow}>
        <View style={styles.titleContainer}>
          <Text style={styles.lotus}>🪷</Text>
          <View>
            <Text style={styles.title}>Gita-Ai Samvad</Text>
            <Text style={styles.subtitle}>Strategic Wisdom for Parth</Text>
          </View>
        </View>

        <View style={styles.actions}>
          {/* Depth toggle */}
          <TouchableOpacity
            style={styles.depthButton}
            onPress={onToggleDepth}
            activeOpacity={0.7}
          >
            <Text style={styles.depthIcon}>
              {responseDepth === 'short' ? '⚡' : '📜'}
            </Text>
            <Text style={styles.depthText}>
              {responseDepth === 'short' ? 'Brief' : 'Deep'}
            </Text>
          </TouchableOpacity>

          {/* Language toggle */}
          <TouchableOpacity
            style={styles.depthButton}
            onPress={onToggleLanguage}
            activeOpacity={0.7}
          >
            <Text style={styles.depthIcon}>
              {language === 'english' ? '🇺🇸' : language === 'hindi' ? '🇮🇳' : '🕉️'}
            </Text>
            <Text style={styles.depthText}>
              {language === 'english' ? 'Eng' : language === 'hindi' ? 'Hin' : 'San'}
            </Text>
          </TouchableOpacity>

          {/* New chat */}
          <TouchableOpacity
            style={styles.newChatButton}
            onPress={onNewChat}
            activeOpacity={0.7}
          >
            <Text style={styles.newChatIcon}>✨</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingBottom: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.subtle,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lotus: {
    fontSize: 30,
    marginRight: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.gold,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(255, 215, 0, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.text.tertiary,
    marginTop: 2,
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  depthButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bg.card,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
  },
  depthIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  depthText: {
    fontSize: 11,
    color: Colors.text.secondary,
    fontWeight: '600',
  },
  newChatButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.bg.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border.gold,
  },
  newChatIcon: {
    fontSize: 16,
  },
});
