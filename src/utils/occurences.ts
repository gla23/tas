import { rootWord } from "./rootWord";

interface Occurence {
  ref: string;
  word: string;
  root: string;
  index: number;
}

export function occurencesByRoot(bank: {
  [ref: string]: string;
}): {
  [root: string]: Occurence[];
} {
  const matches: { [root: string]: Occurence[] } = {};
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
