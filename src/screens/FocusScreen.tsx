import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';
import { useTimer } from '../context/TimerContext';
import { useAppState } from '../context/AppStateContext';
import { useOverlayPermission } from '../hooks/useOverlayPermission';
import { CircularTimer } from '../components/focus/CircularTimer';
import { TimerControls } from '../components/focus/TimerControls';
import { ModeToggle } from '../components/focus/ModeToggle';
import { TimerSettingsModal } from '../components/focus/TimerSettingsModal';
import { PermissionModal } from '../components/focus/PermissionModal';
import { StatusBadge } from '../components/common/StatusBadge';
import { Ionicons } from '@expo/vector-icons';

export function FocusScreen() {
  const { timerState, startTimer, pauseTimer, resetTimer, updateSettings, toggleAutoLoop } =
    useTimer();
  const { profile } = useAppState();
  const overlay = useOverlayPermission();
  const [showSettings, setShowSettings] = useState(false);
  const [verifyingPermission, setVerifyingPermission] = useState(false);
  const [hasCheckedOnce, setHasCheckedOn
