import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';
import { GradientButton } from '../components/common/GradientButton';
import { UserProfile } from '../types';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  onComplete: (profile: UserProfile) => void;
}

export function OnboardingScreen({ onComplete }: Props) {
  const [name, setName] = useState('');

  const handleBegin = () => {
    if (!name.trim()) return;
    onComplete({
      name: name.trim(),
      isOnboarded: true,
      firstLaunchDone: true,
      installTimestamp: Date.now(),
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Ionicons name="checkmark" size={36} color={COLORS.accent} />
            </View>
          </View>

          <Text style={styles.appName}>Aura</Text>
          <Text style={styles.tagline}>
            Find your focus. Master your daily quests.
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>WHAT SHOULD WE CALL YOU?</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor={COLORS.textMuted}
              autoFocus
              returnKeyType="go"
              onSubmitEditing={handleBegin}
            />
          </View>

          <GradientButton
            onPress={handleBegin}
            label="Begin Journey"
            disabled={!name.trim()}
            icon={
              <Ionicons name="arrow-forward" size={18} color="#0A0E1A" />
            }
            style={styles.beginBtn}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.accentSoft,
    borderWidth: 3,
    borderColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    color: COLORS.textPrimary,
    fontSize: 36,
    fontWeight: '700',
    marginBottom: 8,
  },
  tagline: {
    color: COLORS.textSecondary,
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 40,
  },
  inputContainer: {
    width: '100%',
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.glassBorderLight,
    marginBottom: 24,
  },
  inputLabel: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8,
  },
  input: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '500',
    paddingVertical: 4,
  },
  beginBtn: {
    width: '100%',
  },
});
