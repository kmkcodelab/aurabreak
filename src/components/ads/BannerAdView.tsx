import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { AD_CONFIG } from '../../constants/adConfig';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';

interface Props {
  style?: object;
}

export function BannerAdView({ style }: Props) {
  const isConnected = useNetworkStatus();
  const [key, setKey] = useState(0);

  // Auto-reload every 10s
  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      setKey((prev) => prev + 1);
    }, AD_CONFIG.BANNER_REFRESH_MS);

    return () => clearInterval(interval);
  }, [isConnected]);

  if (!isConnected) return null;

  return (
    <View style={[styles.container, style]}>
      <BannerAd
        key={key}
        unitId={AD_CONFIG.BANNER}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: false }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    overflow: 'hidden',
  },
});
