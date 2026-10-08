import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProgressData } from '../domain/types';
import { emptyData } from '../domain/logic';

export class StorageError extends Error {}

/** Storage-agnostic port: swap in SQLite or a cloud backend without touching the app. */
export interface ProgressRepository { load(): Promise<ProgressData>; save(d: ProgressData): Promise<void> }

const KEY = 'grammarpath:progress:v1';

export class AsyncStorageRepository implements ProgressRepository {
  async load() {
    try {
      const raw = await AsyncStorage.getItem(KEY);
      if (!raw) return emptyData();
      const p = JSON.parse(raw);
      if (p?.schemaVersion !== 1 || typeof p.topics !== 'object' || !Array.isArray(p.attempts)) throw new Error('bad shape');
      return p as ProgressData;
    } catch (e) { throw new StorageError('Saved progress unreadable'); }
  }
  async save(d: ProgressData) {
    try { await AsyncStorage.setItem(KEY, JSON.stringify(d)); }
    catch { throw new StorageError('Could not save progress'); }
  }
}

export class MemoryRepository implements ProgressRepository {
  constructor(private d: ProgressData = emptyData()) {}
  async load() { return this.d; }
  async save(d: ProgressData) { this.d = d; }
}
