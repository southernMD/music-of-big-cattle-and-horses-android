// utils/usePersistentStore.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState, useSyncExternalStore } from 'react';
import { TinyEmitter } from 'tiny-emitter';

const emitter = new TinyEmitter();
const memoryStore = new Map<string, any>();

function emitChange(key: string) {
  emitter.emit(key);
}

export async function setItem<T>(key: string, value: T): Promise<void> {
  memoryStore.set(key, value);
  await AsyncStorage.setItem(key, JSON.stringify(value));
  emitChange(key);
}

export async function getItem<T>(key: string): Promise<T | null> {
  if (memoryStore.has(key)) return memoryStore.get(key);
  const raw = await AsyncStorage.getItem(key);
  if (raw != null) {
    try {
      const parsed = JSON.parse(raw);
      memoryStore.set(key, parsed);
      return parsed;
    } catch {
      return null;
    }
  }
  return null;
}

export async function clearItem(key: string): Promise<void> {
  memoryStore.delete(key);
  await AsyncStorage.removeItem(key);
  emitChange(key);
}

export function usePersistentStore<T = any>(key: string, fallback?: T): T {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // 页面第一次挂载时加载 AsyncStorage
    getItem<T>(key).then((val) => {
      if (val !== null) {
        memoryStore.set(key, val);
      } else if (fallback !== undefined) {
        memoryStore.set(key, fallback);
        AsyncStorage.setItem(key, JSON.stringify(fallback)); // 主动写入 fallback
      }
      emitChange(key);
      setInitialized(true);
    });
  }, [key]);

  return useSyncExternalStore(
    (cb) => {
      emitter.on(key, cb);
      return () => emitter.off(key, cb);
    },
    () => {
      return memoryStore.get(key) ?? fallback;
    },
    () => fallback
  );
}