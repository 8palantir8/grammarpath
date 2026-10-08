import { normalize, isCorrect, mastery, nextItem, applyAttempt, applyCheckpoint, emptyData, levelProgress } from '../src/domain/logic';
import { EXERCISES, TOPICS, UNITS } from '../src/data/content';
import { Attempt } from '../src/domain/types';

const att = (correct: boolean, hintsUsed = 0): Attempt => ({ id: Math.random() + '', exerciseId: 'e', topicId: 't', given: '', correct, hintsUsed, ms: 1, at: new Date().toISOString() });

test('normalize handles case, spaces, punctuation, curly apostrophes', () => expect(normalize("  Isn’t  It. ")).toBe("isn't it"));
test('isCorrect accepts alternatives', () => expect(isCorrect('IS NOT', { accepted: ["isn't", 'is not'] } as any)).toBe(true));
test('mastery weights hinted attempts half', () => expect(mastery([att(true), att(false, 1)])).toBe(67));
test('SRS grows on success and resets on failure', () => {
  const a = nextItem(undefined, true, 'e'); const b = nextItem(a, true, 'e'); const c = nextItem(b, false, 'e');
  expect([a.intervalDays, b.intervalDays, c.intervalDays, c.lapses]).toEqual([1, 3, 1, 1]);
});
test('checkpoint at 80% completes a topic', () => {
  let d = applyAttempt(emptyData(), att(true)); expect(d.topics.t.status).toBe('in_progress');
  d = applyCheckpoint(d, 't', 0.8); expect(d.topics.t.status).toBe('completed');
  expect(applyCheckpoint(d, 't', 0.3).topics.t.checkpointBest).toBe(0.8);
});
test('level progress counts completed topics', () => {
  const d = applyCheckpoint(emptyData(), 'a1-be-aff', 1);
  expect(levelProgress(d, UNITS.filter((u) => u.level === 'A1'))).toBe(10);
});
test('content integrity', () => {
  const ids = EXERCISES.map((e) => e.id); expect(new Set(ids).size).toBe(ids.length);
  for (const e of EXERCISES) { expect(TOPICS.some((t) => t.id === e.topicId)).toBe(true); expect(e.accepted.length).toBeGreaterThan(0); expect(e.explanation).toBeTruthy(); }
});

import { normalize as n } from '../src/domain/logic';
import { exercisesFor } from '../src/data/content';
test('choice exercises include their correct answer among the options', () => {
  for (const e of EXERCISES.filter((x) => x.type === 'mcq' || x.type === 'error')) {
    expect(e.options && e.options.length >= 2).toBe(true);
    expect(e.options!.some((o) => e.accepted.some((a) => n(a) === n(o)))).toBe(true);
  }
});
test('every authored topic is in a unit and has 3 practice + 3 checkpoint items', () => {
  const inUnits = UNITS.flatMap((u) => u.topicIds);
  for (const t of TOPICS) {
    expect(inUnits).toContain(t.id);
    expect(exercisesFor(t.id, 'practice').length).toBeGreaterThanOrEqual(3);
    expect(exercisesFor(t.id, 'checkpoint')).toHaveLength(3);
  }
  for (const id of inUnits) expect(TOPICS.some((t) => t.id === id)).toBe(true);
});

test('order exercises are solvable: tiles match every accepted sentence', () => {
  const orders = EXERCISES.filter((x) => x.type === 'order'); expect(orders.length).toBeGreaterThan(10);
  for (const e of orders) for (const a of e.accepted) {
    const tiles = e.options!.map(n).sort().join('|'); const words = n(a).split(' ').sort().join('|');
    expect(tiles).toBe(words);
    expect(e.options!.join(' ')).not.toBe(n(e.accepted[0])); // not pre-solved
  }
});
test('transform exercises accept their own answers and have no options', () => {
  const trs = EXERCISES.filter((x) => x.type === 'transform'); expect(trs.length).toBeGreaterThan(10);
  for (const e of trs) { expect(e.options).toBeUndefined(); for (const a of e.accepted) expect(isCorrect(a + '.', e)).toBe(true); }
});

import { dueExerciseIds, dueItems } from '../src/domain/logic';
import { exercisesByIds } from '../src/data/content';
const item = (id: string, dueAt: string) => ({ exerciseId: id, intervalDays: 1, dueAt, lapses: 0 });
test('review queue returns only due items, oldest first, capped', () => {
  const now = new Date('2026-01-10T00:00:00Z');
  const d = { ...emptyData(), items: { a: item('a', '2026-01-09T00:00:00Z'), b: item('b', '2026-01-05T00:00:00Z'), c: item('c', '2026-02-01T00:00:00Z') } };
  expect(dueExerciseIds(d, now)).toEqual(['b', 'a']);
  expect(dueExerciseIds(d, now, 1)).toEqual(['b']);
});
test('exercisesByIds skips unknown ids', () => expect(exercisesByIds(['a1-be-aff-1', 'nope']).map((e) => e.id)).toEqual(['a1-be-aff-1']));
test('a missed answer becomes due the next day and drops out once reviewed correctly', () => {
  const t0 = new Date('2026-03-01T10:00:00Z');
  let d = applyAttempt(emptyData(), { ...att(false), exerciseId: 'x1', at: t0.toISOString() });
  expect(dueItems(d, new Date(t0.getTime() + 3600000))).toHaveLength(0);
  const t1 = new Date(t0.getTime() + 2 * 86400000);
  expect(dueExerciseIds(d, t1)).toEqual(['x1']);
  d = applyAttempt(d, { ...att(true), exerciseId: 'x1', at: t1.toISOString() });
  expect(dueExerciseIds(d, t1)).toEqual([]);
  expect(d.items.x1.intervalDays).toBe(3);
});

import { scorePlacement } from '../src/domain/logic';
import { buildPlacementTest, levelOfExercise, LEVELS } from '../src/data/content';
const block = (level: any, correct: number, total = 4) => Array.from({ length: total }, (_, k) => ({ level, correct: k < correct }));
test('placement test has 4 unique items per level in A1-C2 order', () => {
  const t = buildPlacementTest(); expect(t).toHaveLength(24);
  expect(new Set(t.map((e) => e.id)).size).toBe(24);
  expect(t.map((e) => levelOfExercise(e))).toEqual(LEVELS.flatMap((l) => [l, l, l, l]));
});
test('placement scoring: first level under 70% is the recommended start', () => {
  expect(scorePlacement([...block('A1', 4), ...block('A2', 3), ...block('B1', 2)]).level).toBe('B1');
  expect(scorePlacement(block('A1', 2)).level).toBe('A1');
  expect(scorePlacement(LEVELS.flatMap((l) => block(l, 4))).level).toBe('C2');
  expect(scorePlacement([...block('A1', 4), ...block('A2', 4), ...block('B1', 4), ...block('B2', 4), ...block('C1', 1)]).level).toBe('C1');
});

import { continueTopicId } from '../src/domain/logic';
test('continue picks the latest in-progress topic, else the next unfinished one', () => {
  const order = ['t1', 't2', 't3'];
  expect(continueTopicId(emptyData(), order)).toBe('t1');
  expect(continueTopicId(emptyData(), order, 't3')).toBe('t3');
  let d = applyCheckpoint(emptyData(), 't1', 1); // completed
  expect(continueTopicId(d, order)).toBe('t2');
  d = applyAttempt(d, { ...att(true), topicId: 't3', at: '2026-01-02T00:00:00Z' });
  d = applyAttempt(d, { ...att(true), topicId: 't2', at: '2026-01-01T00:00:00Z' });
  expect(continueTopicId(d, order)).toBe('t3');
});
