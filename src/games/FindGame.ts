import { Passage } from "bible-tools";
import { compose } from "redux";
import { createSelector } from "reselect";
import {
  selectBank,
  selectOccurencesByRoot,
  selectVerseWords,
} from "../ducks/bank";
import { selectGameType } from "../ducks/gameSelectors";
import { RootState } from "../ducks/root";
import { selectSetting } from "../ducks/settings";
import { selectGuess } from "../ducks/textarea";
import { commonLength } from "../utils/commonLength";
import { Occurrence } from "../utils/occurrences";
import { rootWord } from "../utils/rootWord";

type ID = string;
type AnswerType = "ref" | "text";
export interface FindGame {
  type: "find";
  order: "random" | "next";
  answerType: AnswerType;
  hintType: AnswerType;
  questionIndex: number;
  queue: string[];
  found: ID[];
}

export const selectAnswerType = (state: RootState): AnswerType => {
  return state.game.type === "find" ? state.game.answerType : "text";
};
export const selectHintType = (state: RootState): AnswerType => {
  return state.game.type === "find" ? state.game.hintType : "text";
};
const selectCurrentWord = createSelector(
  [(state: RootState) => state.game.questionIndex, selectVerseWords],
  (questionIndex, verseWords) => verseWords[questionIndex] || ""
);
export const selectFindClue = compose(rootWord, selectCurrentWord);

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

export function nextFindGame(game: FindGame, state: RootState): FindGame {
  const found = game.found.slice();
  const completed = selectPossibleRefsTyping(state);
  completed.forEach((ref) => found.push(ref));
  const toFind = selectRefOccurencesToFind(state);

  if (found.length < toFind.length) return { ...game, found };

  const nextGame = nextFindSet(game, state);
  return { ...nextGame, found: [] };
}

function nextFindSet(game: FindGame, state: RootState): FindGame {
  const words = selectVerseWords(state);
  if (words.length === 0) return game;
  if (game.queue.length > 0) {
    const queue = game.queue.slice();
    const index =
      game.order === "random" ? Math.floor(Math.random() * queue.length) : 0;
    const newWord = queue.splice(index, 1)[0];
    const questionIndex = words.indexOf(newWord);
    return { ...game, questionIndex, queue };
  }
  if (game.order === "random") {
    let i = 0;
    while (++i) {
      const questionIndex = Math.floor(Math.random() * words.length);
      const root = rootWord(words[questionIndex]);
      const count = words.reduce(
        (acc, word) => (rootWord(word) === root ? acc + 1 : acc),
        0
      );
      if (count < 10 || i > 40) return { ...game, questionIndex };
      console.log("Skipping '" + root + "' with count:", count);
    }
  }
  const questionIndex = game.questionIndex + 1;
  return { ...game, questionIndex };
}
export const refreshFindGame = (game: FindGame, state: RootState): FindGame => {
  if (game.order === "next" && game.queue.length === 0)
    return { ...game, questionIndex: 0 };
  return nextFindSet(game, state);
};
