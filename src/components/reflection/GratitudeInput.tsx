import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

interface Props {
  value: string;
  onChange: (text: string) => void;
  onSubmit: () => void;
}

export function GratitudeInput({ value, onChange, onSubmit }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>TODAY I'M GRATEFUL FOR...</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChange}
          placeholder="Capture a positive moment..."
          placeholderTextColor={COLORS.textMuted}
          multiline
          maxLength={200}
        />
        <TouchableOpacity
          style={styles.sendBtn}
          onPress={onSubmit}
          activeOpacity={0.7}
        >
          <Ionicons name="send" size={20} color={COLORS.accent} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  label: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 14,
    paddingLeft: 16,
    paddingRight: 6,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: COLORS.glassBorderLight,
  },
  input: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 14,
    minHeight: 40,
    maxHeight: 80,
    paddingVertical: 6,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
