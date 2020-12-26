export interface Question {
  id: string;
  clue: string;
  answer: string;
  reversible?: boolean;
  // Can add stats for each question
}

type Index = number;
export interface QueueSection {
  id: string;
  bank: Question[];
  start: Index;
  end: Index;
}
