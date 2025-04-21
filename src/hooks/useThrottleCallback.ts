import { useRef, useCallback } from 'react';

export function useThrottleCallback<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): T {
  const lastCalled = useRef(0);

  const throttledFn = useCallback((...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCalled.current >= delay) {
      lastCalled.current = now;
      callback(...args);
    }
  }, [callback, delay]);

  return throttledFn as T;
}
