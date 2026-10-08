import React, { useState } from 'react';
import { View, Text, Pressable, TextInput, ScrollView, StyleSheet } from 'react-native';
import { LEVELS, UNITS, TOPICS, exercisesFor, exercisesByIds, buildPlacementTest, levelOfExercise } from './data/content';
import { Level } from './domain/types';
import { useStore } from './store';
import { isCorrect, levelProgress, PASS_MARK, PLACEMENT_PASS, dueExerciseIds, scorePlacement, continueTopicId } from './domain/logic';

const Btn = ({ label, onPress, disabled }: { label: string; onPress: () => void; disabled?: boolean }) => (
  <Pressable accessibilityRole="button" accessibilityLabel={label} disabled={disabled} onPress={onPress}
    style={[s.btn, disabled && { opacity: 0.4 }]}><Text style={s.btnText}>{label}</Text></Pressable>
);
const Bar = ({ pct }: { pct: number }) => (<View style={s.barBg}><View style={[s.barFg, { width: `${pct}%` }]} /></View>);

export function Banner() {
  const { error, dismissError } = useStore();
  return error ? <Pressable onPress={dismissError} style={s.banner}><Text>{error} (tap to dismiss)</Text></Pressable> : null;
}

const ALL_TOPIC_IDS = UNITS.flatMap((u) => u.topicIds);

export function Home({ navigation }: any) {
  const data = useStore((x) => x.data); const due = dueExerciseIds(data).length;
  const start = UNITS.find((u) => u.level === data.placementLevel && u.topicIds.length)?.topicIds[0];
  const t = TOPICS.find((x) => x.id === continueTopicId(data, ALL_TOPIC_IDS, start));
  return (<ScrollView contentContainerStyle={s.pad}><Banner />
    {t && <Pressable style={s.card} accessibilityRole="button" onPress={() => navigation.navigate('Topic', { topicId: t.id })}>
      <Text style={s.h2}>Continue</Text><Text>{t.title}</Text><Text>{data.topics[t.id] ? `${data.topics[t.id].mastery}% mastery` : 'Not started'}</Text></Pressable>}
    <Pressable style={s.card} accessibilityRole="button" onPress={() => navigation.navigate('Review')}>
      <Text style={s.h2}>Review</Text><Text>{due ? `${due} exercise${due === 1 ? '' : 's'} due today` : 'Nothing due. Come back tomorrow.'}</Text></Pressable>
    <Pressable style={s.card} accessibilityRole="button" onPress={() => navigation.navigate('Session', { mode: 'placement' })}>
      <Text style={s.h2}>{data.placementLevel ? `Recommended level: ${data.placementLevel}` : 'Not sure where to start?'}</Text>
      <Text>{data.placementLevel ? 'Retake the placement test' : 'Take the placement test (about 10 minutes)'}</Text></Pressable>
  </ScrollView>);
}

export function PathScreen({ navigation }: any) {
  const data = useStore((x) => x.data);
  return (<ScrollView contentContainerStyle={s.pad}>
    {LEVELS.map((l) => { const p = levelProgress(data, UNITS.filter((x) => x.level === l));
      return (<Pressable key={l} style={s.card} accessibilityRole="button" onPress={() => navigation.navigate('Level', { level: l })}>
        <Text style={s.h2}>{p === 100 ? '● ' : p > 0 ? '◐ ' : '○ '}{l}{data.placementLevel === l ? '  (start here)' : ''}</Text><Bar pct={p} /><Text>{p}% complete</Text></Pressable>); })}
  </ScrollView>);
}

export function ReviewScreen({ navigation }: any) {
  const data = useStore((x) => x.data); const ids = dueExerciseIds(data, new Date(), 1000); const n = Math.min(ids.length, 20);
  const byTopic: Record<string, number> = {};
  for (const e of exercisesByIds(ids)) byTopic[e.topicId] = (byTopic[e.topicId] ?? 0) + 1;
  return (<ScrollView contentContainerStyle={s.pad}><Text style={s.h1}>{ids.length ? `${ids.length} due` : 'All caught up'}</Text>
    {!ids.length && <Text>Answered exercises come back here at spaced intervals. Practise a topic to build your review queue.</Text>}
    {Object.entries(byTopic).map(([id, c]) => (<View key={id} style={s.row}><Text>{TOPICS.find((t) => t.id === id)?.title ?? id}</Text><Text>{c}</Text></View>))}
    <Btn label={`Start review (${n})`} disabled={!n} onPress={() => navigation.navigate('Session', { mode: 'review' })} /></ScrollView>);
}

