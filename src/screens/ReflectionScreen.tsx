import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';
import { useAppState } from '../context/AppStateContext';
import { MoodType } from '../types';
import { GlassCard } from '../components/common/GlassCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { MoodSelector } from '../components/reflection/MoodSelector';
import { GratitudeInput } from '../components/reflection/GratitudeInput';
import { ReflectionHistory } from '../components/reflection/ReflectionHistory';
import { Ionicons } from '@expo/vector-icons';
import { haptic } from '../utils/haptics';

export function ReflectionScreen() {
  const { profile, moods, logMood } = useAppState();
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [gratitude, setGratitude] = useState('');

  const handleSubmit = useCallback(async () => {
    if (!selectedMood) return;
    await logMood(selectedMood, gratitude.trim());
    haptic.success();
    setSelectedMood(null);
    setGratitude('');
  }, [selectedMood, gratitude, logMood]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.avatarCircle}>
              <Ionicons name="checkmark" size={18} color={COLORS.accent} />
            </View>
            <View>
              <Text style={styles.platformLabel}>AURA PLATFORM</Text>
              <Text style={styles.greeting}>
                Hi, {profile?.name || 'User'}
              </Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.dayLabel}>
              {new Date()
                .toLocaleDateString('en-US', { weekday: 'long' })
                .toUpperCase()}
            </Text>
            <StatusBadge />
          </View>
        </View>

        {/* Section Title */}
        <Text style={styles.sectionTitle}>Daily Check-in</Text>

        {/* Mood Selector */}
        <GlassCard style={styles.moodCard}>
          <MoodSelector selected={selectedMood} onSelect={setSelectedMood} />
        </GlassCard>

        {/* Gratitude Input */}
        <GlassCard style={styles.gratitudeCard}>
          <GratitudeInput
            value={gratitude}
            onChange={setGratitude}
            onSubmit={handleSubmit}
          />
        </GlassCard>

        {/* Reflections History */}
        <View style={styles.reflectionSection}>
          <Text style={styles.reflectionTitle}>🪞 Reflections</Text>
          <ReflectionHistory moods={moods} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 8,
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.accentSoft,
    borderWidth: 2,
    borderColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  platformLabel: {
    color: COLORS.textMuted,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
  },
  greeting: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: '700',
  },
  headerRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  dayLabel: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },
  moodCard: {
    marginBottom: 12,
  },
  gratitudeCard: {
    marginBottom: 24,
  },
  reflectionSection: {
    marginTop: 4,
  },
  reflectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
});
