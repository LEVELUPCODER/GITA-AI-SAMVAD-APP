import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';
import Voice, { SpeechResultsEvent, SpeechErrorEvent } from '@react-native-voice/voice';
import { Colors } from '../theme/colors';
import { useAppContext } from '../context/AppContext';

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const { state } = useAppContext();
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    Voice.onSpeechResults = (e: SpeechResultsEvent) => {
      if (e.value && e.value[0]) setText(e.value[0]);
    };
    Voice.onSpeechEnd = () => setIsRecording(false);
    Voice.onSpeechError = (e: SpeechErrorEvent) => {
      console.log('Speech error:', e.error);
      setIsRecording(false);
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const handleStartRecord = async () => {
    try {
      if (isRecording) {
        await Voice.stop();
        setIsRecording(false);
      } else {
        setText('');
        const langCode = state.language === 'hindi' ? 'hi-IN' 
                       : state.language === 'sanskrit' ? 'sa-IN' 
                       : 'en-US';
        await Voice.start(langCode);
        setIsRecording(true);
      }
    } catch (e) {
      console.log('Voice start error:', e);
      setIsRecording(false);
    }
  };

  const handleSend = () => {
    const trimmed = text.trim();
    if (trimmed && !disabled) {
      onSend(trimmed);
      setText('');
      if (isRecording) {
        Voice.stop();
        setIsRecording(false);
      }
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
        {/* Record Button */}
        <TouchableOpacity
          style={[styles.actionBtn, isRecording && styles.recordingBtn]}
          onPress={handleStartRecord}
          disabled={disabled}
          activeOpacity={0.7}
        >
          <Text style={styles.sendIcon}>{isRecording ? '🛑' : '🎤'}</Text>
        </TouchableOpacity>

        {/* Send Button */}
        <TouchableOpacity
          style={[
            styles.actionBtn,
            styles.sendMode,
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
  actionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  sendMode: {
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    borderColor: Colors.border.gold,
  },
  recordingBtn: {
    backgroundColor: 'rgba(255, 0, 0, 0.15)',
    borderColor: 'red',
  },
  sendButtonDisabled: {
    opacity: 0.3,
  },
  sendIcon: {
    fontSize: 18,
  },
});
