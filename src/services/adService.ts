import {
  InterstitialAd,
  RewardedAd,
  AdEventType,
  RewardedAdEventType,
  AppOpenAd,
} from 'react-native-google-mobile-ads';
import { AD_UNITS } from '../constants/adUnits';

class AdServiceClass {
  private interstitial: InterstitialAd | null = null;
  private rewarded: RewardedAd | null = null;
  private appOpen: AppOpenAd | null = null;

  // --- Interstitial ---
  loadInterstitial(): void {
    this.interstitial = InterstitialAd.createForAdRequest(AD_UNITS.INTERSTITIAL);
    this.interstitial.load();
  }

  showInterstitial(): Promise<boolean> {
    return new Promise((resolve) => {
      if (!this.interstitial) {
        this.loadInterstitial();
        resolve(false);
        return;
      }

      const unsubClose = this.interstitial.addAdEventListener(
        AdEventType.CLOSED,
        () => {
          unsubClose();
          this.loadInterstitial(); // Preload next
          resolve(true);
        }
      );

      const unsubError = this.interstitial.addAdEventListener(
        AdEventType.ERROR,
        () => {
          unsubError();
          this.loadInterstitial();
          resolve(false);
        }
      );

      try {
        this.interstitial.show();
      } catch {
        this.loadInterstitial();
        resolve(false);
      }
    });
  }

  // --- Rewarded ---
  loadRewarded(): void {
    this.rewarded = RewardedAd.createForAdRequest(AD_UNITS.REWARDED);
    this.rewarded.load();
  }

  showRewarded(): Promise<boolean> {
    return new Promise((resolve) => {
      if (!this.rewarded) {
        this.loadRewarded();
        resolve(false);
        return;
      }

      let rewarded = false;

      const unsubEarned = this.rewarded.addAdEventListener(
        RewardedAdEventType.EARNED_REWARD,
        () => {
          rewarded = true;
        }
      );

      const unsubClose = this.rewarded.addAdEventListener(
        AdEventType.CLOSED,
        () => {
          unsubEarned();
          unsubClose();
          this.loadRewarded(); // Preload next
          resolve(rewarded);
        }
      );

      const unsubError = this.rewarded.addAdEventListener(
        AdEventType.ERROR,
        () => {
          unsubEarned();
          unsubError();
          this.loadRewarded();
          resolve(false);
        }
      );

      try {
        this.rewarded.show();
      } catch {
        this.loadRewarded();
        resolve(false);
      }
    });
  }

  // --- App Open ---
  loadAppOpen(): void {
    this.appOpen = AppOpenAd.createForAdRequest(AD_UNITS.APP_OPEN);
    this.appOpen.load();
  }

  showAppOpen(): Promise<boolean> {
    return new Promise((resolve) => {
      if (!this.appOpen) {
        this.loadAppOpen();
        resolve(false);
        return;
      }

      const unsubClose = this.appOpen.addAdEventListener(
        AdEventType.CLOSED,
        () => {
          unsubClose();
          this.loadAppOpen();
          resolve(true);
        }
      );

      const unsubError = this.appOpen.addAdEventListener(
        AdEventType.ERROR,
        () => {
          unsubError();
          this.loadAppOpen();
          resolve(false);
        }
      );

      try {
        this.appOpen.show();
      } catch {
        this.loadAppOpen();
        resolve(false);
      }
    });
  }

  // Initialize - preload all ad types
  init(): void {
    this.loadInterstitial();
    this.loadRewarded();
    this.loadAppOpen();
  }
}

export const adService = new AdServiceClass();
