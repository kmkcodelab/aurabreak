import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { DayHistory } from '../../types';
import { getDateLabel } from '../../utils/dateHelpers';
import { EmptyState } from '../common/EmptyState';

interface Props {
  history: DayHistory[];
}

export function HistoryList({ history }: Props) {
  if (history.length === 0) {
    return <EmptyState message="No history yet. Complete tasks today!" />;
  }

  const renderItem = ({ item }: { item: DayHistory }) => {
    const score = item.totalTasks > 0
      ? Math.round((item.tasksCompleted / item.totalTasks) * 5)
      : 0;

    return (
      <View style={styles.item}>
        <View style={styles.dateCol}>
          <Text style={styles.dateText}>{getDateLabel(item.date)}</Text>
          <Text style={styles.statsText}>
            {item.tasksCompleted}/{item.totalTasks} tasks
          </Text>
        </View>
        <View style={styles.stars}>
          {Array.from({ length: 5 }, (_, i) => (
            <Ionicons
              key={i}
              name={i < score ? 'star' : 'star-outline'}
              size={16}
              color={i < score ? COLORS.warning : COLORS.textMuted}
            />
          ))}
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={history.sort((a, b) => b.date.localeCompare(a.date))}
      renderItem={renderItem}
      keyExtractor={(item) => item.date}
      scrollEnabled={false}
    />
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.glassBorderLight,
  },
  dateCol: {},
  dateText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  statsText: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
});
