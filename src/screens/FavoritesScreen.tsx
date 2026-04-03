import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppContext, ChatMessage } from '../context/AppContext';
import { Colors } from '../theme/colors';

export function FavoritesScreen() {
  const { state, dispatch } = useAppContext();

  const handleDelete = (messageId: string) => {
    Alert.alert(
      'Remove Saved Guidance',
      'Are you sure you want to remove this from your saved wisdom?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => dispatch({ type: 'REMOVE_FAVORITE', messageId }),
        },
      ]
    );
  };

  const renderItem = ({ item, index }: { item: ChatMessage; index: number }) => (
    <View style={styles.card}>
      <LinearGradient
        colors={['rgba(186, 85, 211, 0.08)', 'rgba(255, 215, 0, 0.04)']}
        style={styles.cardGradient}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardBadge}>
            <Text style={styles.badgeText}>⭐ Saved #{index + 1}</Text>
          </View>
          <TouchableOpacity
            onPress={() => handleDelete(item.id)}
            activeOpacity={0.7}
            style={styles.deleteButton}
          >
            <Text style={styles.deleteIcon}>🗑️</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.cardContent} numberOfLines={15}>
          {item.content}
        </Text>

        <Text style={styles.cardTimestamp}>
          {new Date(item.timestamp).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </LinearGradient>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📜</Text>
      <Text style={styles.emptyTitle}>No Saved Wisdom Yet</Text>
      <Text style={styles.emptySubtitle}>
        Tap the ☆ button on Krishna's responses to save them here for reflection.
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['rgba(10, 10, 15, 1)', 'rgba(10, 10, 15, 0.92)']}
        style={styles.header}
      >
        <Text style={styles.headerIcon}>📜</Text>
        <View>
          <Text style={styles.headerTitle}>Saved Wisdom</Text>
          <Text style={styles.headerSubtitle}>
            {state.favorites.length} divine guidance{state.favorites.length !== 1 ? 's' : ''} saved
          </Text>
        </View>
      </LinearGradient>

      <FlatList
        data={state.favorites}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.list,
          state.favorites.length === 0 && styles.emptyList,
        ]}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg.primary,
  },
  header: {
    paddingTop: 54,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.subtle,
  },
  headerIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.gold,
  },
  headerSubtitle: {
    fontSize: 12,
    color: Colors.text.tertiary,
    marginTop: 2,
  },
  list: {
    padding: 16,
    paddingBottom: 100,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  card: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border.gold,
  },
  cardGradient: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardBadge: {
    backgroundColor: 'rgba(255, 215, 0, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.gold,
  },
  deleteButton: {
    padding: 4,
  },
  deleteIcon: {
    fontSize: 18,
  },
  cardContent: {
    fontSize: 14,
    lineHeight: 22,
    color: Colors.text.primary,
  },
  cardTimestamp: {
    fontSize: 11,
    color: Colors.text.tertiary,
    marginTop: 12,
    textAlign: 'right',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 56,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
