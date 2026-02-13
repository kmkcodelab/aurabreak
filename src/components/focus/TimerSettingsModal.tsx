import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { GlassModal } from '../common/GlassModal';
import { GradientButton } from '../common/GradientButton';
import { COLORS } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (focus: number, breakDur: number) => void;
  currentFocus: number;
  currentBreak: number;
}

export function TimerSettingsModal({
  visible,
  onClose,
  onSave,
  currentFocus,
  currentBreak,
}: Props) {
  const [focus, setFocus] = useState(currentFocus.toString());
  const [breakDur, setBreakDur] = useState(currentBreak.toString());

  const handleSave = () => {
    const f = parseInt(focus, 10) || 25;
    const b = parseInt(breakDur, 10) || 5;
    onSave(Math.max(1, Math.min(120, f)), Math.max(1, Math.min(30, b)));
    onClose();
  };

  return (
    <GlassModal visible={visible} onClose={onClose} title="Timer Settings">
      <View style={styles.field}>
        <Text style={styles.label}>FOCUS DURATION (MIN)</Text>
        <View style={styles.inputRow}>
          <Ionicons name="flash" size={18} color={COLORS.accent} />
          <TextInput
            style={styles.input}
            value={focus}
            onChangeText={setFocus}
            keyboardType="number-pad"
            maxLength={3}
            placeholderTextColor={COLORS.textMuted}
          />
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>BREAK DURATION (MIN)</Text>
        <View style={styles.inputRow}>
          <Ionicons name="time-outline" size={18} color={COLORS.accent} />
          <TextInput
            style={styles.input}
            value={breakDur}
            onChangeText={setBreakDur}
            keyboardType="number-pad"
            maxLength={2}
            placeholderTextColor={COLORS.textMuted}
          />
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
          <Text style={styles.cancelText}>CANCEL</Text>
        </TouchableOpacity>
        <GradientButton onPress={handleSave} label="SAVE" icon={
          <Ionicons name="checkmark" size={18} color="#0A0E1A" />
        } />
      </View>
    </GlassModal>
  );
}

const styles = StyleSheet.create({
  field: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    color: COLORS.accent,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundLight,
    borderRadius: 12,
    paddingHorizontal: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: COLORS.glassBorderLight,
  },
  input: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '600',
    paddingVertical: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 8,
  },
  cancelBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  cancelText: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
});
