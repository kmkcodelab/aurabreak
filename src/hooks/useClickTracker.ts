import { useRef, useCallback } from 'react';
import { AD_CONFIG } from '../constants/adConfig';
import { storageService } from '../services/StorageService';

export function useClickTracker() {
  const clickCount = useRef(0);
  const sessionStart = useRef(Date.now());
  const hasShownTimeAd = useRef(false);

  const initialize = useCallback(async () => {
    clickCount.current = await storageService.getClickCount();
    sessionStart.current = await storageService.getSessionStart();
    hasShownTimeAd.current = await storageService.getHasShownTimeAd();
  }, []);

  const trackClick = useCallback(async (): Promise<{
    shouldShowInterstitial: boolean;
    reason: 'click' | 'time' | null;
  }> => {
    clickCount.current += 1;
    await storageService.saveClickCount(clickCount.current);

    // Check click-based trigger
    if (clickCount.current % AD_CONFIG.INTERSTITIAL_CLICK_INTERVAL === 0) {
      return { shouldShowInterstitial: true, reason: 'click' };
    }

    // Check time-based trigger (first click after 5 min)
    if (!hasShownTimeAd.current) {
      const elapsed = Date.now() - sessionStart.current;
      if (elapsed >= AD_CONFIG.INTERSTITIAL_TIME_TRIGGER_MS) {
        hasShownTimeAd.current = true;
        await storageService.saveHasShownTimeAd(true);
        return { shouldShowInterstitial: true, reason: 'time' };
      }
    }

    return { shouldShowInterstitial: false, reason: null };
  }, []);

  const resetSession = useCallback(async () => {
    sessionStart.current = Date.now();
    hasShownTimeAd.current = false;
    await storageService.saveSessionStart(sessionStart.current);
    await storageService.saveHasShownTimeAd(false);
  }, []);

  return { initialize, trackClick, resetSession };
}
