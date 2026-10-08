import { Attempt, Exercise, ItemState, Level, ProgressData, Unit } from './types';

export const PASS_MARK = 0.8;
const INTERVALS = [1, 3, 7, 16, 35];

export const emptyData = (): ProgressData => ({ schemaVersion: 1, topics: {}, attempts: [], items: {} });

export const normalize = (s: string) =>
  s.replace(/[’‘]/g, "'").trim().replace(/\s+/g, ' ').replace(/[.!?]+$/, '').toLowerCase();

export const isCorrect = (given: string, ex: Exercise) =>
  ex.accepted.some((a) => normalize(a) === normalize(given));

/** Weighted accuracy over the last 20 attempts; hinted attempts count half. */
export function mastery(attempts: Attempt[]): number {
  const last = attempts.slice(-20);
  let w = 0, s = 0;
  for (const a of last) { const k = a.hintsUsed > 0 ? 0.5 : 1; w += k; s += a.correct ? k : 0; }
  return w ? Math.round((100 * s) / w) : 0;
}

export function nextItem(prev: ItemState | undefined, correct: boolean, exerciseId: string, now = new Date()): ItemState {
  const prevIdx = prev ? INTERVALS.indexOf(prev.intervalDays) : -1;
  const idx = correct ? Math.min(prevIdx + 1, INTERVALS.length - 1) : 0;
  const due = new Date(now.getTime() + INTERVALS[idx] * 86400000);
  return { exerciseId, intervalDays: INTERVALS[idx], dueAt: due.toISOString(), lapses: (prev?.lapses ?? 0) + (correct ? 0 : 1) };
}

export function applyAttempt(d: ProgressData, a: Attempt): ProgressData {
  const attempts = [...d.attempts, a];
  const prev = d.topics[a.topicId];
  const topics = { ...d.topics, [a.topicId]: {
    topicId: a.topicId, status: prev?.status === 'completed' ? 'completed' as const : 'in_progress' as const,
    mastery: mastery(attempts.filter((x) => x.topicId === a.topicId)),
    checkpointBest: prev?.checkpointBest, lastStudiedAt: a.at } };
  return { ...d, attempts, topics, items: { ...d.items, [a.exerciseId]: nextItem(d.items[a.exerciseId], a.correct, a.exerciseId, new Date(a.at)) } };
}

export function applyCheckpoint(d: ProgressData, topicId: string, score: number): ProgressData {
  const prev = d.topics[topicId] ?? { topicId, status: 'in_progress' as const, mastery: 0 };
  const best = Math.max(prev.checkpointBest ?? 0, score);
  return { ...d, topics: { ...d.topics, [topicId]: { ...prev, checkpointBest: best,
    status: best >= PASS_MARK ? 'completed' : prev.status } } };
}

export function levelProgress(d: ProgressData, units: Unit[]): number {
  const ids = units.flatMap((u) => u.topicIds);
  if (!ids.length) return 0;
  return Math.round((100 * ids.filter((id) => d.topics[id]?.status === 'completed').length) / ids.length);
}

/** Exercise ids due for review, oldest first, capped so a session stays short. */
export const dueExerciseIds = (d: ProgressData, now = new Date(), limit = 20) =>
  dueItems(d, now).sort((a, b) => a.dueAt.localeCompare(b.dueAt)).slice(0, limit).map((i) => i.exerciseId);

export const dueItems = (d: ProgressData, now = new Date()) =>
  Object.values(d.items).filter((i) => new Date(i.dueAt) <= now);

// ---- Placement test scoring ----
export const PLACEMENT_PASS = 0.7;
const ORDER: Level[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
export interface PlacementResult { level: Level; perLevel: Partial<Record<Level, { correct: number; total: number }>> }

/** Recommended start = the first level scored below 70% (C2 if every level passed). */
export function scorePlacement(results: { level: Level; correct: boolean }[]): PlacementResult {
  const perLevel: PlacementResult['perLevel'] = {};
  for (const r of results) { const p = (perLevel[r.level] ??= { correct: 0, total: 0 }); p.total++; if (r.correct) p.correct++; }
  let level: Level = 'C2';
  for (const l of ORDER) { const p = perLevel[l]; if (!p || p.correct / p.total < PLACEMENT_PASS) { level = l; break; } }
  return { level, perLevel };
}

/** Topic to resume: the most recently studied unfinished topic, else the next unfinished one (from `startId` if given). */
export function continueTopicId(d: ProgressData, order: string[], startId?: string): string | undefined {
  const inProgress = Object.values(d.topics).filter((p) => p.status === 'in_progress' && p.lastStudiedAt)
    .sort((a, b) => b.lastStudiedAt!.localeCompare(a.lastStudiedAt!));
  if (inProgress.length) return inProgress[0].topicId;
  const open = (id: string) => d.topics[id]?.status !== 'completed';
  const from = startId ? Math.max(order.indexOf(startId), 0) : 0;
  return order.slice(from).find(open) ?? order.find(open);
}
