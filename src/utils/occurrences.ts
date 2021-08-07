import { rootWord } from "./rootWord";

export interface Occurrence {
  ref: string;
  word: string;
  root: string;
  index: number;
}

const wordRegex = /\w+/g;
const filterRegex = /^s$/;

export function occurrencesByRoot(bank: { [ref: string]: string }): {
  [root: string]: Occurrence[];
} {
  const matches: { [root: string]: Occurrence[] } = {};
  for (let ref in bank) {
    const verse = bank[ref];
    for (let match of verse.matchAll(wordRegex)) {
      const { 0: word, index = 1337 } = match;
      if (filterRegex.test(word)) continue;
      const root = rootWord(word);
      if (!matches[root]) matches[root] = [];
      matches[root].push({ ref, word, root, index });
    }
  }
  return matches;
}
export function verseWords(verse: string = "", addTo: string[] = []): string[] {
  for (let match of verse.matchAll(wordRegex)) {
    if (filterRegex.test(match[0])) continue;
    addTo.push(match[0]);
  }
  return addTo;
}
export function allVerseWords(verses: string[]): string[] {
  const words: string[] = [];
  verses.forEach((verse) => verseWords(verse, words));
  return words;
}
