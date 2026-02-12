import { useState, useCallback, useRef, useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import {
  InterstitialAd,
  RewardedAd,
  AppOpenAd,
  AdEventType,
  RewardedAdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';
import { AD_CONFIG } from '../constants/adConfig';
import { storageService } from '../services/StorageService';
import { useNetworkStatus } from './useNetworkStatus';

export function useAdManager() {
  const isConnected = useNetworkStatus();
  const [interstitialLoaded, setInterstitialLoaded] = useState(false);
  const [rewardedLoaded, setRewardedLoaded] = useState(false);
  const [appOpenLoaded, setAppOpenLoaded] = useState(false);

  const interstitialRef = useRef<InterstitialAd | null>(null);
  const rewardedRef = useRef<RewardedAd | null>(null);
  const appOpenRef = useRef<AppOpenAd | null>(null);

  // Load Interstitial
  const loadInterstitial = useCallback(() => {
    if (!isConnected) return;

    const ad = InterstitialAd.createForAdRequest(AD_CONFIG.INTERSTITIAL);
    const unsubLoaded = ad.addAdEventListener(AdEventType.LOADED, () => {
      setInterstitialLoaded(true);
    });
    const unsubClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
      setInterstitialLoaded(false);
      loadInterstitial();
    });

    interstitialRef.current = ad;
    ad.load();

    return () => {
      unsubLoaded();
      unsubClosed();
    };
  }, [isConnected]);

  // Load Rewarded
  const loadRewarded = useCallback(() => {
    if (!isConnected) return;

    const ad = RewardedAd.createForAdRequest(AD_CONFIG.REWARDED);
    const unsubLoaded = ad.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        setRewardedLoaded(true);
      }
    );
    const unsubEarned = ad.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      () => {
        // Reward handled by caller
      }
    );
    const unsubClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
      setRewardedLoaded(false);
      loadRewarded();
    });

    rewardedRef.current = ad;
    ad.load();

    return () => {
      unsubLoaded();
      unsubEarned();
      unsubClosed();
    };
  }, [isConnected]);

  // Load App Open
  const loadAppOpen = useCallback(() => {
    if (!isConnected) return;

    const ad = AppOpenAd.createForAdRequest(AD_CONFIG.APP_OPEN);
    const unsubLoaded = ad.addAdEventListener(AdEventType.LOADED, () => {
      setAppOpenLoaded(true);
    });
    const unsubClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
      setAppOpenLoaded(false);
      loadAppOpen();
    });

    appOpenRef.current = ad;
    ad.load();

    return () => {
      unsubLoaded();
      unsubClosed();
    };
  }, [isConnected]);

  // Show Interstitial
  const showInterstitial = useCallback((): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!interstitialLoaded || !interstitialRef.current || !isConnected) {
        resolve(false);
        return;
      }
      try {
        interstitialRef.current.show();
        resolve(true);
      } catch {
        resolve(false);
      }
    });
  }, [interstitialLoaded, isConnected]);

  // Show Rewarded
  const showRewarded = useCallback((): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!isConnected) {
        Alert.alert(
          'No Internet',
          'Please turn on the internet to unlock slots.',
          [{ text: 'OK' }]
        );
        resolve(false);
        return;
      }

      if (!rewardedLoaded || !rewardedRef.current) {
        resolve(false);
        return;
      }

      const unsubEarned = rewardedRef.current.addAdEventListener(
        RewardedAdEventType.EARNED_REWARD,
        () => {
          unsubEarned();
          resolve(true);
        }
      );

      const unsubClosed = rewardedRef.current.addAdEventListener(
        AdEventType.CLOSED,
        () => {
          unsubClosed();
          // If closed without earning, resolve false
        }
      );

      try {
        rewardedRef.current.show();
      } catch {
        resolve(false);
      }
    });
  }, [rewardedLoaded, isConnected]);

  // Show App Open
  const showAppOpen = useCallback(async (): Promise<boolean> => {
    const isFirst = await storageService.isFirstLaunch();
    if (isFirst) {
      await storageService.markFirstLaunchDone();
      return false;
    }

    if (!isConnected || !appOpenLoaded || !appOpenRef.current) return false;

    try {
      appOpenRef.current.show();
      return true;
    } catch {
      return false;
    }
  }, [appOpenLoaded, isConnected]);

  // Initialize all ads
  const initializeAds = useCallback(() => {
    loadInterstitial();
    loadRewarded();
    loadAppOpen();
  }, [loadInterstitial, loadRewarded, loadAppOpen]);

  return {
    initializeAds,
    showInterstitial,
    showRewarded,
    showAppOpen,
    loadInterstitial,
    loadRewarded,
    isConnected,
  };
}
