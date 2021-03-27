import { Passage } from "bible-tools";
import { createSelector } from "reselect";
import { selectBank, selectQuestionIds } from "../ducks/bank";
import { GameCommon } from "../ducks/game";
import { RootState } from "../ducks/root";
import { selectSetting } from "../ducks/settings";

export interface RecallGame extends GameCommon {
  type: "recall";
  order: "next" | "random" | "same";
  questionIndex: number;
  setIndexesLeft: number[];
  inOrderCount: number;
  inOrderDone: number;
}

export function refreshRecallGame(game: RecallGame, set: string[]): RecallGame {
  const indexesLeft = set.slice(1).map((id, i) => i);
  const randomIndex = Math.floor(Math.random() * indexesLeft.length);
  const randomElem = indexesLeft.splice(randomIndex, 1)[0];
  return {
    type: "recall",
    completed: 0,
    completedGoal: game.completedGoal,
    order: game.order,
    inOrderCount: game.inOrderCount,
    setIndexesLeft: indexesLeft,
    inOrderDone: 0,
    questionIndex: game.order === "random" ? randomElem : game.questionIndex,
  };
}
export function nextRecallGame(
  game: RecallGame,
  state: RootState,
  skip: boolean
): RecallGame {
  const completed = game.completed + (skip ? 0 : 1);
  if (game.order === "same") return { ...game, completed };
  const set = selectQuestionIds(state);
  const bounded = (index: number) =>
    Math.max(0, Math.min(set.length - 1, index));
  const { inOrderCount, inOrderDone, questionIndex: previous } = game;
  if (inOrderDone < inOrderCount - 1) {
    const newIndex = game.order === "random" ? previous + 1 : previous;
    return {
      ...game,
      completed,
      inOrderDone: inOrderDone + 1,
      questionIndex: bounded(newIndex),
    };
  }
  if (game.order === "next")
    return {
      ...game,
      completed,
      inOrderDone: 0,
      questionIndex: bounded(previous + 1),
    };
  const setIndexesLeft =
    game.setIndexesLeft && game.setIndexesLeft.length
      ? game.setIndexesLeft
      : set.slice(1).map((id, i) => i);
  const random = Math.floor(Math.random() * setIndexesLeft.length);
  const newSetIndexesLeft = setIndexesLeft.slice();
  const randomId = newSetIndexesLeft.splice(random, 1)[0];
  return {
    ...game,
    completed,
    setIndexesLeft: newSetIndexesLeft,
    inOrderDone: 0,
    questionIndex: randomId,
  };
}

export const selectRecallClue = createSelector(
  [
    selectBank,
    (state: RootState) => state.game.questionIndex,
    selectSetting("parseMnemonics"),
  ],
  (bank, questionIndex, parse) => {
    const id = Object.keys(bank)[questionIndex];
    return id && parse ? new Passage(id).reference : id;
  }
);
export const recallAnswer = (state: RootState): string => {
  const set = selectQuestionIds(state);
  if (state.game.type !== "recall")
    throw new Error("recallAnswer only works for recall games");
  const id = set[state.game.questionIndex];
  return state.bank[id] || "";
};
