import { compose } from "redux";
import { createSelector } from "reselect";
import {
  selectBank,
  selectOccurencesByRoot,
  selectVerseWords,
} from "../ducks/bank";
import { RootState } from "../ducks/root";
import { selectGuess } from "../ducks/textarea";
import { commonLength } from "../utils/commonLength";
import { Occurrence } from "../utils/occurences";
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

const selectPossibleRefsTyping = createSelector(
  [selectRefOccurencesToFind, selectGuess, selectFoundRefs, selectBank],
  (refOccurences, guess, found, bank) => {
    if (!refOccurences.length) return [];
    let winningRefs: string[] = [];
    let hiScore: number = 0;
    for (let [ref] of refOccurences) {
      if (found.includes(ref)) continue;
      const score = commonLength(bank[ref], guess);
      if (score < hiScore) continue;
      if (score === hiScore) winningRefs.push(ref);
      if (score > hiScore) {
        hiScore = score;
        winningRefs = [ref];
      }
    }
    console.log(winningRefs);
    return winningRefs;
  }
);
export const selectPossibleAnswer = (state: RootState) =>
  selectBank(state)[selectPossibleRefsTyping(state)[0]];

export const unique = <T>(thing: T[]): T[] => Array.from(new Set(thing));
export const selectFindAnswers = createSelector(
  [selectOccurencesToFind, selectAnswerType, selectBank],
  (occurences, answerType, bank) =>
    unique(
      occurences?.map((occurrence) => {
        if (answerType === "ref") return occurrence.ref;
        return bank[occurrence.ref];
      })
    )
);

export function nextFindGame(game: FindGame, state: RootState): FindGame {
  const found = game.found.slice();
  const completed = selectPossibleRefsTyping(state);
  completed.forEach((ref) => found.push(ref));
  const toFind = selectRefOccurencesToFind(state);
  console.log(found, toFind);
  if (found.length < toFind.length) return { ...game, found };
  const nextGame = refreshFindGame(game, state);
  return { ...nextGame, found: [] };
  // const bank = selectBank(state);
  // const allOccurences = occurencesByRoot(bank);
  // const words = allVerseWords(Object.values(bank));
  // const word = words[game.questionIndex];
  // const occurences = allOccurences[rootWord(word)];
  // const guess = selectGuess(state);

  // if guess isn't correct then just pretend they're all done?
  // find ref for the guess and add it to found
  // find full list of refs
  // if found is full move on else carry on
}
function nextFindSet(game: FindGame, state: RootState): FindGame {
  if (game.order === "random") {
    const words = selectVerseWords(state);
    if (words.length === 0) return game;
    if (game.queue.length > 0) {
      const queue = game.queue.slice();
      const index = Math.floor(Math.random() * queue.length);
      const newWord = queue.splice(index, 1)[0];
      const questionIndex = words.indexOf(newWord);
      console.log(game, newWord, questionIndex, queue, words);
      return { ...game, questionIndex, queue };
    } else {
      while (true) {
        const questionIndex = Math.floor(Math.random() * words.length);
        const root = rootWord(words[questionIndex]);
        const count = words.reduce(
          (acc, word) => (rootWord(word) === root ? acc + 1 : acc),
          0
        );
        if (count < 10) return { ...game, questionIndex };
        console.log("Skipping '" + root + "' with count:", count);
      }
    }
  }
  const questionIndex = game.questionIndex + 1;
  return { ...game, questionIndex };
}
export const refreshFindGame = nextFindSet;
// From the page you should be able to add your own words
// also click on words to add them to the queue would be cool
// Seeing the word queue and "x" to remove them would be cool

// Do we want next question to move to the next word in the verse?
// Yes - it wouldn't make sense to go back or forward in the queue

// Object.entries(occurencesByRoot(bank))
//   .filter(
//     ([root, occurences]) => occurences.length > 1 && occurences.length < 5
//   )
//   .forEach(([root, occurences]) => console.log(root, occurences));