export function LevelScreen({ route, navigation }: any) {
  const data = useStore((x) => x.data); const us = UNITS.filter((u) => u.level === route.params.level);
  return (<ScrollView contentContainerStyle={s.pad}>
    {!us.length && <Text>Content for this level is coming soon.</Text>}
    {us.map((u) => (<View key={u.id} style={s.card}><Text style={s.h2}>{u.title}</Text>
      {!u.topicIds.length && <Text>Content coming soon</Text>}
      {u.topicIds.map((id) => { const t = TOPICS.find((x) => x.id === id)!; const p = data.topics[id];
        return (<Pressable key={id} onPress={() => navigation.navigate('Topic', { topicId: id })} style={s.row}>
          <Text>{p?.status === 'completed' ? '✔ ' : p ? '◐ ' : '○ '}{t.title}</Text><Text>{p ? `${p.mastery}%` : ''}</Text></Pressable>); })}
    </View>))}</ScrollView>);
}

export function TopicScreen({ route, navigation }: any) {
  const t = TOPICS.find((x) => x.id === route.params.topicId);
  if (!t) return <Text style={s.pad}>Topic not found.</Text>;
  return (<ScrollView contentContainerStyle={s.pad}><Text style={s.h1}>{t.title}</Text>
    <Text style={s.h2}>Form</Text><Text>{t.form}</Text><Text style={s.h2}>Use</Text><Text>{t.use}</Text>
    <Text style={s.h2}>Examples</Text>{t.examples.map((e) => <Text key={e}>• {e}</Text>)}
    <Text style={s.h2}>Common mistakes</Text>{t.mistakes.map((e) => <Text key={e}>⚠ {e}</Text>)}
    <Btn label="Start practice" onPress={() => navigation.navigate('Session', { topicId: t.id, mode: 'practice' })} />
    <Btn label="Take checkpoint" onPress={() => navigation.navigate('Session', { topicId: t.id, mode: 'checkpoint' })} /></ScrollView>);
}

export function SessionScreen({ route, navigation }: any) {
  const { topicId, mode } = route.params; const { record, finishCheckpoint, setPlacement } = useStore();
  const [queue] = useState(() => (mode === 'placement' ? buildPlacementTest() : mode === 'review' ? exercisesByIds(dueExerciseIds(useStore.getState().data)) : exercisesFor(topicId, mode)));
  const [i, setI] = useState(0); const [input, setInput] = useState(''); const [hint, setHint] = useState(false); const [picked, setPicked] = useState<number[]>([]); const [results, setResults] = useState<{ level: Level; correct: boolean }[]>([]);
  const [res, setRes] = useState<null | boolean>(null); const [score, setScore] = useState(0); const [t0, setT0] = useState(Date.now());
  const ex = queue[i];
  const answer = ex?.type === 'order' ? picked.map((k) => ex.options![k]).join(' ') : input;
  if (!queue.length) return <Text style={s.pad}>{mode === 'review' ? 'Nothing is due for review right now.' : 'No exercises available for this topic.'}</Text>;
  if (!ex && mode === 'placement') { const r = scorePlacement(results); return (<ScrollView contentContainerStyle={s.pad}>
    <Text style={s.h1}>Start at {r.level}</Text><Text>Levels below this scored 70% or more in the placement test.</Text>
    {LEVELS.filter((l) => r.perLevel[l]).map((l) => <Text key={l}>{l}: {r.perLevel[l]!.correct}/{r.perLevel[l]!.total}</Text>)}
    <Btn label={`Go to ${r.level}`} onPress={async () => { await setPlacement(r.level); navigation.replace('Level', { level: r.level }); }} /></ScrollView>); }
  if (!ex) { const pct = score / queue.length; return (<View style={s.pad}><Text style={s.h1}>{Math.round(pct * 100)}%</Text>
    <Text>{mode === 'checkpoint' ? (pct >= PASS_MARK ? 'Checkpoint passed!' : 'Not yet. Review the rule and try again.') : mode === 'review' ? 'Review complete. Missed items return tomorrow.' : 'Practice complete.'}</Text>
    <Btn label="Done" onPress={() => navigation.goBack()} /></View>); }
  const placementStep = (ok: boolean) => {
    const lv = levelOfExercise(ex)!; const nr = [...results, { level: lv, correct: ok }]; setResults(nr);
    const nxt = queue[i + 1]; const block = nr.filter((r) => r.level === lv);
    const levelDone = !nxt || levelOfExercise(nxt) !== lv;
    const failed = levelDone && block.filter((r) => r.correct).length / block.length < PLACEMENT_PASS;
    setPicked([]); setInput(''); setT0(Date.now());
    setI(!nxt || failed ? queue.length : i + 1);
  };
  const check = async () => {
    const ok = isCorrect(answer, ex);
    if (mode === 'placement') return placementStep(ok);
    setRes(ok); if (ok) setScore((x) => x + 1);
    await record({ id: `${ex.id}-${Date.now()}`, exerciseId: ex.id, topicId: ex.topicId, given: answer, correct: ok, hintsUsed: hint ? 1 : 0, ms: Date.now() - t0, at: new Date().toISOString() });
  };
  const next = async () => {
    if (i + 1 === queue.length && mode === 'checkpoint') await finishCheckpoint(topicId, score / queue.length);
    setI(i + 1); setPicked([]); setInput(''); setRes(null); setHint(false); setT0(Date.now());
  };
  return (<ScrollView contentContainerStyle={s.pad}><Banner /><Bar pct={(i / queue.length) * 100} />
    <Text>{mode === 'placement' ? `Placement test · ${levelOfExercise(ex)}` : `${mode === 'checkpoint' ? 'Checkpoint' : mode === 'review' ? 'Review' : 'Practice'} · ${i + 1}/${queue.length}`}</Text>
    <Text style={s.h2}>{ex.prompt}</Text>
    {ex.type === 'order' ? (<View style={{ gap: 10 }}>
        <View style={s.answerBox}>{picked.map((k, n) => (<Pressable key={n} disabled={res !== null} accessibilityLabel={`Remove ${ex.options![k]}`} onPress={() => setPicked(picked.filter((_, m) => m !== n))} style={s.tile}><Text>{ex.options![k]}</Text></Pressable>))}</View>
        <View style={s.tiles}>{ex.options!.map((w, k) => (<Pressable key={k} disabled={res !== null || picked.includes(k)} accessibilityLabel={`Add ${w}`} onPress={() => setPicked([...picked, k])} style={[s.tile, picked.includes(k) && { opacity: 0.25 }]}><Text>{w}</Text></Pressable>))}</View></View>)
      : ex.type === 'fill' || ex.type === 'transform' ? <TextInput style={[s.input, ex.type === 'transform' && { minHeight: 80 }]} multiline={ex.type === 'transform'} value={input} onChangeText={setInput} editable={res === null} autoCapitalize="none" autoCorrect={false} accessibilityLabel="Your answer" />
      : ex.options!.map((o) => (<Pressable key={o} disabled={res !== null} onPress={() => setInput(o)}
        style={[s.opt, input === o && s.optSel]}><Text>{o}</Text></Pressable>))}
    {res === null && mode === 'practice' && !hint && <Btn label="Hint" onPress={() => setHint(true)} />}
    {hint && res === null && <Text>💡 {TOPICS.find((t) => t.id === topicId)!.form}</Text>}
    {res === null ? <Btn label={mode === 'placement' ? 'Next' : 'Check'} disabled={ex.type === 'order' ? picked.length !== ex.options!.length : !answer.trim()} onPress={check} /> : (<>
      <Text style={[s.h2, { color: res ? '#157f3b' : '#b3261e' }]}>{res ? '✔ Correct' : `✖ Not quite. Answer: ${ex.accepted[0]}`}</Text>
      <Text>{ex.explanation}</Text><Btn label={i + 1 === queue.length ? 'Finish' : 'Next'} onPress={next} /></>)}
  </ScrollView>);
}

