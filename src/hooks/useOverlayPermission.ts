import { useState, useCallback, useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { overlayService } from '../services/OverlayService';

export function useOverlayPermission() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [showModal, setShowModal] = useState(false);

  const checkPermission = useCallback(async () => {
    const granted = await overlayService.checkPermission();
    setHasPermission(granted);
    return granted;
  }, []);

  useEffect(() => {
    checkPermission();

    const subscription = AppState.addEventListener(
      'change',
      (state: AppStateStatus) => {
        if (state === 'active') {
          checkPermission();
        }
      }
    );

    return () => subscription.remove();
  }, [checkPermission]);

  const requestPermission = useCallback(async () => {
    await overlayService.requestPermission();
  }, []);

  const promptIfNeeded = useCallback(async (): Promise<boolean> => {
    const granted = await checkPermission();
    if (!granted) {
      setShowModal(true);
      return false;
    }
    return true;
  }, [checkPermission]);

  return {
    hasPermission,
    showModal,
    setShowModal,
    checkPermission,
    requestPermission,
    promptIfNeeded,
  };
}
