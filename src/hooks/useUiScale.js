import { useCallback, useEffect, useState } from 'react';
import {
  DEFAULT_UI_SCALE,
  getUiScale,
  MAX_UI_SCALE,
  MIN_UI_SCALE,
  resetUiScale,
  setUiScale,
  UI_SCALE_CHANGE_EVENT,
} from '@/lib/ui-scale';

export function useUiScale() {
  const [scale, setScaleState] = useState(getUiScale);

  useEffect(() => {
    const handleChange = (event) => {
      setScaleState(event.detail ?? getUiScale());
    };

    window.addEventListener(UI_SCALE_CHANGE_EVENT, handleChange);
    return () => window.removeEventListener(UI_SCALE_CHANGE_EVENT, handleChange);
  }, []);

  const updateScale = useCallback((value) => {
    setScaleState(setUiScale(value));
  }, []);

  const restoreDefault = useCallback(() => {
    setScaleState(resetUiScale());
  }, []);

  return {
    scale,
    setScale: updateScale,
    resetScale: restoreDefault,
    minScale: MIN_UI_SCALE,
    maxScale: MAX_UI_SCALE,
    defaultScale: DEFAULT_UI_SCALE,
  };
}