export function ProgressScreen() {
  const data = useStore((x) => x.data);
  const weak = Object.values(data.topics).filter((p) => p.status !== 'completed' || p.mastery < 70).sort((a, b) => a.mastery - b.mastery);
  return (<ScrollView contentContainerStyle={s.pad}><Text style={s.h1}>Progress</Text><Text>Due for review: {dueExerciseIds(data).length}</Text>
    {LEVELS.map((l) => <View key={l} style={s.card}><Text style={s.h2}>{l}: {levelProgress(data, UNITS.filter((u) => u.level === l))}%</Text></View>)}
    <Text style={s.h2}>Weak spots</Text>{!weak.length && <Text>None yet. Keep practising!</Text>}
    {weak.map((p) => <Text key={p.topicId}>• {TOPICS.find((t) => t.id === p.topicId)?.title}: {p.mastery}%</Text>)}</ScrollView>);
}

const s = StyleSheet.create({
  pad: { padding: 16, gap: 10 }, h1: { fontSize: 26, fontWeight: '700' }, h2: { fontSize: 18, fontWeight: '600', marginTop: 6 },
  card: { padding: 14, borderRadius: 12, backgroundColor: '#f2f4f8', gap: 6 }, row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, minHeight: 44 },
  btn: { backgroundColor: '#2f5bea', padding: 14, borderRadius: 10, alignItems: 'center', minHeight: 44 }, btnText: { color: '#fff', fontWeight: '600' },
  barBg: { height: 8, backgroundColor: '#d8dce6', borderRadius: 4 }, barFg: { height: 8, backgroundColor: '#2f5bea', borderRadius: 4 },
  input: { borderWidth: 1, borderColor: '#aaa', borderRadius: 8, padding: 12, fontSize: 16 },
  opt: { padding: 14, borderWidth: 1, borderColor: '#aaa', borderRadius: 10, minHeight: 44 }, optSel: { borderColor: '#2f5bea', backgroundColor: '#e6ecff' },
  answerBox: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, minHeight: 56, padding: 8, borderWidth: 1, borderColor: '#aaa', borderRadius: 10 },
  tiles: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tile: { paddingVertical: 10, paddingHorizontal: 12, backgroundColor: '#e6ecff', borderRadius: 8, minHeight: 44, justifyContent: 'center' },
  banner: { backgroundColor: '#ffe9b3', padding: 10, borderRadius: 8 },
});
