import React, { useCallback } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { useAppState } from '../context/AppStateContext';
import { FocusScreen } from '../screens/FocusScreen';
import { QuestsScreen } from '../screens/QuestsScreen';
import { ReflectionScreen } from '../screens/ReflectionScreen';
import { BannerAdView } from '../components/ads/BannerAdView';

const Tab = createBottomTabNavigator();

type IconName = 'flash' | 'flash-outline' | 'grid' | 'grid-outline' | 'heart' | 'heart-outline';

export function AppNavigator() {
  const { trackTabSwitch } = useAppState();

  const handleTabPress = useCallback(() => {
    trackTabSwitch();
  }, [trackTabSwitch]);

  return (
    <NavigationContainer>
      <View style={styles.container}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarStyle: styles.tabBar,
            tabBarActiveTintColor: COLORS.accent,
            tabBarInactiveTintColor: COLORS.textMuted,
            tabBarLabelStyle: styles.tabLabel,
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: IconName;

              switch (route.name) {
                case 'Focus':
                  iconName = focused ? 'flash' : 'flash-outline';
                  break;
                case 'Quests':
                  iconName = focused ? 'grid' : 'grid-outline';
                  break;
                case 'Reflection':
                  iconName = focused ? 'heart' : 'heart-outline';
                  break;
                default:
                  iconName = 'flash-outline';
              }

              return <Ionicons name={iconName} size={22} color={color} />;
            },
          })}
          screenListeners={{
            tabPress: handleTabPress,
          }}
        >
          <Tab.Screen name="Focus" component={FocusScreen} />
          <Tab.Screen name="Quests" component={QuestsScreen} />
          <Tab.Screen name="Reflection" component={ReflectionScreen} />
        </Tab.Navigator>

        {/* Persistent Banner Ad above tab bar */}
        <View style={styles.bannerWrapper}>
          <View style={styles.adLabelRow}>
            <View style={styles.adBadge}>
              <Ionicons name="megaphone" size={10} color={COLORS.textMuted} />
              <Ionicons name="text" size={0} color="transparent" />
            </View>
          </View>
          <BannerAdView />
        </View>
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  tabBar: {
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.glassBorderLight,
    height: Platform.OS === 'ios' ? 85 : 65,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    paddingTop: 8,
    elevation: 0,
    shadowOpacity: 0,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  bannerWrapper: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 85 : 65,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.glassBorderLight,
    paddingVertical: 4,
  },
  adLabelRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingBottom: 2,
  },
  adBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
});
