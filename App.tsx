import React, { useEffect, useState } from 'react';
import { StatusBar, View, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppStateProvider, useAppState } from './src/context/AppStateContext';
import { TimerProvider, useTimer } from './src/context/TimerContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { BreakScreen } from './src/screens/BreakScreen';
import { COLORS } from './src/constants/colors';
import { UserProfile } from './src/types';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

function AppContent() {
  const { profile, setProfileData, isLoading, showAppOpen } = useAppState();
  const { showBreakScreen } = useTimer();
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setAppReady(true);
      SplashScreen.hideAsync();

      // Show app open ad on subsequent launches
      if (profile?.isOnboarded) {
        setTimeout(() => {
          showAppOpen();
        }, 500);
      }
    }
  }, [isLoading, profile]);

  if (!appReady) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  }

  if (!profile?.isOnboarded) {
    return (
      <OnboardingScreen
        onComplete={async (p: UserProfile) => {
          await setProfileData(p);
        }}
      />
    );
  }

  return (
    <>
      <AppNavigator />
      <BreakScreen />
    </>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <StatusBar
          barStyle="light-content"
          backgroundColor={COLORS.background}
          translucent={false}
        />
        <AppStateProvider>
          <TimerProvider>
            <AppContent />
          </TimerProvider>
        </AppStateProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loader: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
