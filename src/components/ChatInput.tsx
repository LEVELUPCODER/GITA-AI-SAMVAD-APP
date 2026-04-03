import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Colors } from '../theme/colors';

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [text, setText] = useState('');

  const handleSend = () => {
    const trimmed = text.trim();
    if (trimmed && !disabled) {
      onSend(trimmed);
      setText('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Ask Your Life Related Doubts..."
          placeholderTextColor={Colors.text.tertiary}
          value={text}
          onChangeText={setText}
          onSubmitEditing={handleSend}
          editable={!disabled}
          multiline
          maxLength={1000}
          returnKeyType="send"
          blurOnSubmit
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            (!text.trim() || disabled) && styles.sendButtonDisabled,
          ]}
          onPress={handleSend}
          disabled={!text.trim() || disabled}
          activeOpacity={0.7}
        >
          <Text style={styles.sendIcon}>🙏</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    paddingBottom: 20,
    backgroundColor: Colors.bg.primary,
    borderTopWidth: 1,
    borderTopColor: Colors.border.subtle,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: Colors.bg.input,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
    paddingLeft: 18,
    paddingRight: 6,
    paddingVertical: 4,
    minHeight: 48,
  },
  input: {
    flex: 1,
    color: Colors.text.primary,
    fontSize: 16,
    maxHeight: 100,
    paddingVertical: 10,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
    borderWidth: 1,
    borderColor: Colors.border.gold,
  },
  sendButtonDisabled: {
    opacity: 0.3,
  },
  sendIcon: {
    fontSize: 18,
  },
});
