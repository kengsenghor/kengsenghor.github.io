export type QuizItem = {
  id: string;
  prompt: string;
  /** Optional extra context shown under the prompt. */
  detail?: string;
  /** Optional trend to draw as a sparkline. */
  series?: number[];
  unit?: string;
  correct: string;
  rule: string;
  why: string;
};

/** Counts each item once; unanswered or unknown answers are wrong. Total is always the item count. */
export function scoreQuiz(items: QuizItem[], answers: Record<string, string>): { correct: number; total: number } {
  return { correct: items.filter((i) => answers[i.id] === i.correct).length, total: items.length };
}
