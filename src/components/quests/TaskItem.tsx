import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { Task } from '../../types';

interface Props {
  task: Task;
  onToggle: () => void;
  onEdit: (text: string) => void;
  onDelete: () => void;
}

export function TaskItem({ task, onToggle, onEdit, onDelete }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);

  const handleSaveEdit = () => {
    if (editText.trim()) {
      onEdit(editText.trim());
    }
    setIsEditing(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.checkbox}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <Ionicons
          name={
            task.completed
              ? 'checkmark-circle'
              : 'ellipse-outline'
          }
          size={24}
          color={task.completed ? COLORS.accent : COLORS.textMuted}
        />
      </TouchableOpacity>

      {isEditing ? (
        <TextInput
          style={styles.editInput}
          value={editText}
          onChangeText={setEditText}
          onSubmitEditing={handleSaveEdit}
          onBlur={handleSaveEdit}
          autoFocus
          returnKeyType="done"
        />
      ) : (
        <Text
          style={[styles.text, task.completed && styles.completedText]}
          numberOfLines={1}
        >
          {task.text}
        </Text>
      )}

      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => {
            if (task.completed) return;
            setIsEditing(true);
          }}
          disabled={task.completed}
          activeOpacity={0.7}
        >
          <Ionicons
            name="pencil-outline"
            size={18}
            color={task.completed ? COLORS.textMuted : COLORS.textSecondary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            if (task.completed) return;
            onDelete();
          }}
          disabled={task.completed}
          activeOpacity={0.7}
        >
          <Ionicons
            name="trash-outline"
            size={18}
            color={task.completed ? COLORS.textMuted : COLORS.danger}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    gap: 12,
  },
  checkbox: {
    width: 28,
    alignItems: 'center',
  },
  text: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 15,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: COLORS.textMuted,
  },
  editInput: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.accent,
    paddingVertical: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
});
