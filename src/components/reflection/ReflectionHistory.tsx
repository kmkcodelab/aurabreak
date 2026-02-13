import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { MoodEntry } from '../../types';
import { EmptyState } from '../common/EmptyState';

const MOOD_LABELS: Record<string, { emoji: string; label: string }> = {
  great: { emoji: '✨', label: 'Great energy' },
  good: { emoji: '😊', label: 'Good energy' },
  neutral: { emoji: '😐', label: 'Neutral mood' },
  productive: { emoji: '🚀', label: 'Productive day' },
  tired: { emoji: '😴', label: 'Feeling tired' },
};

interface Props {
  moods: MoodEntry[];
}

export function ReflectionHistory({ moods }: Props) {
  const todaysMoods = moods.filter(
    (m) => m.date === new Date().toISOString().split('T')[0]
  );

  if (todaysMoods.length === 0) {
    return (
      <EmptyState
        icon="star-outline"
        message="Your story begins here."
      />
    );
  }

  return (
    <View>
      {todaysMoods.map((entry) => {
        const moodData = MOOD_LABELS[entry.mood] || MOOD_LABELS.neutral;
        const date = new Date(entry.timestamp);
        const dateStr = date.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        });

        return (
          <View key={entry.id} style={styles.entry}>
            <View style={styles.header}>
              <Text style={styles.emoji}>{moodData.emoji}</Text>
              <View style={styles.headerText}>
                <Text style={styles.date}>{dateStr.toUpperCase()}</Text>
                <Text style={styles.moodLabel}>{moodData.label}</Text>
              </View>
              <Ionicons
                name="chevron-down"
                size={18}
                color={COLORS.textMuted}
              />
            </View>
            {entry.gratitude ? (
              <Text style={styles.gratitude}>{entry.gratitude}</Text>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  entry: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.glassBorderLight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  emoji: {
    fontSize: 24,
  },
  headerText: {
    flex: 1,
  },
  date: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  moodLabel: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  gratitude: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginTop: 8,
    marginLeft: 34,
    fontStyle: 'italic',
  },
});
