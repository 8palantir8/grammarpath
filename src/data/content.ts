import { Exercise, Level, Topic, Unit } from '../domain/types';

export const LEVELS: Level[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const L = (level: Level, titles: string[], ids: Record<number, string[]> = {}): Unit[] =>
  titles.map((title, i) => ({ id: `${level.toLowerCase()}-u${i + 1}`, level, title, topicIds: ids[i + 1] ?? [] }));
// Full CEFR unit map. A1 is fully authored; A2-C2 units are listed and marked "coming soon".
export const UNITS: Unit[] = [
  ...L('A1', ['Be', 'Pronouns and determiners', 'Nouns', 'Present simple', 'Sentence basics', 'Have got / can', 'Prepositions', 'Present continuous', 'Quantity and adverbs'],
    { 1: ['a1-be-aff', 'a1-be-q'], 2: ['a1-pron'], 3: ['a1-plural'], 4: ['a1-ps-3s'], 5: ['a1-wh'], 6: ['a1-can'], 7: ['a1-prep'], 8: ['a1-pc'], 9: ['a1-quant'] }),
  ...L('A2', ['Past simple', 'Past continuous', 'Future forms', 'Comparison', 'Modals 1', 'Present perfect 1', 'Quantifiers and articles', 'Basic clauses', 'Pronouns and phrases'],
    { 1: ['a2-past'], 2: ['a2-pastcont'], 3: ['a2-future'], 4: ['a2-comp'], 5: ['a2-modal'], 6: ['a2-pp1'], 7: ['a2-art'], 8: ['a2-clauses'], 9: ['a2-pronphr'] }),
  ...L('B1', ['Present perfect 2', 'Past perfect', 'Conditionals', 'Passive voice 1', 'Reported speech', 'Relative clauses', 'Modals 2', 'Verb patterns', 'Question forms', 'Linking and quantity'],
    { 1: ['b1-ppc'], 2: ['b1-pastperf'], 3: ['b1-cond'], 4: ['b1-passive'], 5: ['b1-reported'], 6: ['b1-relative'], 7: ['b1-modal2'], 8: ['b1-patterns'], 9: ['b1-qforms'], 10: ['b1-link'] }),
  ...L('B2', ['Narrative and perfect tenses', 'Conditionals 2', 'Passive voice 2', 'Reported speech 2', 'Relative clauses 2', 'Modals 3', 'Articles and determiners 2', 'Comparison 2', 'Participle clauses', 'Emphasis and linking', 'Phrasal and prepositional verbs'],
    { 1: ['b2-tenses'], 2: ['b2-cond2'], 3: ['b2-passive2'], 4: ['b2-reported2'], 5: ['b2-relative2'], 6: ['b2-modal3'], 7: ['b2-articles2'], 8: ['b2-comp2'], 9: ['b2-participle'], 10: ['b2-emphasis'], 11: ['b2-phrasal'] }),
  ...L('C1', ['Inversion 1', 'Advanced conditionals', 'Subjunctive 1', 'Advanced modality', 'Cleft and focus', 'Advanced passives', 'Complex noun phrases', 'Ellipsis and substitution', 'Discourse markers', 'Complex verb complementation'],
    { 1: ['c1-inv'], 2: ['c1-cond'], 3: ['c1-subj'], 4: ['c1-modal'], 5: ['c1-cleft'], 6: ['c1-passive'], 7: ['c1-np'], 8: ['c1-ellipsis'], 9: ['c1-discourse'], 10: ['c1-compl'] }),
  ...L('C2', ['Inversion 2', 'Fronting and information structure', 'Subjunctive 2', 'Advanced conditional nuance', 'Complex clause structures', 'Register and style', 'Aspect and tense nuance', 'Advanced modality and stance', 'Ambiguity, punctuation and exceptions'],
    { 1: ['c2-inv2'], 2: ['c2-front'], 3: ['c2-subj2'], 4: ['c2-cond'], 5: ['c2-clause'], 6: ['c2-register'], 7: ['c2-aspect'], 8: ['c2-stance'], 9: ['c2-ambig'] }),
];

export const TOPICS: Topic[] = [
  { id: 'a1-be-aff', unitId: 'a1-u1', title: 'To be: affirmative and negative',
    form: 'I am, you are, he/she/it is, we/they are. Negative: add "not" (is not = isn\'t).',
    use: 'Use "be" to describe identity, age, feelings and states.',
    examples: ['I am a student.', 'She is not tired.'], mistakes: ['"He are happy" → He is happy.'] },
  { id: 'a1-be-q', unitId: 'a1-u1', title: 'To be: questions',
    form: 'Put "be" before the subject: Are you ready? Is she at home?',
    use: 'Short answers repeat "be": Yes, I am. / No, she isn\'t.',
    examples: ['Are they teachers?', 'Is it cold?'], mistakes: ['"Is they late?" → Are they late?'] },
  { id: 'a1-ps-3s', unitId: 'a1-u4', title: 'Present simple: third person -s',
    form: 'He/she/it + verb + s (works, watches, studies). Others use the base verb.',
    use: 'Use for habits, routines and facts.',
    examples: ['She works in a bank.', 'They play football.'], mistakes: ['"He work here" → He works here.'] },
];

type R = [Exercise['type'], 1 | 2 | 3, string, string[], string, string[]?];
const mk = (topicId: string, rows: R[]): Exercise[] =>
  rows.map(([type, difficulty, prompt, accepted, explanation, options], i) => ({
    id: `${topicId}-${i + 1}`, topicId, type, difficulty, prompt, accepted, explanation, options, checkpoint: i >= rows.length - 3 }));

export const EXERCISES: Exercise[] = [
  ...mk('a1-be-aff', [
    ['fill', 1, 'I ___ a teacher.', ['am'], '"I" is always followed by "am".'],
    ['mcq', 1, 'She ___ from Spain.', ['is'], '"She" takes "is".', ['am', 'is', 'are']],
    ['fill', 2, 'They ___ at home. (be)', ['are'], '"They" takes "are".'],
    ['error', 2, 'Which part is wrong? "He are my brother."', ['are'], 'Use "is" with "he".', ['He', 'are', 'my brother']],
    ['mcq', 2, 'We ___ happy.', ['are'], '"We" takes "are".', ['is', 'am', 'are']],
    ['fill', 3, 'It ___ not cold today. (be)', ['is'], '"It" takes "is".'],
  ]),
  ...mk('a1-be-q', [
    ['mcq', 1, '___ you ready?', ['are'], 'Question: be + subject.', ['Is', 'Are', 'Am']],
    ['fill', 1, '___ she at home? (be)', ['is'], '"She" takes "is".'],
    ['mcq', 2, 'Are they students? Yes, they ___.', ['are'], 'Short answers repeat "be".', ['are', 'do', 'is']],
    ['error', 2, 'Which part is wrong? "Is they late?"', ['is'], 'Use "Are" with "they".', ['Is', 'they', 'late']],
    ['fill', 3, 'Is it cold? No, it ___ (short form).', ['isn\'t', 'is not'], 'Negative short answer: isn\'t.'],
    ['mcq', 3, '___ I late?', ['am'], '"I" takes "am" in questions.', ['Am', 'Is', 'Are']],
  ]),
  ...mk('a1-ps-3s', [
    ['fill', 1, 'She ___ (work) in a bank.', ['works'], 'Add -s for he/she/it.'],
    ['mcq', 1, 'He ___ coffee every day.', ['drinks'], 'Third person: verb + s.', ['drink', 'drinks', 'drinking']],
    ['fill', 2, 'My dad ___ (watch) TV at night.', ['watches'], 'Verbs ending in -ch add -es.'],
    ['error', 2, 'Which part is wrong? "She study English."', ['study'], 'Use "studies" (y → ies).', ['She', 'study', 'English']],
    ['fill', 3, 'The baby ___ (cry) a lot.', ['cries'], 'Consonant + y → -ies.'],
    ['mcq', 3, 'They ___ football on Sundays.', ['play'], '"They" uses the base verb.', ['plays', 'play', 'playing']],
  ]),
];

export const exercisesFor = (topicId: string, mode: 'practice' | 'checkpoint') =>
  EXERCISES.filter((e) => e.topicId === topicId && !!e.checkpoint === (mode === 'checkpoint')).sort((a, b) => a.difficulty - b.difficulty);

const T = (id: string, unitId: string, title: string, form: string, use: string, ex: string, mistake: string): Topic =>
  ({ id, unitId, title, form, use, examples: [ex], mistakes: [mistake] });
TOPICS.push(
  T('a1-pron', 'a1-u2', 'Pronouns and possessive adjectives', 'Subject: I, you, he, she, it, we, they. Object: me, you, him, her, it, us, them. Possessive: my, your, his, her, its, our, their.', 'Subject pronouns come before verbs; object pronouns after verbs.', 'Tom is my friend. I like him.', '"She loves he." → She loves him.'),
  T('a1-plural', 'a1-u3', 'Plurals and a/an', 'Add -s (cats); -es after s/sh/ch/x (boxes); consonant + y → -ies (babies). Irregular: man → men, child → children. Use "an" before vowel sounds.', 'Use a/an with singular countable nouns.', 'I have an apple and two boxes.', '"Two childs" → two children.'),
  T('a1-wh', 'a1-u5', 'Question words', 'Question word + be/do + subject: Where is Tom? What do you eat? Use who, what, where, when, why, how.', 'After do/does use the base verb: What does he play?', 'Where do you live?', '"What does he plays?" → What does he play?'),
  T('a1-can', 'a1-u6', 'Can for ability', 'can + base verb for all subjects. Negative: can\'t/cannot. Question: Can you swim?', 'Use can for ability and requests.', 'She can swim but she can\'t dance.', '"She cans dance" → She can dance.'),
  T('a1-prep', 'a1-u7', 'Time prepositions: in, on, at', 'at + clock times/night; on + days and dates; in + months, years, seasons, parts of the day.', 'Choose the preposition by the type of time word.', 'I wake up at 7 on Mondays.', '"in 7 o\'clock" → at 7 o\'clock.'),
  T('a1-pc', 'a1-u8', 'Present continuous', 'am/is/are + verb-ing. Double a final single consonant (running). Drop final e (making).', 'Use for actions happening now.', 'They are playing football now.', '"He is work today" → He is working today.'),
  T('a1-quant', 'a1-u9', 'Some, any, much, many', 'some in positive sentences; any in negatives and questions. many + plural countable nouns; much + uncountable nouns.', 'Use "a lot of" with both kinds in positive sentences.', 'We don\'t have any milk.', '"How much books" → How many books.'),
);
EXERCISES.push(
  ...mk('a1-pron', [
    ['mcq', 1, 'Anna is my friend. ___ is kind.', ['she'], 'Subject pronoun for a woman: she.', ['She', 'Her', 'Hers']],
    ['fill', 1, 'I have a dog. ___ dog is big.', ['my'], 'Possessive adjective for I: my.'],
    ['mcq', 2, 'Look at Tom. Call ___.', ['him'], 'Object pronoun after a verb: him.', ['he', 'him', 'his']],
    ['error', 2, 'Which part is wrong? "She loves he."', ['he'], 'After a verb use "him".', ['She', 'loves', 'he']],
    ['mcq', 2, 'They live here. This is ___ house.', ['their'], 'Possessive adjective for they: their.', ['their', 'they', 'them']],
    ['fill', 3, 'We love our teacher and she helps ___.', ['us'], 'Object pronoun for we: us.'],
  ]),
  ...mk('a1-plural', [
    ['mcq', 1, 'one book, two ___', ['books'], 'Regular plural: add -s.', ['books', 'bookes', 'bookies']],
    ['fill', 1, 'one box, two ___', ['boxes'], 'Add -es after x.'],
    ['mcq', 2, 'I have ___ apple.', ['an'], 'Use "an" before a vowel sound.', ['a', 'an', 'the']],
    ['error', 2, 'Which part is wrong? "Two childs are here."', ['childs'], 'Irregular plural: children.', ['Two', 'childs', 'are here']],
    ['fill', 3, 'one baby, two ___', ['babies'], 'Consonant + y → -ies.'],
    ['mcq', 3, 'She is ___ honest girl.', ['an'], 'Honest starts with a vowel sound.', ['a', 'an', 'the']],
  ]),
  ...mk('a1-wh', [
    ['mcq', 1, '___ is your name?', ['what'], 'Ask about things with "what".', ['What', 'Where', 'When']],
    ['mcq', 1, '___ do you live? In Paris.', ['where'], 'Ask about places with "where".', ['Who', 'Where', 'Why']],
    ['fill', 2, 'What ___ you do every day? (do/does)', ['do'], '"You" takes "do".'],
    ['mcq', 2, '___ is that man? He is my uncle.', ['who'], 'Ask about people with "who".', ['Who', 'When', 'Where']],
    ['error', 2, 'Which part is wrong? "What does he plays?"', ['plays'], 'After does use the base verb: play.', ['What does', 'he', 'plays']],
    ['fill', 3, 'Why are you late? ___ the bus was slow.', ['because'], 'Answer "why" with "because".'],
  ]),
  ...mk('a1-can', [
    ['mcq', 1, 'I ___ swim.', ['can'], 'Use can + base verb.', ['can', 'cans', 'am can']],
    ['fill', 1, 'He ___ drive. He is only ten. (negative)', ['can\'t', 'cannot'], 'Negative: can\'t / cannot.'],
    ['mcq', 2, '___ you help me?', ['can'], 'Questions start with can.', ['Can', 'Do', 'Are']],
    ['error', 2, 'Which part is wrong? "She cans dance."', ['cans'], 'Can never takes -s.', ['She', 'cans', 'dance']],
    ['mcq', 2, 'She can ___ the piano.', ['play'], 'Base verb after can.', ['play', 'plays', 'playing']],
    ['fill', 3, 'Can they come? No, they ___. (short answer)', ['can\'t', 'cannot'], 'Short negative answer.'],
  ]),
  ...mk('a1-prep', [
    ['mcq', 1, 'See you ___ Monday.', ['on'], 'Days take "on".', ['in', 'on', 'at']],
    ['mcq', 1, 'The class starts ___ 9 o\'clock.', ['at'], 'Clock times take "at".', ['in', 'on', 'at']],
    ['fill', 2, 'My birthday is ___ July.', ['in'], 'Months take "in".'],
    ['error', 2, 'Which part is wrong? "I wake up in 7 o\'clock."', ['in'], 'Use "at" with clock times.', ['I wake up', 'in', '7 o\'clock']],
    ['mcq', 2, 'We eat dinner ___ the evening.', ['in'], 'Parts of the day take "in".', ['in', 'on', 'at']],
    ['fill', 3, 'I was born ___ 1995.', ['in'], 'Years take "in".'],
  ]),
  ...mk('a1-pc', [
    ['fill', 1, 'I am ___ (read) now.', ['reading'], 'Verb + -ing.'],
    ['mcq', 1, 'They ___ football now.', ['are playing'], 'They + are + verb-ing.', ['are playing', 'plays', 'is playing']],
    ['fill', 2, 'She is ___ (run) in the park.', ['running'], 'Double the final consonant.'],
    ['error', 2, 'Which part is wrong? "He is work today."', ['work'], 'Use working after is.', ['He is', 'work', 'today']],
    ['mcq', 2, '___ you sleeping?', ['are'], 'You takes are.', ['Are', 'Is', 'Do']],
    ['fill', 3, 'We are ___ (make) dinner.', ['making'], 'Drop the final e, add -ing.'],
  ]),
  ...mk('a1-quant', [
    ['mcq', 1, 'I have ___ friends.', ['some'], 'Use some in positive sentences.', ['some', 'any', 'much']],
    ['mcq', 1, 'We don\'t have ___ milk.', ['any'], 'Use any in negatives.', ['some', 'any', 'many']],
    ['fill', 2, 'How ___ water do you drink? (much/many)', ['much'], 'Water is uncountable: much.'],
    ['error', 2, 'Which part is wrong? "How much books do you have?"', ['much'], 'Books are countable: many.', ['How', 'much', 'books do you have']],
    ['mcq', 2, 'Is there ___ bread?', ['any'], 'Use any in questions.', ['some', 'any', 'many']],
    ['fill', 3, 'There aren\'t ___ chairs. (many/much)', ['many'], 'Chairs are countable: many.'],
  ]),
);

TOPICS.push(
  T('a2-past', 'a2-u1', 'Past simple', 'Regular: verb + -ed (worked). Irregular: went, saw, had. Negative: didn\'t + base verb. Question: Did + subject + base verb. Be: was/were.', 'Use for finished actions at a definite past time.', 'I walked to school and saw Tom.', '"Did she went home?" → Did she go home?'),
  T('a2-pastcont', 'a2-u2', 'Past continuous', 'was/were + verb-ing.', 'Use for an action in progress when another (past simple) action happened.', 'I was cooking when he called.', '"She were reading" → She was reading.'),
  T('a2-future', 'a2-u3', 'Future forms', 'will + base verb (instant decisions, predictions); going to + base verb (plans, evidence); present continuous (fixed arrangements).', 'Choose the form by the speaker\'s meaning.', 'Look at the clouds! It is going to rain.', '"I will to help" → I will help.'),
  T('a2-comp', 'a2-u4', 'Comparison', 'Short adjectives: -er/-est (taller, the tallest; bigger; happier). Long adjectives: more/most. Irregular: good → better → best, bad → worse → worst. as ... as.', 'Compare two things with -er/more; three or more with -est/most.', 'This book is more interesting than that one.', '"more tall" → taller.'),
  T('a2-modal', 'a2-u5', 'Modals: should, must, have to, may', 'should = advice; must/have to = obligation; mustn\'t = prohibition; don\'t have to = not necessary; may = permission. All take the base verb.', 'Modals never add -s.', 'You should rest. You mustn\'t smoke here.', '"She musts go" → She must go.'),
  T('a2-pp1', 'a2-u6', 'Present perfect (introduction)', 'have/has + past participle. for + period; since + starting point. Often with ever, never, just, already, yet.', 'Use for experiences and for situations that continue to now.', 'I have seen that film. We have lived here since 2015.', '"He has went" → He has gone.'),
  T('a2-art', 'a2-u7', 'Quantifiers and articles', 'a few + plural countable; a little + uncountable. a/an = first mention; the = known or specific; no article for general plurals and uncountables.', 'Few/little mean "not enough"; a few/a little mean "some".', 'I have a few friends. The dog was black.', '"a little friends" → a few friends.'),
  T('a2-clauses', 'a2-u8', 'Basic clauses and conditionals', 'because (reason), so (result), but and although (contrast). Zero conditional: if + present, present. First: if + present, will + base verb.', 'Use first conditional for real future possibilities.', 'If it rains, we will stay at home.', '"If I will see him" → If I see him.'),
  T('a2-pronphr', 'a2-u9', 'Pronouns and verb patterns', 'Possessive pronouns: mine, yours, his, hers, ours, theirs. Reflexive: myself, himself, themselves. enjoy + -ing; want + to-infinitive.', 'Possessive pronouns replace a noun: It is mine.', 'I enjoy listening to music.', '"I want going" → I want to go.'),
);
EXERCISES.push(
  ...mk('a2-past', [
    ['fill', 1, 'Yesterday I ___ (walk) to school.', ['walked'], 'Regular past: -ed.'],
    ['mcq', 1, 'She ___ to Rome last year.', ['went'], 'Irregular past of go: went.', ['went', 'goed', 'gone']],
    ['fill', 2, 'He didn\'t ___ (go) to work.', ['go'], 'After didn\'t use the base verb.'],
    ['error', 2, 'Which part is wrong? "Did she went home?"', ['went'], 'After did use the base verb: go.', ['Did she', 'went', 'home']],
    ['mcq', 2, '___ you see the film?', ['did'], 'Past question: Did + subject + base verb.', ['Did', 'Do', 'Were']],
    ['mcq', 3, 'They ___ at the party.', ['were'], 'Past of be with they: were.', ['was', 'were', 'are']],
  ]),
  ...mk('a2-pastcont', [
    ['fill', 1, 'I was ___ (watch) TV.', ['watching'], 'was + verb-ing.'],
    ['mcq', 1, 'They ___ playing at five o\'clock.', ['were'], 'They takes were.', ['was', 'were', 'are']],
    ['mcq', 2, 'I ___ when the phone rang.', ['was sleeping'], 'Action in progress: was + -ing.', ['was sleeping', 'slept', 'sleeping']],
    ['error', 2, 'Which part is wrong? "She were reading."', ['were'], 'She takes was.', ['She', 'were', 'reading']],
    ['mcq', 2, 'While he ___, I cooked.', ['was studying'], 'Longer background action: past continuous.', ['was studying', 'studied', 'studies']],
    ['fill', 3, 'He ___ when I arrived. (talk, past continuous)', ['was talking'], 'was + verb-ing.'],
  ]),
  ...mk('a2-future', [
    ['mcq', 1, 'Look at the clouds! It ___ rain.', ['is going to'], 'Evidence now: going to.', ['is going to', 'will', 'rains']],
    ['mcq', 1, 'I\'m thirsty. I ___ get some water.', ['will'], 'Instant decision: will.', ['will', 'am going to', 'go']],
    ['fill', 2, 'She is going ___ study law.', ['to'], 'going to + base verb.'],
    ['error', 2, 'Which part is wrong? "I will to help you."', ['to'], 'will + base verb, no "to".', ['I will', 'to', 'help you']],
    ['mcq', 2, 'I think it ___ be sunny tomorrow.', ['will'], 'Prediction: will.', ['will', 'is', 'does']],
    ['fill', 3, 'We ___ meeting Tom at six tonight. (be)', ['are'], 'Arrangement: present continuous.'],
  ]),
  ...mk('a2-comp', [
    ['fill', 1, 'My brother is ___ than me. (tall)', ['taller'], 'Short adjective: -er.'],
    ['mcq', 1, 'This book is ___ than that one.', ['more interesting'], 'Long adjective: more + adjective.', ['more interesting', 'interestinger', 'most interesting']],
    ['fill', 2, 'She is the ___ girl in class. (smart)', ['smartest'], 'Superlative: the + -est.'],
    ['error', 2, 'Which part is wrong? "He is more tall than me."', ['more'], 'Tall is short: taller.', ['He is', 'more', 'tall than me']],
    ['mcq', 2, 'Today is ___ day of the year. (bad)', ['the worst'], 'Irregular superlative: the worst.', ['the worst', 'the baddest', 'worse']],
    ['fill', 3, 'My car is not as fast ___ yours.', ['as'], 'not as ... as.'],
  ]),
  ...mk('a2-modal', [
    ['mcq', 1, 'You ___ see a doctor. (advice)', ['should'], 'Advice: should + base verb.', ['should', 'should to', 'shoulds']],
    ['mcq', 1, 'Students ___ use phones in the exam. (forbidden)', ['mustn\'t'], 'Prohibition: mustn\'t.', ['mustn\'t', 'don\'t have to', 'should']],
    ['fill', 2, 'You ___ come early. It is not necessary.', ['don\'t have to', 'do not have to'], 'Not necessary: don\'t have to.'],
    ['error', 2, 'Which part is wrong? "She musts go now."', ['musts'], 'Modals never take -s.', ['She', 'musts', 'go now']],
    ['mcq', 2, '___ I open the window? (permission)', ['may'], 'Permission: may.', ['May', 'Must', 'Mays']],
    ['mcq', 3, 'I ___ work tomorrow. I have a meeting.', ['have to'], 'Obligation: have to.', ['have to', 'must to', 'am have to']],
  ]),
  ...mk('a2-pp1', [
    ['fill', 1, 'I have ___ (see) that film.', ['seen'], 'Past participle of see: seen.'],
    ['mcq', 1, 'She ___ lived here for ten years.', ['has'], 'She takes has.', ['has', 'have', 'is']],
    ['fill', 2, 'We have lived here ___ 2015.', ['since'], 'since + starting point.'],
    ['error', 2, 'Which part is wrong? "He has went home."', ['went'], 'Past participle of go: gone.', ['He has', 'went', 'home']],
    ['mcq', 2, 'Have you ___ been to Spain?', ['ever'], 'ever in experience questions.', ['ever', 'yet', 'since']],
    ['mcq', 3, 'I haven\'t finished ___.', ['yet'], 'yet in negatives and questions.', ['yet', 'ever', 'already']],
  ]),
  ...mk('a2-art', [
    ['mcq', 1, 'I have ___ friends here. (some, not many)', ['a few'], 'Countable plural: a few.', ['a few', 'a little', 'much']],
    ['mcq', 1, 'There is ___ milk in the fridge.', ['a little'], 'Uncountable: a little.', ['a little', 'a few', 'many']],
    ['fill', 2, 'I saw a dog. ___ dog was black.', ['the'], 'Second mention: the.'],
    ['error', 2, 'Which part is wrong? "She has a little friends."', ['a little'], 'Friends is countable: a few.', ['She has', 'a little', 'friends']],
    ['mcq', 2, 'He plays ___ guitar.', ['the'], 'Instruments take the.', ['the', 'a', 'an']],
    ['mcq', 3, 'I love ___ (in general).', ['dogs'], 'General plural: no article.', ['dogs', 'the dogs', 'a dogs']],
  ]),
  ...mk('a2-clauses', [
    ['mcq', 1, 'I was tired, ___ I went to bed.', ['so'], 'so introduces a result.', ['so', 'because', 'but']],
    ['mcq', 1, 'He stayed home ___ he was ill.', ['because'], 'because gives a reason.', ['because', 'so', 'but']],
    ['fill', 2, 'If it rains, we ___ stay at home. (will)', ['will'], 'First conditional: will + base verb.'],
    ['error', 2, 'Which part is wrong? "If I will see him, I will tell him."', ['If I will see him'], 'Use present simple after if: If I see him.', ['If I will see him', 'I will tell him']],
    ['mcq', 2, '___ it was cold, we went out.', ['although'], 'although shows contrast.', ['Although', 'Because', 'So']],
    ['fill', 3, 'If you heat ice, it ___. (melt)', ['melts'], 'Zero conditional: present simple.'],
  ]),
  ...mk('a2-pronphr', [
    ['mcq', 1, 'This book is ___. (it belongs to me)', ['mine'], 'Possessive pronoun: mine.', ['mine', 'my', 'me']],
    ['fill', 1, 'He cut ___ with a knife. (he)', ['himself'], 'Reflexive pronoun: himself.'],
    ['mcq', 2, 'I enjoy ___ music.', ['listening to'], 'enjoy + -ing.', ['listening to', 'to listen to', 'listen to']],
    ['error', 2, 'Which part is wrong? "I want going home."', ['going'], 'want + to-infinitive.', ['I want', 'going', 'home']],
    ['mcq', 2, 'Is there ___ in the box?', ['anything'], 'Questions use any-.', ['anything', 'something', 'nothing']],
    ['fill', 3, 'Those keys are not mine. They are ___. (you)', ['yours'], 'Possessive pronoun: yours.'],
  ]),
);

TOPICS.push(
  T('b1-ppc', 'b1-u1', 'Present perfect: simple, continuous, and vs past simple', 'Simple: have/has + past participle (result). Continuous: have/has been + -ing (activity, duration). Past simple is for finished times (yesterday, last week).', 'Present perfect links the past to now; past simple stays in the past.', 'I have lost my keys. I lost them yesterday.', '"I have seen him last week" → I saw him last week.'),
  T('b1-pastperf', 'b1-u2', 'Past perfect', 'had + past participle.', 'Use for an action completed before another past action or time.', 'When I arrived, the film had started.', '"I had saw her" → I had seen her.'),
  T('b1-cond', 'b1-u3', 'First and second conditionals', 'First: if + present simple, will + base verb (real future). Second: if + past simple, would + base verb (unreal or unlikely). unless = if not; as long as = only if. Use "were" in If I were you.', 'First = likely; second = imaginary.', 'If I were you, I would study more.', '"If I would have money" → If I had money.'),
  T('b1-passive', 'b1-u4', 'Passive voice: present and past simple', 'be + past participle: is/are made, was/were made. The object of the active sentence becomes the subject. Add by + agent only if important.', 'Use the passive when the action matters more than who did it.', 'The bridge was built in 1990.', '"was wrote" → was written.'),
  T('b1-reported', 'b1-u5', 'Reported speech', 'Tenses shift back: am → was, can → could, will → would, past simple → past perfect. Questions: asked if/whether + statement order. Commands: told me to + base verb.', 'Pronouns and time words change too (today → that day).', 'He asked if I liked tea.', '"She asked where did I live" → where I lived.'),
  T('b1-relative', 'b1-u6', 'Relative clauses', 'who (people), which (things), that (either, defining), where (places), whose (possession). Non-defining clauses use commas and not "that".', 'Omit the pronoun when it is the object of the clause.', 'The woman who lives next door is a doctor.', '"The man which called" → The man who called.'),
  T('b1-modal2', 'b1-u7', 'Modals of deduction and advice', 'must = sure it is true; might/may/could = possible; can\'t = sure it is not true. had better + base verb = strong advice. be able to replaces can in other tenses.', 'Deduction is based on evidence.', 'He has a Ferrari. He must be rich.', '"had better to leave" → had better leave.'),
  T('b1-patterns', 'b1-u8', 'Verb patterns and used to', 'enjoy, avoid, finish + -ing; want, decide, hope, plan + to-infinitive. used to + base verb = past habit; be/get used to + -ing = accustomed.', 'The first verb decides the pattern.', 'I used to play tennis. I\'m used to getting up early.', '"I\'m used to get up" → used to getting up.'),
  T('b1-qforms', 'b1-u9', 'Indirect questions, tags, so/neither', 'Indirect questions use statement order: Could you tell me where the station is? Tags: positive + negative (It\'s cold, isn\'t it?). So/Neither + auxiliary + subject.', 'Use tags to check or invite agreement.', 'Do you know where the bank is?', '"where is the bank" after Do you know → where the bank is.'),
  T('b1-link', 'b1-u10', 'Linking words and wish', 'however (new sentence, comma), although + clause, despite/in spite of + noun or -ing. both...and, either...or, neither...nor. wish + past simple for present regrets.', 'Choose the linker by the grammar that follows it.', 'Despite the rain, we went out.', '"Despite he was ill" → Although he was ill.'),
);
EXERCISES.push(
  ...mk('b1-ppc', [
    ['mcq', 1, 'I ___ in London for five years. (I still live there)', ['have lived'], 'Situation continuing to now: present perfect.', ['have lived', 'lived', 'have been live']],
    ['fill', 1, 'She has been ___ (learn) English since June.', ['learning'], 'have/has been + -ing.'],
    ['mcq', 2, 'I ___ him yesterday.', ['saw'], 'Finished time (yesterday): past simple.', ['saw', 'have seen', 'have been seeing']],
    ['error', 2, 'Which part is wrong? "I have seen him last week."', ['have seen'], 'Last week is finished time: saw.', ['I', 'have seen', 'him last week']],
    ['mcq', 2, 'Her eyes are red. She ___.', ['has been crying'], 'Recent activity with a visible result.', ['has been crying', 'cried', 'cries']],
    ['fill', 3, 'I\'m tired because I have been ___ (run) all morning.', ['running'], 'have been + -ing.'],
  ]),
  ...mk('b1-pastperf', [
    ['mcq', 1, 'When we arrived, the train ___.', ['had left'], 'The leaving came first: past perfect.', ['had left', 'left', 'has left']],
    ['fill', 1, 'She had already ___ (eat) when I called.', ['eaten'], 'Past participle of eat: eaten.'],
    ['mcq', 2, 'He was upset because he ___ his keys.', ['had lost'], 'Earlier cause: past perfect.', ['had lost', 'lost', 'has lost']],
    ['error', 2, 'Which part is wrong? "I had saw her before."', ['saw'], 'had + past participle: seen.', ['I had', 'saw', 'her before']],
    ['mcq', 2, 'After she ___ dinner, she watched TV.', ['had cooked'], 'First action: past perfect.', ['had cooked', 'has cooked', 'cooking']],
    ['fill', 3, 'By the time I got home, my family ___ already gone to bed. (have)', ['had'], 'had + past participle.'],
  ]),
  ...mk('b1-cond', [
    ['mcq', 1, 'If it rains tomorrow, we ___ at home.', ['will stay'], 'Real future: will + base verb.', ['will stay', 'would stay', 'stayed']],
    ['fill', 1, 'If I ___ (be) you, I would study more.', ['were', 'was'], 'Second conditional: were.'],
    ['mcq', 2, 'If she had more time, she ___ a course.', ['would take'], 'Unreal present: would + base verb.', ['would take', 'will take', 'takes']],
    ['error', 2, 'Which part is wrong? "If I would have money, I would travel."', ['would have'], 'After if use past simple: had.', ['If I', 'would have', 'money, I would travel']],
    ['mcq', 2, 'You will fail ___ you study.', ['unless'], 'unless = if not.', ['unless', 'if', 'as long as']],
    ['fill', 3, 'I\'ll lend you the car ___ long as you drive carefully.', ['as'], 'as long as = only if.'],
  ]),
  ...mk('b1-passive', [
    ['mcq', 1, 'English ___ all over the world.', ['is spoken'], 'Present passive: is/are + participle.', ['is spoken', 'speaks', 'is speaking']],
    ['fill', 1, 'The window ___ broken yesterday. (was/were)', ['was'], 'Singular past passive: was.'],
    ['mcq', 2, 'These cars ___ in Japan.', ['are made'], 'Plural present passive: are made.', ['are made', 'is made', 'make']],
    ['error', 2, 'Which part is wrong? "The letter was wrote by Tom."', ['wrote'], 'Use the participle: written.', ['The letter was', 'wrote', 'by Tom']],
    ['mcq', 2, 'The bridge ___ in 1990. (They built it.)', ['was built'], 'Past passive: was + participle.', ['was built', 'is built', 'built']],
    ['fill', 3, 'Rice ___ grown in Asia. (is/are)', ['is'], 'Uncountable noun takes is.'],
  ]),
  ...mk('b1-reported', [
    ['mcq', 1, 'She said, "I am happy." → She said she ___ happy.', ['was'], 'Backshift: am → was.', ['was', 'is', 'were']],
    ['fill', 1, 'He said, "I can swim." → He said he ___ swim.', ['could'], 'Backshift: can → could.'],
    ['mcq', 2, '"Do you like tea?" → He asked me ___ tea.', ['if I liked'], 'Reported questions use statement order.', ['if I liked', 'do I like', 'did I like']],
    ['error', 2, 'Which part is wrong? "She asked where did I live."', ['did I live'], 'Use statement order: where I lived.', ['She asked', 'where', 'did I live']],
    ['mcq', 2, '"Open the door," she said. → She told me ___ the door.', ['to open'], 'Commands: told + object + to-infinitive.', ['to open', 'open', 'opening']],
    ['fill', 3, '"I will call you." → He said he ___ call me.', ['would'], 'Backshift: will → would.'],
  ]),
  ...mk('b1-relative', [
    ['mcq', 1, 'The woman ___ lives next door is a doctor.', ['who'], 'Use who for people.', ['who', 'which', 'where']],
    ['fill', 1, 'This is the book ___ I told you about. (which/that)', ['which', 'that'], 'Things: which or that.'],
    ['mcq', 2, 'That is the town ___ I was born.', ['where'], 'Places: where.', ['where', 'who', 'whose']],
    ['error', 2, 'Which part is wrong? "The man which called you is my boss."', ['which'], 'People: who or that.', ['The man', 'which', 'called you is my boss']],
    ['mcq', 2, 'She is the girl ___ bag was stolen.', ['whose'], 'Possession: whose.', ['whose', 'who', 'which']],
    ['fill', 3, 'My brother, ___ lives in Rome, is a chef.', ['who'], 'Non-defining clauses cannot use that.'],
  ]),
  ...mk('b1-modal2', [
    ['mcq', 1, 'He has a Ferrari. He ___ be rich.', ['must'], 'Strong deduction: must.', ['must', 'can\'t', 'should']],
    ['mcq', 1, 'She is at work, so she ___ be at home.', ['can\'t'], 'Sure it is not true: can\'t.', ['can\'t', 'must', 'might']],
    ['fill', 2, 'You had ___ go to bed early.', ['better'], 'had better + base verb.'],
    ['error', 2, 'Which part is wrong? "You had better to leave now."', ['to'], 'had better + base verb, no "to".', ['You had better', 'to', 'leave now']],
    ['mcq', 2, 'I don\'t know where he is. He ___ be at the gym.', ['might'], 'Possibility: might.', ['might', 'must', 'can\'t']],
    ['fill', 3, 'I will ___ able to help you tomorrow. (be)', ['be'], 'will be able to = future of can.'],
  ]),
  ...mk('b1-patterns', [
    ['mcq', 1, 'I decided ___ a new job.', ['to find'], 'decide + to-infinitive.', ['to find', 'finding', 'find']],
    ['mcq', 1, 'She avoids ___ sugar.', ['eating'], 'avoid + -ing.', ['eating', 'to eat', 'eat']],
    ['fill', 2, 'I used ___ play tennis when I was young. (to/for)', ['to'], 'used to + base verb.'],
    ['error', 2, 'Which part is wrong? "I\'m used to get up early."', ['get'], 'be used to + -ing: getting.', ['I\'m used to', 'get', 'up early']],
    ['mcq', 2, 'He finished ___ his homework.', ['doing'], 'finish + -ing.', ['doing', 'to do', 'do']],
    ['fill', 3, 'They plan ___ next year. (travel)', ['to travel'], 'plan + to-infinitive.'],
  ]),
  ...mk('b1-qforms', [
    ['mcq', 1, 'It\'s cold today, ___?', ['isn\'t it'], 'Positive statement → negative tag.', ['isn\'t it', 'is it', 'doesn\'t it']],
    ['mcq', 1, 'You like pizza, ___?', ['don\'t you'], 'Use the same auxiliary (do).', ['don\'t you', 'do you', 'aren\'t you']],
    ['mcq', 2, 'Could you tell me where ___?', ['the station is'], 'Indirect questions use statement order.', ['the station is', 'is the station', 'the station does']],
    ['error', 2, 'Which part is wrong? "Do you know where is the bank?"', ['where is'], 'Use statement order: where the bank is.', ['Do you know', 'where is', 'the bank']],
    ['mcq', 2, '"I love jazz." "___ do I."', ['so'], 'Agreeing with a positive: So + auxiliary.', ['So', 'Neither', 'Too']],
    ['fill', 3, '"I can\'t swim." "Neither ___ I."', ['can'], 'Neither + same auxiliary.'],
  ]),
  ...mk('b1-link', [
    ['mcq', 1, '___ the rain, we went out.', ['despite'], 'despite + noun.', ['Despite', 'Although', 'However']],
    ['mcq', 1, '___ he was tired, he kept working.', ['although'], 'although + clause.', ['Although', 'Despite', 'However']],
    ['fill', 2, 'It was cheap. ___, it was bad. (one word)', ['however'], 'however starts a contrasting sentence.'],
    ['error', 2, 'Which part is wrong? "Despite he was ill, he came."', ['despite'], 'Despite needs a noun or -ing; use although.', ['Despite', 'he was ill,', 'he came']],
    ['mcq', 2, 'I wish I ___ more time.', ['had'], 'wish + past simple for present regrets.', ['had', 'have', 'would have']],
    ['fill', 3, 'Neither Tom ___ Anna came. (nor/or)', ['nor'], 'neither ... nor.'],
  ]),
);

TOPICS.push(
  T('b2-tenses', 'b2-u1', 'Future continuous, future perfect and narrative tenses', 'Future continuous: will be + -ing (in progress at a future time). Future perfect: will have + participle (finished by a future time). Past perfect continuous: had been + -ing. Narrative: past simple for events, past continuous for background, past perfect for earlier events.', 'Choose the tense by when the action happens relative to another time.', 'By Friday, I will have finished the report.', '"I will have finish" → I will have finished.'),
  T('b2-cond2', 'b2-u2', 'Third and mixed conditionals', 'Third: if + past perfect, would have + participle (unreal past). Mixed: if + past perfect, would + base (past cause, present result). wish/if only + past perfect for past regrets. I\'d rather + past simple.', 'Use third conditional for imagined past outcomes.', 'If I had studied, I would have passed.', '"If he would have called" → If he had called.'),
  T('b2-passive2', 'b2-u3', 'Passive voice: all forms and causative', 'Perfect: has been done. Continuous: is being done. Modal: must be done. Causative: have/get + object + participle. Impersonal: It is said that... / He is said to be...', 'Use the causative when someone else does a service for you.', 'I had my hair cut. The house is being painted.', '"This must done" → This must be done.'),
  T('b2-reported2', 'b2-u4', 'Reporting verbs', 'promise/refuse/offer + to-infinitive. suggest/deny/admit + -ing. advise/warn/remind + object + to-infinitive. accuse sb of + -ing; apologise for + -ing.', 'The reporting verb decides the pattern that follows.', 'He denied taking the money.', '"She advised me taking" → advised me to take.'),
  T('b2-relative2', 'b2-u5', 'Reduced and formal relative clauses', 'Reduced: the man standing there (= who is standing); the book written by Orwell (= which was written). Formal: the person to whom I spoke. Which can refer to a whole clause.', 'Reduce only defining clauses where the meaning stays clear.', 'The man standing by the window is my uncle.', '"who\'s bag" → whose bag.'),
  T('b2-modal3', 'b2-u6', 'Past modals', 'should have + participle (regret/criticism); could/might have (past possibility); must have (certain); can\'t have (impossible); needn\'t have (did something unnecessary).', 'Past modals judge or guess about past events.', 'You should have told me. She needn\'t have come.', '"should of called" → should have called.'),
  T('b2-articles2', 'b2-u7', 'Articles and determiners: generic reference', 'the + singular for a type (The tiger is endangered); plural with no article (Tigers are...). the with unique things, rivers, nationalities (the French). No article with most countries, languages, meals and uncountables in general.', 'Generic nouns usually take no article.', 'The Nile is long. She speaks French.', '"The money cannot buy happiness" → Money cannot buy happiness.'),
  T('b2-comp2', 'b2-u8', 'Advanced comparison', 'The + comparative, the + comparative (The harder you work, the better you get). Double comparatives: colder and colder. much/far/a lot = big difference; slightly/a bit = small. not nearly as ... as.', 'Modifiers go before the comparative.', 'It is getting colder and colder.', '"very taller" → much taller.'),
  T('b2-participle', 'b2-u9', 'Participle clauses', '-ing clause = active (Walking home, I met Tom). -ed clause = passive (Built in 1900, the house is old). Perfect: Having finished, she left. The subject of both clauses must be the same.', 'Use participle clauses to join ideas in formal or written style.', 'Having finished his work, he went home.', '"Walking down the street, the rain started" (dangling) → the rain started while I was walking.'),
  T('b2-emphasis', 'b2-u10', 'Cleft sentences and linking', 'It was Tom who broke it. What I need is a holiday. whereas (contrast); provided/providing (that) (condition); in case + present simple (precaution).', 'Cleft sentences put focus on one part of the sentence.', 'Take an umbrella in case it rains.', '"in case it will rain" → in case it rains.'),
  T('b2-phrasal', 'b2-u11', 'Phrasal and prepositional verbs', 'Separable: pick up the phone / pick it up (pronoun goes in the middle). Inseparable: look after her. Three-part: put up with. Dependent prepositions: depend on, good at, interested in.', 'Learn the preposition together with the verb or adjective.', 'I picked it up. It depends on the weather.', '"picked up it" → picked it up.'),
);
EXERCISES.push(
  ...mk('b2-tenses', [
    ['mcq', 1, 'This time tomorrow, I ___ on a beach.', ['will be lying'], 'In progress at a future time: future continuous.', ['will be lying', 'will lie', 'will have lain']],
    ['fill', 1, 'By Friday, I will have ___ (finish) the report.', ['finished'], 'will have + past participle.'],
    ['mcq', 2, 'She was exhausted. She ___ all day.', ['had been working'], 'Activity before a past time: past perfect continuous.', ['had been working', 'worked', 'has worked']],
    ['error', 2, 'Which part is wrong? "I will have finish by six."', ['finish'], 'will have + participle: finished.', ['I will have', 'finish', 'by six']],
    ['mcq', 2, 'When I arrived, the guests ___. (they were already there)', ['had arrived'], 'Earlier past action: past perfect.', ['had arrived', 'arrived', 'were arriving']],
    ['fill', 3, 'Don\'t call at eight. We ___ dinner then. (future continuous, have)', ['will be having'], 'will be + -ing.'],
  ]),
  ...mk('b2-cond2', [
    ['mcq', 1, 'If I had studied, I ___ the exam.', ['would have passed'], 'Third conditional.', ['would have passed', 'would pass', 'had passed']],
    ['fill', 1, 'If she had known, she ___ (come).', ['would have come'], 'would have + participle.'],
    ['mcq', 2, 'If I had taken that job, I ___ rich now.', ['would be'], 'Mixed: past cause, present result.', ['would be', 'would have been', 'will be']],
    ['error', 2, 'Which part is wrong? "If he would have called, I would have answered."', ['would have called'], 'After if use past perfect: had called.', ['If he', 'would have called', 'I would have answered']],
    ['mcq', 2, 'I wish I ___ harder last year.', ['had studied'], 'wish + past perfect for past regrets.', ['had studied', 'studied', 'would study']],
    ['fill', 3, 'I\'d rather you ___ here. (not/smoke)', ['didn\'t smoke', 'did not smoke'], 'I\'d rather + subject + past simple.'],
  ]),
  ...mk('b2-passive2', [
    ['mcq', 1, 'The house ___ at the moment.', ['is being painted'], 'Present continuous passive.', ['is being painted', 'is painted', 'has painted']],
    ['fill', 1, 'The report has ___ (write) already.', ['been written'], 'has been + participle.'],
    ['mcq', 2, 'I ___ my hair cut yesterday.', ['had'], 'Causative: have + object + participle.', ['had', 'did', 'was']],
    ['error', 2, 'Which part is wrong? "This must done today."', ['must done'], 'Modal passive: must be done.', ['This', 'must done', 'today']],
    ['mcq', 2, 'He ___ to be very rich.', ['is said'], 'Impersonal passive: is said to.', ['is said', 'says', 'is saying']],
    ['fill', 3, 'You should get your eyes ___ (test).', ['tested'], 'get + object + participle.'],
  ]),
  ...mk('b2-reported2', [
    ['mcq', 1, 'He ___ to help us.', ['promised'], 'promise + to-infinitive.', ['promised', 'suggested', 'denied']],
    ['mcq', 1, 'She denied ___ the money.', ['taking'], 'deny + -ing.', ['taking', 'to take', 'take']],
    ['fill', 2, 'He suggested ___ (go) to the cinema.', ['going'], 'suggest + -ing.'],
    ['error', 2, 'Which part is wrong? "She advised me taking a taxi."', ['taking'], 'advise + object + to-infinitive.', ['She advised me', 'taking', 'a taxi']],
    ['mcq', 2, 'They accused him ___ the window.', ['of breaking'], 'accuse sb of + -ing.', ['of breaking', 'to break', 'for breaking']],
    ['fill', 3, 'He apologised ___ being late. (for/of)', ['for'], 'apologise for + -ing.'],
  ]),
  ...mk('b2-relative2', [
    ['mcq', 1, 'The man ___ by the window is my uncle.', ['standing'], 'Reduced active clause: -ing.', ['standing', 'who standing', 'stand']],
    ['fill', 1, 'The book ___ (write) by Orwell is famous.', ['written'], 'Reduced passive clause: participle.'],
    ['mcq', 2, 'The person to ___ I spoke was helpful.', ['whom'], 'Formal: preposition + whom.', ['whom', 'who', 'which']],
    ['error', 2, 'Which part is wrong? "The girl who\'s bag was lost cried."', ['who\'s'], 'Possession: whose.', ['The girl', 'who\'s', 'bag was lost cried']],
    ['mcq', 2, 'He missed the train, ___ made him late.', ['which'], 'which refers to the whole clause.', ['which', 'what', 'that']],
    ['fill', 3, 'The house in ___ I grew up was small. (which/whom)', ['which'], 'Preposition + which for things.'],
  ]),
  ...mk('b2-modal3', [
    ['mcq', 1, 'You ___ told me earlier! (criticism)', ['should have'], 'should have + participle.', ['should have', 'should', 'must have']],
    ['mcq', 1, 'The lights are off. They ___ gone out.', ['must have'], 'Certain deduction about the past.', ['must have', 'should have', 'needn\'t have']],
    ['fill', 2, 'He was lucky. He could ___ been killed.', ['have'], 'could have + participle.'],
    ['error', 2, 'Which part is wrong? "You should of called me."', ['of'], 'Write should have, not "should of".', ['You should', 'of', 'called me']],
    ['mcq', 2, 'She ___ brought food. We already had plenty.', ['needn\'t have'], 'Did something unnecessary.', ['needn\'t have', 'mustn\'t have', 'couldn\'t']],
    ['fill', 3, 'The floor is wet. It ___ have rained. (certain)', ['must'], 'must have = sure.'],
  ]),
  ...mk('b2-articles2', [
    ['mcq', 1, '___ Nile flows through Egypt.', ['the'], 'Rivers take "the".', ['The', 'A', 'An']],
    ['mcq', 1, 'She learns ___ French at school.', ['(no article)'], 'Languages take no article.', ['(no article)', 'the', 'a']],
    ['fill', 2, 'Look at ___ moon tonight!', ['the'], 'Unique things take "the".'],
    ['error', 2, 'Which part is wrong? "The money cannot buy happiness."', ['The money'], 'General uncountable: no article.', ['The money', 'cannot buy', 'happiness']],
    ['mcq', 2, 'The ___ are famous for their cheese.', ['French'], 'the + nationality adjective.', ['French', 'France', 'Frenches']],
    ['mcq', 3, 'She plays ___ violin in ___ orchestra.', ['the / an'], 'Instruments take "the"; orchestra starts with a vowel sound.', ['the / an', 'a / the', 'the / the']],
  ]),
  ...mk('b2-comp2', [
    ['mcq', 1, 'The harder you work, ___ you get.', ['the better'], 'The + comparative, the + comparative.', ['the better', 'better', 'the best']],
    ['fill', 1, 'It is getting colder and ___.', ['colder'], 'Double comparative shows change.'],
    ['mcq', 2, 'This phone is ___ more expensive than that one. (big difference)', ['much'], 'much + comparative.', ['much', 'very', 'most']],
    ['error', 2, 'Which part is wrong? "He is very taller than me."', ['very'], 'Use much/far with comparatives.', ['He is', 'very', 'taller than me']],
    ['mcq', 2, 'She is not ___ as tall as her brother.', ['nearly'], 'not nearly as ... as = much less.', ['nearly', 'near', 'nearer']],
    ['fill', 3, 'The ___ I know him, the more I like him. (well)', ['better'], 'Comparative of well: better.'],
  ]),
  ...mk('b2-participle', [
    ['mcq', 1, '___ home, I met an old friend.', ['walking'], 'Active, same time: -ing.', ['Walking', 'Walked', 'To walking']],
    ['mcq', 1, '___ in 1900, the bridge is still strong.', ['built'], 'Passive meaning: -ed.', ['Built', 'Building', 'Having built']],
    ['fill', 2, '___ finished his work, he went home. (have)', ['having'], 'Having + participle: earlier action.'],
    ['error', 2, 'Which part is wrong? "Walking down the street, the rain started."', ['Walking down the street'], 'Dangling clause: the subject must be the walker.', ['Walking down the street', 'the rain started']],
    ['mcq', 2, '___ the news, she burst into tears.', ['hearing'], 'Active, same time: -ing.', ['Hearing', 'To hear', 'Heard']],
    ['fill', 3, 'Not ___ (know) the answer, he stayed silent.', ['knowing'], 'Negative: Not + -ing.'],
  ]),
  ...mk('b2-emphasis', [
    ['mcq', 1, 'It was Tom ___ broke the window.', ['who'], 'Cleft sentence with a person.', ['who', 'which', 'what']],
    ['mcq', 1, '___ I need is a holiday.', ['what'], 'Pseudo-cleft: What I need is...', ['What', 'That', 'It']],
    ['fill', 2, 'Take an umbrella ___ case it rains.', ['in'], 'in case = as a precaution.'],
    ['error', 2, 'Which part is wrong? "Take a coat in case it will rain."', ['it will rain'], 'Use present simple after in case.', ['Take a coat', 'in case', 'it will rain']],
    ['mcq', 2, 'He is rich, ___ his brother is poor.', ['whereas'], 'whereas shows contrast.', ['whereas', 'provided', 'in case']],
    ['fill', 3, 'You can borrow it ___ that you return it tomorrow.', ['provided', 'providing'], 'provided/providing (that) = on condition.'],
  ]),
  ...mk('b2-phrasal', [
    ['mcq', 1, 'Please turn ___ the light.', ['off'], 'turn off = stop a light or machine.', ['off', 'of', 'at']],
    ['mcq', 1, 'She is good ___ maths.', ['at'], 'good at.', ['at', 'in', 'on']],
    ['fill', 2, 'It depends ___ the weather.', ['on'], 'depend on.'],
    ['error', 2, 'Which part is wrong? "I picked up it from the floor."', ['I picked up it'], 'Pronouns go in the middle: picked it up.', ['I picked up it', 'from the floor']],
    ['mcq', 2, 'I can\'t put ___ with the noise.', ['up'], 'put up with = tolerate.', ['up', 'on', 'off']],
    ['fill', 3, 'She is interested ___ art. (preposition)', ['in'], 'interested in.'],
  ]),
);

TOPICS.push(
  T('c1-inv', 'c1-u1', 'Inversion after negative adverbials', 'After a negative or restrictive adverbial at the start, use auxiliary + subject: Never have I seen... Not only did she win... Hardly had we left when... No sooner had he arrived than... Under no circumstances should you... Only after/then/when + inversion.', 'Inversion adds emphasis in formal or literary style.', 'Never have I seen such a view.', '"No sooner he had arrived" → No sooner had he arrived.'),
  T('c1-cond', 'c1-u2', 'Inverted and advanced conditionals', 'Drop if and invert: Had I known (= If I had known); Were he here (= If he were here); Should you need help (= If you should need help). were to for unlikely futures. But for + noun = if it were not for. Otherwise = if not.', 'Inverted forms are formal.', 'Had it not been for your help, I would have failed.', '"Were he knew" → Were he to know.'),
  T('c1-subj', 'c1-u3', 'Subjunctive and unreal tenses', 'After suggest, recommend, insist, demand, it is essential that: base form (I suggest that he be on time). It\'s time + past simple (It\'s time we left). as if/as though + past for unreal comparison.', 'The subjunctive has no -s in the third person.', 'The doctor insisted that he take a rest.', '"insisted that he takes" → insisted that he take.'),
  T('c1-modal', 'c1-u4', 'Advanced modality and hedging', 'be bound to = certain; may well = quite likely; It would appear that... = hedging. will/would for typical behaviour (He will sit for hours; She would always arrive late). needn\'t / dare as modals take the bare infinitive.', 'Hedging softens claims in academic and formal writing.', 'It would appear that the plan has failed.', '"You needn\'t to worry" → You needn\'t worry.'),
  T('c1-cleft', 'c1-u5', 'Cleft sentences and focus', 'It-cleft: It was in Paris that they met. Wh-cleft: What surprised me was her reaction. The reason why... is... All I want is... Reversed: A holiday is what I need.', 'Clefts focus attention on one part of the message.', 'What I need is a holiday.', '"What I need are a holiday" → What I need is a holiday.'),
  T('c1-passive', 'c1-u6', 'Advanced passives', 'get-passive for unplanned events (He got fired). Passive gerund/infinitive: hates being kept waiting; expects to be told. Reporting passives: He is believed to have left (perfect infinitive for earlier time).', 'Use reporting passives to avoid naming the source.', 'The suspect is thought to have left the country.', '"is believed to leave ... last year" → to have left.'),
  T('c1-np', 'c1-u7', 'Complex noun phrases', 'Pre-modifier order: opinion, size, age, shape, colour, origin, material (a beautiful old wooden table; a small red Italian bag). Post-modifiers: the girl in red; the idea that he is right; the reason for leaving. Nominalisation: decide → decision. Apposition: Paris, the capital of France.', 'Noun phrases pack information into fewer words.', 'We discussed the idea that he should resign.', '"a red small bag" → a small red bag.'),
  T('c1-ellipsis', 'c1-u8', 'Ellipsis and substitution', 'Omit repeated words (She can swim and dive). one/ones replace countable nouns (the blue one). do so replaces a verb phrase. so/not replace clauses (I think so). Keep the auxiliary (She hasn\'t finished but I have). Short to for omitted infinitives (I\'d love to).', 'Ellipsis avoids repetition and makes speech and writing flow.', 'I haven\'t finished but she has.', '"she didn\'t to" → she didn\'t.'),
  T('c1-discourse', 'c1-u9', 'Discourse markers and cohesion', 'Addition: moreover, furthermore, in addition. Contrast: nevertheless, however, even so. Result: consequently, as a result. Concession: admittedly. Clarification: in other words, that is.', 'Markers show how sentences relate to each other.', 'It was expensive; nevertheless, it was necessary.', '"He is rich; moreover, he is unhappy" → however.'),
  T('c1-compl', 'c1-u10', 'Complex verb complementation', 'Meaning changes: remember/forget/regret/stop/try + to-infinitive vs -ing (remember to lock / remember locking; stop to smoke / stop smoking). make/let + object + bare infinitive; have + object + bare infinitive; get + object + to-infinitive.', 'Choose the form by meaning, not by habit.', 'The teacher made us rewrite the essay.', '"She let me to use" → She let me use.'),
);
EXERCISES.push(
  ...mk('c1-inv', [
    ['mcq', 1, 'Never ___ such a beautiful view.', ['have I seen'], 'Negative adverbial first: auxiliary + subject.', ['have I seen', 'I have seen', 'I seen']],
    ['fill', 1, 'Not only ___ she win, but she also broke the record. (do)', ['did'], 'Not only + auxiliary + subject.'],
    ['mcq', 2, 'Hardly ___ the house when it started to rain.', ['had we left'], 'Hardly + had + subject + participle.', ['had we left', 'we had left', 'did we leave']],
    ['error', 2, 'Which part is wrong? "No sooner he had arrived than the phone rang."', ['he had arrived'], 'No sooner needs inversion: had he arrived.', ['No sooner', 'he had arrived', 'than the phone rang']],
    ['mcq', 2, 'Under no circumstances ___ open this door.', ['should you'], 'Under no circumstances + inversion.', ['should you', 'you should', 'you do']],
    ['fill', 3, 'Only after the meeting ___ I realise the problem. (do)', ['did'], 'Only after + auxiliary + subject.'],
  ]),
  ...mk('c1-cond', [
    ['mcq', 1, '___ I known, I would have helped.', ['had'], 'Inverted third conditional: Had + subject.', ['Had', 'Have', 'Did']],
    ['fill', 1, '___ you need any help, please call me.', ['should'], 'Should + subject = if you should.'],
    ['mcq', 2, '___ it not been for your help, I would have failed.', ['had'], 'Past: Had it not been for.', ['Had', 'Were', 'Should']],
    ['error', 2, 'Which part is wrong? "Were he knew the truth, he would act differently."', ['knew'], 'Use were + subject + to-infinitive: Were he to know.', ['Were he', 'knew', 'the truth, he would act differently']],
    ['mcq', 2, 'But ___ your advice, I would have made a mistake.', ['for'], 'But for + noun = if it had not been for.', ['for', 'of', 'by']],
    ['fill', 3, 'Take a map; ___, you will get lost. (if not)', ['otherwise'], 'otherwise = if not.'],
  ]),
  ...mk('c1-subj', [
    ['mcq', 1, 'I suggest that he ___ on time.', ['be'], 'Mandative subjunctive: base form.', ['be', 'is', 'was']],
    ['mcq', 1, 'They demanded that she ___ at once.', ['leave'], 'No -s after demand that.', ['leave', 'leaves', 'left']],
    ['fill', 2, 'It\'s time we ___ (go) home.', ['went'], 'It\'s time + past simple.'],
    ['error', 2, 'Which part is wrong? "The doctor insisted that he takes a rest."', ['takes'], 'Subjunctive: that he take.', ['The doctor insisted that he', 'takes', 'a rest']],
    ['mcq', 2, 'He spends money as though he ___ a millionaire.', ['were'], 'Unreal comparison: were.', ['were', 'is', 'will be']],
    ['fill', 3, 'I recommend that she ___ the offer. (not / accept)', ['not accept'], 'Negative subjunctive: not + base form.'],
  ]),
  ...mk('c1-modal', [
    ['mcq', 1, 'The train is bound ___ late in this weather.', ['to be'], 'be bound to + infinitive.', ['to be', 'be', 'being']],
    ['mcq', 1, 'He ___ sit for hours staring at the sea. (typical habit)', ['will'], 'will = typical behaviour.', ['will', 'is going', 'does']],
    ['fill', 2, 'She may ___ be right. (quite likely, one word)', ['well'], 'may well = quite likely.'],
    ['error', 2, 'Which part is wrong? "You needn\'t to worry."', ['to'], 'needn\'t + bare infinitive.', ['You needn\'t', 'to', 'worry']],
    ['mcq', 2, 'It ___ that the plan has failed. (hedged)', ['would appear'], 'Hedging phrase.', ['would appear', 'is appear', 'appears to']],
    ['fill', 3, 'When we were children, she ___ always tell us stories. (past habit)', ['would'], 'would = past habit.'],
  ]),
  ...mk('c1-cleft', [
    ['mcq', 1, 'It was in Paris ___ they first met.', ['that'], 'It-cleft: It was ... that.', ['that', 'what', 'which']],
    ['mcq', 1, '___ surprised me was her reaction.', ['what'], 'Wh-cleft with what.', ['What', 'It', 'That']],
    ['fill', 2, 'All I want ___ a quiet life. (be)', ['is'], 'All I want is...'],
    ['error', 2, 'Which part is wrong? "What I need are a holiday."', ['are'], 'Singular complement: is.', ['What I need', 'are', 'a holiday']],
    ['mcq', 2, 'The reason ___ I called is to apologise.', ['why'], 'The reason why...', ['why', 'what', 'how']],
    ['fill', 3, 'It was my sister ___ phoned me, not my brother. (who/that)', ['who', 'that'], 'It-cleft with a person.'],
  ]),
  ...mk('c1-passive', [
    ['mcq', 1, 'He ___ fired last week.', ['got'], 'get-passive: got + participle.', ['got', 'was got', 'has']],
    ['mcq', 1, 'She hates ___ waiting.', ['being kept'], 'Passive gerund: being + participle.', ['being kept', 'to keep', 'keeping']],
    ['fill', 2, 'I expect ___ the results by Friday. (tell, passive)', ['to be told'], 'Passive infinitive: to be + participle.'],
    ['error', 2, 'Which part is wrong? "He is believed to leave the country last year."', ['to leave'], 'Earlier time needs the perfect infinitive: to have left.', ['He is believed', 'to leave', 'the country last year']],
    ['mcq', 2, 'The suspect is thought ___ already left.', ['to have'], 'Perfect infinitive for an earlier time.', ['to have', 'to has', 'having']],
    ['fill', 3, 'The prisoner is known ___ escaped twice. (perfect infinitive)', ['to have'], 'is known to have + participle.'],
  ]),
  ...mk('c1-np', [
    ['mcq', 1, 'She bought a ___ table.', ['beautiful old wooden'], 'Order: opinion, age, material.', ['beautiful old wooden', 'wooden old beautiful', 'old beautiful wooden']],
    ['mcq', 1, '"They decided to leave." → their ___ to leave', ['decision'], 'Nominalisation: decide → decision.', ['decision', 'decide', 'deciding']],
    ['fill', 2, 'We discussed the idea ___ he should resign.', ['that'], 'Noun + that-clause.'],
    ['error', 2, 'Which part is wrong? "She bought a red small Italian bag."', ['red small'], 'Size comes before colour: small red.', ['She bought a', 'red small', 'Italian bag']],
    ['mcq', 2, 'Paris, ___ capital of France, is beautiful.', ['the'], 'Apposition: Paris, the capital of France.', ['the', 'a', 'an']],
    ['fill', 3, 'The reason ___ his leaving was clear.', ['for'], 'reason for + noun/-ing.'],
  ]),
  ...mk('c1-ellipsis', [
    ['mcq', 1, 'Do you like the red dress or the blue ___?', ['one'], 'one replaces a countable noun.', ['one', 'it', 'that']],
    ['mcq', 1, '"Is he coming?" "I think ___."', ['so'], 'so replaces the clause.', ['so', 'it', 'that']],
    ['fill', 2, 'I haven\'t finished but she ___.', ['has'], 'Keep the auxiliary.'],
    ['error', 2, 'Which part is wrong? "She said she would help, but she didn\'t to."', ['to'], 'After didn\'t, stop: but she didn\'t.', ['She said she would help,', 'but she didn\'t', 'to']],
    ['mcq', 2, 'He asked me to leave, and I ___ so.', ['did'], 'do so replaces the verb phrase.', ['did', 'made', 'was']],
    ['fill', 3, '"Would you like to come?" "I\'d love ___."', ['to'], 'Short to replaces the infinitive.'],
  ]),
  ...mk('c1-discourse', [
    ['mcq', 1, 'The tests were expensive; ___, they were necessary.', ['nevertheless'], 'Contrast.', ['nevertheless', 'moreover', 'therefore']],
    ['mcq', 1, 'She was late. ___, she missed the start.', ['consequently'], 'Result.', ['Consequently', 'However', 'Nevertheless']],
    ['fill', 2, 'It is cheap. ___, it is reliable. (addition)', ['moreover', 'furthermore', 'in addition'], 'Addition marker.'],
    ['error', 2, 'Which part is wrong? "He is very rich; moreover, he is unhappy."', ['moreover'], 'Contrast needs however/yet.', ['He is very rich;', 'moreover', 'he is unhappy.']],
    ['mcq', 2, 'Admittedly, the plan is risky. ___, it might work.', ['even so'], 'Concession then contrast.', ['Even so', 'Therefore', 'Firstly']],
    ['fill', 3, 'The plan failed; in other ___, we lost.', ['words'], 'in other words = clarification.'],
  ]),
  ...mk('c1-compl', [
    ['mcq', 1, 'Remember ___ the door when you leave.', ['to lock'], 'remember to = a duty.', ['to lock', 'locking', 'lock']],
    ['mcq', 1, 'He stopped ___ because it was bad for his health.', ['smoking'], 'stop + -ing = quit.', ['smoking', 'to smoke', 'smoke']],
    ['fill', 2, 'The teacher made us ___ the essay. (rewrite, base form)', ['rewrite'], 'make + object + bare infinitive.'],
    ['error', 2, 'Which part is wrong? "She let me to use her car."', ['to use'], 'let + object + bare infinitive.', ['She let me', 'to use', 'her car']],
    ['mcq', 2, 'I\'ll get him ___ the car.', ['to repair'], 'get + object + to-infinitive.', ['to repair', 'repair', 'repairing']],
    ['fill', 3, 'I regret ___ you that the flight is cancelled. (inform)', ['to inform'], 'regret to + verb = sorry to say.'],
  ]),
);

TOPICS.push(
  T('c2-inv2', 'c2-u1', 'Inversion: so/such, rarely, place adverbials', 'After so/such at the start: So great was the noise that... Such was her fear that... After rarely, little, seldom: Rarely does she go. Place/direction adverbials: Into the room walked the manager; Down came the rain. No inversion with pronoun subjects: Here he comes.', 'Used in formal, literary and dramatic writing.', 'Little did he know that the police were watching.', '"Rarely she goes" → Rarely does she go.'),
  T('c2-front', 'c2-u2', 'Fronting and information structure', 'Concession with as/though: Strange though it may seem...; Tired as she was...; Much as I admire her... Topicalisation: This film I have seen twice (no repeated pronoun). Put new or long information last (end-weight).', 'Fronting creates contrast and controls what the reader notices first.', 'Tired as she was, she kept working.', '"This film I have seen it twice" → This film I have seen twice.'),
  T('c2-subj2', 'c2-u3', 'Formulaic subjunctives and lest', 'Fixed phrases: Long live...; Be that as it may; Come what may; Suffice it to say; Far be it from me. lest + (should) + base verb: He hid it lest anyone should see.', 'These forms are fixed; learn them as chunks.', 'Come what may, we will not give up.', '"Far be it for me" → Far be it from me.'),
  T('c2-cond', 'c2-u4', 'Conditional nuance', 'Alternatives to if: supposing, provided/providing, on condition that, in the event that/of, but for, were it not for, given that. After in the event that use the present simple.', 'Formal documents prefer in the event of / on condition that.', 'In the event of fire, leave the building.', '"In the event that it will rain" → in the event that it rains.'),
  T('c2-clause', 'c2-u5', 'Complex clause structures', 'Noun clauses as subject (That he lied surprised us). Correlatives: not only...but also (inversion after not only), whether...or. Verbless clauses: When in doubt, ask. Absolute constructions: Weather permitting, we will go; The work finished, we left.', 'Absolute and verbless clauses compress information.', 'Weather permitting, we will eat outside.', '"Not only she won" → Not only did she win.'),
  T('c2-register', 'c2-u6', 'Register and style', 'Formal: whom, preposition + whom, shall, notwithstanding, Latinate verbs (postpone), passives, nominalisation. Informal: contractions, phrasal verbs, stranded prepositions. Headlines use the present tense and short words (PM quits).', 'Match grammar and vocabulary to audience and purpose.', 'To whom should I address the letter?', '"kinda inconclusive" in a formal report → somewhat inconclusive.'),
  T('c2-aspect', 'c2-u7', 'Aspect and tense nuance', 'Historic present for vividness (So I walk in and everyone stops). Future in the past: was about to, was going to, would. Past perfect for earlier background (I hadn\'t seen her for ten years). Stative verbs (know, believe) normally avoid the continuous.', 'Choose tense and aspect to show time relations and attitude.', 'He left in 1990, never knowing he would never return.', '"I am knowing the answer" → I know the answer.'),
  T('c2-stance', 'c2-u8', 'Modality and stance', 'Stance adverbs: arguably, apparently, admittedly, regrettably, frankly. Epistemic must (deduction) vs deontic must (obligation). shall in formal rules. may for concession (He may be clever, but...). Hedges: tend to, appear to, it could be argued that.', 'Stance shows how sure or how committed the writer is.', 'Arguably, this is the best plan we have.', '"tends failing" → tends to fail.'),
  T('c2-ambig', 'c2-u9', 'Ambiguity, punctuation and exceptions', 'Restrictive clauses have no commas (The students who studied passed = only some); non-restrictive clauses use commas (= all). Dangling modifiers: Having finished the report, the manager praised her (wrong). Parallel structure: swimming, cycling and running. fewer + countable; less + uncountable. Between you and me. Data/criteria are plural in formal use.', 'Small punctuation and word-order changes can change meaning.', 'There were fewer mistakes this time.', '"Between you and I" → Between you and me.'),
);
EXERCISES.push(
  ...mk('c2-inv2', [
    ['mcq', 1, 'So great ___ the noise that nobody could sleep.', ['was'], 'So + adjective + be + subject.', ['was', 'it was', 'did']],
    ['mcq', 1, 'Such ___ her fear that she could not speak.', ['was'], 'Such + be + noun phrase.', ['was', 'did', 'had']],
    ['fill', 2, 'Little ___ he know that the police were watching. (do)', ['did'], 'Little + auxiliary + subject.'],
    ['error', 2, 'Which part is wrong? "Rarely she goes to the cinema."', ['she goes'], 'Rarely needs inversion: does she go.', ['Rarely', 'she goes', 'to the cinema']],
    ['mcq', 2, 'Into the room ___ the manager.', ['walked'], 'Direction adverbial + verb + noun subject.', ['walked', 'did he walk', 'was walked']],
    ['fill', 3, 'Only when the lights went out ___ I notice the noise. (do)', ['did'], 'Only when + auxiliary + subject.'],
  ]),
  ...mk('c2-front', [
    ['mcq', 1, '___ it may seem, he has never been abroad.', ['strange though'], 'Adjective + though/as = concession.', ['Strange though', 'Strangely that', 'Though strangely']],
    ['mcq', 1, 'Much ___ I admire her, I cannot agree.', ['as'], 'Much as = although very much.', ['as', 'that', 'so']],
    ['fill', 2, 'Tired ___ she was, she kept working.', ['as'], 'Adjective + as + subject.'],
    ['error', 2, 'Which part is wrong? "This film I have seen it twice."', ['it'], 'A fronted object is not repeated.', ['This film I have seen', 'it', 'twice']],
    ['mcq', 2, 'Which sentence fronts the object for contrast?', ['Pizza I like, but pasta I hate.'], 'The objects come first.', ['Pizza I like, but pasta I hate.', 'I like pizza but I hate pasta.', 'Pizza do I like.']],
    ['fill', 3, 'Try ___ I might, I could not open it.', ['as'], 'Try as I might = however hard I try.'],
  ]),
  ...mk('c2-subj2', [
    ['mcq', 1, 'Long ___ the king!', ['live'], 'Formulaic subjunctive: live.', ['live', 'lives', 'living']],
    ['mcq', 1, '___ that as it may, we must continue.', ['be'], 'Fixed phrase: Be that as it may.', ['Be', 'Is', 'Being']],
    ['fill', 2, 'He hid the letter lest anyone ___ see it. (modal)', ['should'], 'lest + should + base verb.'],
    ['error', 2, 'Which part is wrong? "Far be it for me to criticise."', ['for me'], 'The fixed phrase is Far be it from me.', ['Far be it', 'for me', 'to criticise']],
    ['mcq', 2, 'He talks about Rome as if he ___ there. (he never went)', ['had been'], 'Unreal past: past perfect.', ['had been', 'has been', 'will be']],
    ['fill', 3, 'Come what ___, we will not give up.', ['may'], 'Fixed phrase: come what may.'],
  ]),
  ...mk('c2-cond', [
    ['mcq', 1, '___ of fire, leave the building immediately.', ['in the event'], 'In the event of + noun.', ['In the event', 'At the event', 'By the event']],
    ['mcq', 1, '___ you won a million, what would you do?', ['supposing'], 'Supposing = what if.', ['Supposing', 'Provided', 'Unless']],
    ['fill', 2, 'You may enter ___ condition that you sign in.', ['on'], 'on condition that.'],
    ['error', 2, 'Which part is wrong? "In the event that it will rain, the match is cancelled."', ['it will rain'], 'Use the present simple: it rains.', ['In the event that', 'it will rain', 'the match is cancelled']],
    ['mcq', 2, 'If it ___ not for her support, he would be lost today.', ['were'], 'were it not for = but for.', ['were', 'had been', 'would be']],
    ['fill', 3, '___ that the data is accurate, the conclusion follows. (given)', ['given'], 'Given that = since it is true that.'],
  ]),
  ...mk('c2-clause', [
    ['mcq', 1, '___ permitting, we will have the picnic outside.', ['weather'], 'Absolute construction: noun + participle.', ['Weather', 'Weathering', 'Weathered']],
    ['mcq', 1, 'The work ___, we went home.', ['finished'], 'Absolute construction with a past participle.', ['finished', 'finishing', 'to finish']],
    ['fill', 2, '___ in doubt, ask. (verbless clause)', ['when'], 'When in doubt = when you are in doubt.'],
    ['error', 2, 'Which part is wrong? "Not only she won, but she also set a record."', ['she won'], 'Not only needs inversion: did she win.', ['Not only', 'she won', 'but she also set a record']],
    ['mcq', 2, '___ he lied surprised everyone.', ['that'], 'Noun clause as subject: that.', ['That', 'What', 'Which']],
    ['fill', 3, 'Whether you stay ___ leave is up to you.', ['or'], 'whether ... or.'],
  ]),
  ...mk('c2-register', [
    ['mcq', 1, 'Choose the most formal sentence.', ['To whom should I address the letter?'], 'Preposition + whom is formal.', ['To whom should I address the letter?', 'Who should I address the letter to?', 'Who do I send the letter to?']],
    ['mcq', 1, 'We will ___ the meeting. (formal verb)', ['postpone'], 'postpone is more formal than put off.', ['postpone', 'put off', 'call off']],
    ['fill', 2, 'The tenant ___ pay rent monthly. (legal obligation)', ['shall'], 'shall in legal documents.'],
    ['error', 2, 'Which word is out of register in this formal report? "The findings are kinda inconclusive."', ['kinda'], 'Use somewhat or rather.', ['The findings are', 'kinda', 'inconclusive']],
    ['mcq', 2, 'Newspaper headline for "The prime minister has resigned":', ['PM quits'], 'Headlines use present tense and short words.', ['PM quits', 'The prime minister has been resigned', 'PM was quitted']],
    ['fill', 3, 'The contract stays valid, ___ the delay. (formal word for "despite")', ['notwithstanding'], 'notwithstanding = despite.'],
  ]),
  ...mk('c2-aspect', [
    ['mcq', 1, 'He was about ___ leave when the phone rang.', ['to'], 'be about to + base verb.', ['to', 'for', 'at']],
    ['mcq', 1, 'Yesterday I met an old friend. I ___ her for ten years.', ['hadn\'t seen'], 'Earlier than the past event: past perfect.', ['hadn\'t seen', 'didn\'t see', 'haven\'t seen']],
    ['fill', 2, 'He left in 1990, never knowing he ___ never return.', ['would'], 'Future in the past: would.'],
    ['error', 2, 'Which part is wrong? "I am knowing the answer."', ['am knowing'], 'know is a stative verb: I know.', ['I', 'am knowing', 'the answer']],
    ['mcq', 2, 'So I ___ into the room and everyone stops talking.', ['walk'], 'Historic present keeps one tense.', ['walk', 'walked', 'have walked']],
    ['fill', 3, 'By 2010 she ___ been working there for ten years.', ['had'], 'past perfect continuous: had been + -ing.'],
  ]),
  ...mk('c2-stance', [
    ['mcq', 1, '___, the plan is the best we have. (it can be argued)', ['arguably'], 'arguably = it can be argued.', ['Arguably', 'Apparently', 'Regrettably']],
    ['mcq', 1, '___ she has left; her desk is empty.', ['apparently'], 'Apparently = it seems from evidence.', ['Apparently', 'Frankly', 'Admittedly']],
    ['fill', 2, 'He ___ be clever, but he is not wise. (concession)', ['may'], 'may + but = concession.'],
    ['error', 2, 'Which part is wrong? "The policy tends failing in rural areas."', ['failing'], 'tend + to-infinitive.', ['The policy tends', 'failing', 'in rural areas']],
    ['mcq', 2, 'Which is about obligation, not deduction? "You ___ wear a seatbelt."', ['must'], 'Deontic must = obligation.', ['must', 'must be', 'may be']],
    ['fill', 3, 'The committee ___ meet at least monthly. (formal rule; starts with s)', ['shall'], 'shall in formal rules.'],
  ]),
  ...mk('c2-ambig', [
    ['mcq', 1, 'Which sentence means ALL the students passed?', ['The students, who studied, passed.'], 'Commas make the clause non-restrictive.', ['The students, who studied, passed.', 'The students who studied passed.', 'Students who studied passed.']],
    ['mcq', 1, 'She likes swimming, cycling and ___.', ['running'], 'Keep -ing forms parallel.', ['running', 'to run', 'run']],
    ['fill', 2, 'There were ___ mistakes this time than last time. (fewer/less)', ['fewer'], 'fewer + countable noun.'],
    ['error', 2, 'Which part is wrong? "Between you and I, the plan will fail."', ['I'], 'After a preposition use me.', ['Between you and', 'I', 'the plan will fail']],
    ['mcq', 2, 'Which sentence has a dangling modifier?', ['Having finished the report, the manager praised her.'], 'The manager did not finish the report.', ['Having finished the report, the manager praised her.', 'Having finished the report, she was praised by the manager.', 'After finishing the report, she left.']],
    ['fill', 3, 'The criteria ___ clear. (be, formal plural)', ['are'], 'Criteria is the plural of criterion.'],
  ]),
);

// Sentence-construction (order) and transformation (transform) exercises, added as extra practice items.
const scramble = (w: string[]) => { const r = [...w].sort((a, b) => ((a.length * 7 + a.charCodeAt(0)) % 11) - ((b.length * 7 + b.charCodeAt(0)) % 11)); return r.join(' ') === w.join(' ') ? r.reverse() : r; };
const ORD = (topicId: string, n: number, difficulty: 1 | 2 | 3, sentence: string, explanation: string, alts: string[] = []): Exercise => ({
  id: `${topicId}-o${n}`, topicId, type: 'order', difficulty, prompt: 'Put the words in the correct order.', explanation,
  options: scramble(sentence.replace(/[.?!]$/, '').split(' ').map((w) => (w === 'I' ? w : w.toLowerCase()))), accepted: [sentence, ...alts] });
const TR = (topicId: string, n: number, difficulty: 1 | 2 | 3, prompt: string, accepted: string[], explanation: string): Exercise =>
  ({ id: `${topicId}-t${n}`, topicId, type: 'transform', difficulty, prompt, accepted, explanation });
EXERCISES.push(
  ORD('a1-be-aff', 1, 1, 'She is not a teacher.', 'Subject + be + not + noun phrase.'),
  TR('a1-be-aff', 2, 1, 'Make it negative: I am happy.', ['I am not happy', 'I\'m not happy'], 'Add not after am.'),
  ORD('a1-ps-3s', 1, 2, 'She watches television every evening.', 'Third person: verb + -es.', ['Every evening she watches television.']),
  TR('a1-ps-3s', 2, 2, 'Change "I" to "he": I play football every day.', ['He plays football every day'], 'Add -s to the verb.'),
  ORD('a1-pc', 1, 1, 'They are playing in the garden.', 'be + verb-ing + place.'),
  TR('a1-pc', 2, 2, 'Make a question: She is reading a book.', ['Is she reading a book'], 'Put "is" before the subject.'),
  ORD('a2-past', 1, 2, 'Did you see the film last night?', 'Did + subject + base verb.'),
  TR('a2-past', 2, 2, 'Make it negative: She went to school.', ['She didn\'t go to school', 'She did not go to school'], 'didn\'t + base verb.'),
  ORD('a2-future', 1, 2, 'I am going to visit my aunt tomorrow.', 'going to + base verb.', ['Tomorrow I am going to visit my aunt.']),
  TR('a2-future', 2, 2, 'Rewrite with going to: It will rain.', ['It is going to rain', 'It\'s going to rain'], 'going to for predictions with evidence.'),
  ORD('a2-comp', 1, 2, 'This bag is cheaper than that one.', 'Comparative + than.'),
  TR('a2-comp', 2, 3, 'Rewrite with a comparative: My car is not as fast as yours.', ['Your car is faster than mine', 'Your car is faster than my car'], 'Reverse the comparison: not as fast as = slower than.'),
  ORD('b1-passive', 1, 2, 'The window was broken by the storm.', 'was + participle + by-agent.'),
  TR('b1-passive', 2, 3, 'Make it passive: They built the bridge in 1990.', ['The bridge was built in 1990', 'The bridge was built in 1990 by them'], 'The object becomes the subject: was + participle.'),
  ORD('b1-reported', 1, 2, 'She said that she was tired.', 'Backshift: am → was.'),
  TR('b1-reported', 2, 3, 'Report it: "I like pizza," he said.', ['He said he liked pizza', 'He said that he liked pizza'], 'Backshift: like → liked.'),
  ORD('b1-cond', 1, 2, 'I would travel the world if I were rich.', 'Second conditional: would + base verb ... if + were.'),
  TR('b1-cond', 2, 3, 'Rewrite with unless: You will be late if you do not hurry.', ['You will be late unless you hurry'], 'unless = if not.'),
  ORD('b2-cond2', 1, 3, 'I would have helped if I had known.', 'Third conditional: would have + participle ... if + past perfect.'),
  TR('b2-cond2', 2, 3, 'Rewrite as a third conditional: I did not study, so I failed.', ['If I had studied, I would not have failed', 'If I had studied I would not have failed', 'If I had studied, I wouldn\'t have failed', 'If I had studied I wouldn\'t have failed'], 'if + past perfect, would have + participle.'),
  ORD('b2-passive2', 1, 3, 'I had my car repaired yesterday.', 'Causative: have + object + participle.', ['Yesterday I had my car repaired.']),
  TR('b2-passive2', 2, 3, 'Use the causative: A mechanic repaired my car.', ['I had my car repaired', 'I had my car repaired by a mechanic'], 'have + object + participle.'),
  ORD('c1-inv', 1, 3, 'Never have I seen such a mess.', 'Negative adverbial first: auxiliary + subject.'),
  TR('c1-inv', 2, 3, 'Begin with Hardly: We had left when it began to rain.', ['Hardly had we left when it began to rain'], 'Hardly + had + subject + participle.'),
  ORD('c1-cond', 1, 3, 'Had I known, I would have helped.', 'Inverted third conditional.'),
  TR('c1-cond', 2, 3, 'Rewrite with inversion: If you should need help, call me.', ['Should you need help, call me'], 'Should + subject replaces if.'),
  ORD('c2-inv2', 1, 3, 'So great was the noise that nobody slept.', 'So + adjective + be + subject.'),
  TR('c2-inv2', 2, 3, 'Begin with Little: He did not know that she was watching.', ['Little did he know that she was watching'], 'Little + did + subject + base verb.'),
);

/** Look up exercises by id, skipping ids that no longer exist (content may change between releases). */
export const exercisesByIds = (ids: string[]) => ids.map((id) => EXERCISES.find((e) => e.id === id)).filter((e): e is Exercise => !!e);

export const levelOfExercise = (e: Exercise): Level | undefined => UNITS.find((u) => u.topicIds.includes(e.topicId))?.level;

/** Placement test: up to 4 items per level, spread across that level's topics, ordered A1 to C2. */
export function buildPlacementTest(perLevel = 4): Exercise[] {
  return LEVELS.flatMap((l) => {
    const pool = UNITS.filter((u) => u.level === l).flatMap((u) => u.topicIds)
      .map((id) => exercisesFor(id, 'practice')[1]).filter((e): e is Exercise => !!e);
    const n = Math.min(perLevel, pool.length);
    return Array.from({ length: n }, (_, k) => pool[Math.floor((k * pool.length) / n)]);
  });
}
