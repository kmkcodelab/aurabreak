import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';
import { useAppState } from '../context/AppStateContext';
import { GlassCard } from '../components/common/GlassCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { TaskInput } from '../components/quests/TaskInput';
import { TaskItem } from '../components/quests/TaskItem';
import { UnlockSlotButton } from '../components/quests/UnlockSlotButton';
import { HistoryList } from '../components/quests/HistoryList';
import { Ionicons } from '@expo/vector-icons';

export function QuestsScreen() {
  const {
    profile,
    tasks,
    taskSlots,
    addTask,
    toggleTask,
    editTask,
    deleteTask,
    unlockTaskSlots,
    history,
  } = useAppState();

  const canAddMore = tasks.length < taskSlots;

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
        <Text style={styles.sectionTitle}>Daily Wins</Text>
        <View style={styles.dotsRow}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        {/* Task Input */}
        {canAddMore && (
          <View style={styles.inputContainer}>
            <TaskInput onAdd={addTask} />
          </View>
        )}

        {/* Task List */}
        <GlassCard style={styles.taskListCard}>
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={() => toggleTask(task.id)}
              onEdit={(text) => editTask(task.id, text)}
              onDelete={() => deleteTask(task.id)}
            />
          ))}

          {tasks.length < taskSlots && tasks.length > 0 && (
            <View style={styles.emptySlots}>
              {Array.from(
                { length: taskSlots - tasks.length },
                (_, i) => (
                  <View key={i} style={styles.emptySlot}>
                    <Ionicons
                      name="ellipse-outline"
                      size={24}
                      color={COLORS.textMuted}
                    />
                    <View style={styles.emptyLine} />
                  </View>
                )
              )}
            </View>
          )}

          {/* Unlock Button */}
          <UnlockSlotButton onPress={unlockTaskSlots} />
        </GlassCard>

        {/* 7-Day History */}
        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>📈 7-Day History</Text>
          <HistoryList history={history} />
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
    marginBottom: 6,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 16,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.textMuted,
  },
  dotActive: {
    backgroundColor: COLORS.accent,
  },
  inputContainer: {
    marginBottom: 16,
  },
  taskListCard: {
    paddingVertical: 8,
  },
  emptySlots: {
    marginTop: 4,
  },
  emptySlot: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    gap: 12,
  },
  emptyLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.glassBorderLight,
  },
  historySection: {
    marginTop: 28,
  },
  historyTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
});
