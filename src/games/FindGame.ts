import { Passage } from "bible-tools";
import { createSelector } from "reselect";
import {
  selectBank,
  selectOccurencesByRoot,
  selectVerseWords,
} from "../ducks/bank";
import { GameCommon } from "../ducks/game";
import { selectGameType } from "../ducks/gameSelectors";
import { RootState } from "../ducks/root";
import { selectSetting } from "../ducks/settings";
import { selectGuess } from "../ducks/textarea";
import { commonLength } from "../utils/commonLength";
import { Occurrence } from "../utils/occurrences";
import { rootWord } from "../utils/rootWord";

type ID = string;
type AnswerType = "ref" | "text";
export interface FindGame extends GameCommon {
  type: "find";
  order: "random" | "next" | "choose";
  answerType: AnswerType;
  hintType: AnswerType;
  questionIndex: number;
  queue: string[];
  found: ID[];
  doRecap: boolean;
  doingRecap?: boolean;
}

export const selectAnswerType = (state: RootState): AnswerType => {
  if (state.game.type !== "find") return "text";
  if (state.game.doingRecap) return "ref";
  return state.game.answerType;
};
export const selectHintType = (state: RootState): AnswerType => {
  return state.game.type === "find" ? state.game.hintType : "text";
};
const selectCurrentWord = createSelector(
  [(state: RootState) => state.game.questionIndex, selectVerseWords],
  (questionIndex, verseWords) => verseWords[questionIndex] || ""
);
export const selectFindClue = (state: RootState): string => {
  const game = state.game;
  if (game.type !== "find") return "";
  if (game.order === "choose" && game.questionIndex === -1)
    return "words to find";
  const currentWord = selectCurrentWord(state);
  const root = rootWord(currentWord);
  const prefix = game.doingRecap ? "recap " : "";
  return prefix + root;
};

export const selectOccurencesToFind = (state: RootState): Occurrence[] => {
  const allOccurences = selectOccurencesByRoot(state);
  const word = selectCurrentWord(state);
  return allOccurences[rootWord(word)] || [];
};

export const selectRefOccurencesToFind = createSelector(
  selectOccurencesToFind,
  (occurences) => {
    const occs: { [ref: string]: Occurrence[] } = {};
    for (let occ of occurences) {
      occs[occ.ref] ||= [];
      occs[occ.ref].push(occ);
    }
    return Object.entries(occs);
  }
);

export const selectFoundRefs = (state: RootState) =>
  state.game.type === "find" ? state.game.found : [];

export const selectAnswerOfRef = (state: RootState) => {
  const gameType = selectGameType(state);
  const bank = selectBank(state);
  const answerType = selectAnswerType(state);
  if (gameType === "recall" || answerType === "text")
    return (ref: string) => bank[ref];
  const parse = selectSetting("parseMnemonics")(state);
  return (ref: string) => (parse ? new Passage(ref).reference : ref);
};

const selectPossibleRefsTyping = createSelector(
  [selectRefOccurencesToFind, selectGuess, selectAnswerOfRef, selectFoundRefs],
  (refOccurences, guess, answerOf, found) => {
    if (!refOccurences.length) return [];
    let winningRefs: string[] = [];
    let hiScore: number = 0;
    for (let [ref] of refOccurences) {
      if (found.includes(ref)) continue;
      const score = commonLength(answerOf(ref), guess);
      if (score < hiScore) continue;
      if (score === hiScore) winningRefs.push(ref);
      if (score > hiScore) {
        hiScore = score;
        winningRefs = [ref];
      }
    }
    return winningRefs;
  }
);

export const selectPossibleAnswer = (state: RootState): string => {
  const ref = selectPossibleRefsTyping(state)[0];
  if (!ref) return "";
  return selectAnswerOfRef(state)(ref);
};

export function nextFindGame(
  game: FindGame,
  state: RootState,
  skip: boolean,
  data: unknown
): FindGame {
  if (game.order === "choose" && game.questionIndex === -1) {
    if (!Array.isArray(data)) throw new Error("hmm");
    const newGame = { ...game, queue: data as string[] };
    return nextFindSet(newGame, state);
  }
  const found = game.found.slice();
  const completedRefs = selectPossibleRefsTyping(state);
  completedRefs.forEach((ref) => found.push(ref));
  const toFind = selectRefOccurencesToFind(state);

  if (found.length < toFind.length) return { ...game, found };

  if (game.doRecap && !game.doingRecap)
    return { ...game, found: [], doingRecap: true };

  const nextGame = nextFindSet({ ...game, doingRecap: false }, state);
  const completed = game.completed + (skip ? 0 : 1);
  return { ...nextGame, completed, found: [] };
}

function nextFindSet(game: FindGame, state: RootState): FindGame {
  const words = selectVerseWords(state);
  const allOccurences = selectOccurencesByRoot(state);
  if (words.length === 0) return game;
  if (game.queue.length > 0) {
    const queue = game.queue.slice();
    const index =
      game.order === "random" ? Math.floor(Math.random() * queue.length) : 0;
    const newWord = queue.splice(index, 1)[0];
    const occurences = allOccurences[rootWord(newWord)];
    const questionIndex = words.indexOf(occurences[0].word);
    if (questionIndex === undefined)
      console.error("Didn't find index for ", newWord, occurences, state);
    return { ...game, questionIndex, queue };
  }
  const questionIndex =
    game.order === "random"
      ? chooseDecentWord(allOccurences, []).index
      : game.order === "choose"
      ? -1
      : game.questionIndex + 1;
  return { ...game, questionIndex };
}
export const refreshFindGame = (game: FindGame, state: RootState): FindGame => {
  if (game.order === "next" && game.queue.length === 0)
    return { ...game, questionIndex: 0, completed: 0 };
  return { ...nextFindSet(game, state), completed: 0 };
};

export interface WordOccurence {
  index: number;
  root: string;
  count: number;
}
export const chooseDecentWord = (
  occurences: { [root: string]: Occurrence[] },
  excluding: string[]
): WordOccurence => {
  const roots = Object.keys(occurences);
  let i = 0;
  while (true) {
    i = i + 1;
    const rootIndex = Math.floor(Math.random() * roots.length);
    const root = roots[rootIndex];
    if (root === undefined) console.error("hmm", occurences, rootIndex);
    const count = occurences[root].length;
    const index = occurences[root][0].index;
    if (i > 10) return { index, root, count };
    if (excluding.includes(root)) continue;
    if (count > 14) {
      console.log("Skipping '" + root + "' with count:", count);
      excluding.push(root);
      continue;
    }
    return { index, root, count };
  }
};

export const findGameDescription = (
  game: FindGame,
  state: RootState
): string => {
  const type = game.answerType === "text" ? "verses" : "verse references";
  const recap = game.doRecap ? " and then recap the references" : "";
  return `Type the ${type} within ${state.filter} that the root word occurs in ${recap}`;
};
