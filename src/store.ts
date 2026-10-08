import { create } from 'zustand';
import { ProgressData, Attempt, Level } from './domain/types';
import { applyAttempt, applyCheckpoint, emptyData } from './domain/logic';
import { AsyncStorageRepository, ProgressRepository } from './data/repository';

interface S {
  data: ProgressData; ready: boolean; error: string | null; repo: ProgressRepository;
  init(): Promise<void>; record(a: Attempt): Promise<void>; finishCheckpoint(topicId: string, score: number): Promise<void>; dismissError(): void; setPlacement(level: Level): Promise<void>;
}

export const useStore = create<S>((set, get) => {
  const commit = async (data: ProgressData) => {
    set({ data }); // keep progress in memory even if persistence fails
    try { await get().repo.save(data); set({ error: null }); }
    catch { set({ error: 'Progress could not be saved. It will retry on your next answer.' }); }
  };
  return {
    data: emptyData(), ready: false, error: null, repo: new AsyncStorageRepository(),
    init: async () => {
      try { set({ data: await get().repo.load(), ready: true }); }
      catch { set({ data: emptyData(), ready: true, error: 'Saved progress could not be read. Starting fresh.' }); }
    },
    record: (a) => commit(applyAttempt(get().data, a)),
    finishCheckpoint: (id, score) => commit(applyCheckpoint(get().data, id, score)),
    dismissError: () => set({ error: null }),
    setPlacement: (level) => commit({ ...get().data, placementLevel: level }),
  };
});
