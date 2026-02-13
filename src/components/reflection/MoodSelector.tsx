import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { MoodType } from '../../types';

interface MoodOption {
  type: MoodType;
  emoji: string;
  label: string;
  color: string;
}

const MOOD_OPTIONS: MoodOption[] = [
  { type: 'great', emoji: '✨', label: 'GREAT', color: COLORS.moodGreat },
  { type: 'good', emoji: '😊', label: 'GOOD', color: COLORS.moodGood },
  { type: 'neutral', emoji: '😐', label: 'NEUTRAL', color: COLORS.moodNeutral },
  {
    type: 'productive',
    emoji: '🚀',
    label: 'PRODUCTIVE',
    color: COLORS.moodProductive,
  },
  { type: 'tired', emoji: '😴', label: 'TIRED', color: COLORS.moodTired },
];

interface Props {
  selected: MoodType | null;
  onSelect: (mood: MoodType) => void;
}

export function MoodSelector({ selected, onSelect }: Props) {
  return (
    <View style={styles.container}>
      {MOOD_OPTIONS.map((opt) => (
        <TouchableOpacity
          key={opt.type}
          style={[
            styles.option,
            selected === opt.type && {
              backgroundColor: opt.color + '20',
              borderColor: opt.color,
            },
          ]}
          onPress={() => onSelect(opt.type)}
          activeOpacity={0.7}
        >
          <Text style={styles.emoji}>{opt.emoji}</Text>
          <Text
            style={[
              styles.label,
              selected === opt.type && { color: opt.color },
            ]}
          >
            {opt.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  option: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  emoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  label: {
    color: COLORS.textMuted,
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
