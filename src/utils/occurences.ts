import { rootWord } from "./rootWord";

export interface Occurrence {
  ref: string;
  word: string;
  root: string;
  index: number;
}

export function occurencesByRoot(bank: {
  [ref: string]: string;
}): {
  [root: string]: Occurrence[];
} {
  const matches: { [root: string]: Occurrence[] } = {};
  for (let ref in bank) {
    const verse = bank[ref];
    for (let match of verse.matchAll(/\w+/g)) {
      const { 0: word, index = 1337 } = match;
      const root = rootWord(word);
      if (!matches[root]) matches[root] = [];
      matches[root].push({ ref, word, root, index });
    }
  }
  return matches;
}

export function allVerseWords(verses: string[]): string[] {
  const words: string[] = [];
  verses.forEach((verse) => {
    for (let match of verse.matchAll(/\w+/g)) {
      words.push(match[0]);
    }
  });
  return words;
}
