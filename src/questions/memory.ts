import { Passage } from "bible-tools";
import { Question } from "./questions";

export interface MemoryBank {
  [index: string]: string;
}

export const memory: Promise<MemoryBank> = fetch("/tas/memory.txt")
  .then((response) => response.text())
  .then((text) =>
    text.split("\n").reduce((acc: MemoryBank, line, i, lines) => {
      if (i % 2 === 0) acc[line] = lines[i + 1];
      return acc;
    }, {})
  );

export function toQuestions(
  bank: MemoryBank,
  parseMnemonics: boolean
): Question[] {
  return Object.keys(bank).map((mnemonic) => ({
    id: mnemonic,
    clue: parseMnemonics ? new Passage(mnemonic).reference : mnemonic,
    answer: bank[mnemonic],
  }));
}
