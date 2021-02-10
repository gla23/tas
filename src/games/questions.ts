export interface Question {
  id: string;
  clue: string;
  answer: string;
  reversible?: boolean;
  // Can add stats for each question
}

export interface QueueSection {
  id: string;
  bank: Question[];
  startIndex: number;
  endIndex: number;
}

interface BaseExercise {
  id: string;
}
interface MatchTextExercise extends BaseExercise {
  type: "matchText";
}

export type Exercise = MatchTextExercise;
