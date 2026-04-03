import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors } from '../theme/colors';

export function LoadingIndicator() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        राधे राधे
      </Text>
      <ActivityIndicator size="small" color={Colors.gold} style={styles.spinner} />
      <Text style={styles.subtitle}>Consulting the Shlokas...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  text: {
    fontSize: 38,
    fontWeight: '700',
    color: Colors.gold,
    textShadowColor: 'rgba(255, 215, 0, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    marginBottom: 8,
  },
  spinner: {
    marginVertical: 8,
  },
  subtitle: {
    color: Colors.text.tertiary,
    fontSize: 14,
    marginTop: 4,
    fontStyle: 'italic',
  },
});

