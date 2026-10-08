export type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
export type ExType = 'fill' | 'mcq' | 'error' | 'order' | 'transform'; // error: tap the wrong segment; order: build the sentence from word tiles; transform: rewrite a sentence
export interface Exercise { id: string; topicId: string; type: ExType; difficulty: 1 | 2 | 3; prompt: string; options?: string[]; accepted: string[]; explanation: string; checkpoint?: boolean }
export interface Topic { id: string; unitId: string; title: string; form: string; use: string; examples: string[]; mistakes: string[] }
export interface Unit { id: string; level: Level; title: string; topicIds: string[] }
export interface TopicProgress { topicId: string; status: 'not_started' | 'in_progress' | 'completed'; mastery: number; checkpointBest?: number; lastStudiedAt?: string }
export interface Attempt { id: string; exerciseId: string; topicId: string; given: string; correct: boolean; hintsUsed: number; ms: number; at: string }
export interface ItemState { exerciseId: string; intervalDays: number; dueAt: string; lapses: number }
export interface ProgressData { schemaVersion: 1; placementLevel?: Level; topics: Record<string, TopicProgress>; attempts: Attempt[]; items: Record<string, ItemState> }
