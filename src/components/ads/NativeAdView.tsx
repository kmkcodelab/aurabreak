import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../../constants/colors';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { AD_CONFIG } from '../../constants/adConfig';
import { Ionicons } from '@expo/vector-icons';

// Note: react-native-google-mobile-ads has limited native ad support in managed Expo.
// This is a placeholder that renders a styled ad container.
// In a bare workflow, you'd use NativeAdView from the ads SDK.

export function NativeAdView() {
  const isConnected = useNetworkStatus();
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (!isConnected) return;
    const interval = setInterval(() => {
      setKey((prev) => prev + 1);
    }, AD_CONFIG.NATIVE_REFRESH_MS);
    return () => clearInterval(interval);
  }, [isConnected]);

  if (!isConnected) return null;

  return (
    <View style={styles.container} key={key}>
      <View style={styles.header}>
        <View style={styles.sponsoredBadge}>
          <Text style={styles.sponsoredText}>SPONSORED</Text>
        </View>
        <Ionicons
          name="information-circle-outline"
          size={16}
          color={COLORS.textMuted}
        />
      </View>
      <Text style={styles.title}>Mental Clarity</Text>
      <Text style={styles.body}>Try our new meditation app.</Text>
      <TouchableOpacity style={styles.cta}>
        <Text style={styles.ctaText}>LEARN MORE</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2A1B5E',
    borderRadius: 12,
    padding: 14,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(138, 79, 255, 0.3)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sponsoredBadge: {
    backgroundColor: 'rgba(138, 79, 255, 0.2)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  sponsoredText: {
    color: '#B388FF',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  body: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginBottom: 10,
  },
  cta: {
    backgroundColor: COLORS.textPrimary,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  ctaText: {
    color: '#0A0E1A',
    fontSize: 13,
    fontWeight: '700',
  },
});
