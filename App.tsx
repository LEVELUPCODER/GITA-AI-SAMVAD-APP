import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { AppProvider } from './src/context/AppContext';
import { ChatScreen } from './src/screens/ChatScreen';
import { FavoritesScreen } from './src/screens/FavoritesScreen';
import { initializeSearch, getVerseCount } from './src/services/searchService';
import { Colors } from './src/theme/colors';

type TabName = 'chat' | 'favorites';

function TabBar({
  active,
  onPress,
}: {
  active: TabName;
  onPress: (tab: TabName) => void;
}) {
  return (
    <View style={tabStyles.container}>
      <TouchableOpacity
        style={[tabStyles.tab, active === 'chat' && tabStyles.activeTab]}
        onPress={() => onPress('chat')}
        activeOpacity={0.7}
      >
        <Text style={[tabStyles.icon, active === 'chat' && tabStyles.activeIcon]}>
          🪷
        </Text>
        <Text
          style={[tabStyles.label, active === 'chat' && tabStyles.activeLabel]}
        >
          Samvad
        </Text>
        {active === 'chat' && <View style={tabStyles.indicator} />}
      </TouchableOpacity>

      <TouchableOpacity
        style={[tabStyles.tab, active === 'favorites' && tabStyles.activeTab]}
        onPress={() => onPress('favorites')}
        activeOpacity={0.7}
      >
        <Text
          style={[
            tabStyles.icon,
            active === 'favorites' && tabStyles.activeIcon,
          ]}
        >
          ⭐
        </Text>
        <Text
          style={[
            tabStyles.label,
            active === 'favorites' && tabStyles.activeLabel,
          ]}
        >
          Saved
        </Text>
        {active === 'favorites' && <View style={tabStyles.indicator} />}
      </TouchableOpacity>
    </View>
  );
}

function SplashScreen() {
  return (
    <View style={splashStyles.container}>
      <Text style={splashStyles.lotus}>🪷</Text>
      <Text style={splashStyles.title}>Gita-Ai Samvad</Text>
      <Text style={splashStyles.subtitle}>Loading divine wisdom...</Text>
      <ActivityIndicator
        size="small"
        color={Colors.gold}
        style={splashStyles.spinner}
      />
    </View>
  );
}

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [activeTab, setActiveTab] = useState<TabName>('chat');

  useEffect(() => {
    // Initialize the search index on app start
    const init = async () => {
      try {
        initializeSearch();
        const count = getVerseCount();
        console.log(`✅ Loaded ${count} Gita verses`);
      } catch (e) {
        console.error('Failed to initialize search:', e);
      }
      // Small delay for splash feel
      setTimeout(() => setIsReady(true), 1200);
    };
    init();
  }, []);

  if (!isReady) {
    return (
      <>
        <StatusBar barStyle="light-content" backgroundColor={Colors.bg.primary} />
        <SplashScreen />
      </>
    );
  }

  return (
    <AppProvider>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg.primary} />
      <View style={styles.container}>
        <View style={styles.content}>
          {activeTab === 'chat' ? <ChatScreen /> : <FavoritesScreen />}
        </View>
        <TabBar active={activeTab} onPress={setActiveTab} />
      </View>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg.primary,
  },
  content: {
    flex: 1,
  },
});

const tabStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgba(10, 10, 15, 0.98)',
    borderTopWidth: 1,
    borderTopColor: Colors.border.subtle,
    paddingBottom: 24,
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    position: 'relative',
  },
  activeTab: {},
  icon: {
    fontSize: 22,
    opacity: 0.5,
  },
  activeIcon: {
    opacity: 1,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.text.tertiary,
    marginTop: 2,
  },
  activeLabel: {
    color: Colors.gold,
  },
  indicator: {
    position: 'absolute',
    top: 0,
    width: 24,
    height: 2,
    backgroundColor: Colors.gold,
    borderRadius: 1,
  },
});

const splashStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lotus: {
    fontSize: 72,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.gold,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(255, 215, 0, 0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.text.tertiary,
    marginTop: 8,
    fontStyle: 'italic',
  },
  spinner: {
    marginTop: 24,
  },
});
