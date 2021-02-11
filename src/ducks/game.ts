import {
  QuizAction,
  QuizState,
  LOAD_BANK,
  questionSet,
  FINISH_QUESTION,
  SKIP_QUESTION,
  INCREASE_QUESTION,
} from "./quiz";

export interface RecallGame {
  type: "recall";
  order: "next" | "random" | "same";
  questionIndex: number;
  setIndexesLeft: number[];
  inOrderCount: number;
  inOrderDone: number;
}
export const initialGameState: GameState = {
  questionIndex: 0,
  type: "recall",
  order: "random",
  setIndexesLeft: [],
  inOrderCount: 2,
  inOrderDone: 0,
};
export interface NewGame {
  type: "new";
}
export type GameState = RecallGame | NewGame;
export function gameReducer(
  game: GameState,
  action: QuizAction,
  state: QuizState
): GameState {
  switch (action.type) {
    case LOAD_BANK:
      const set = questionSet(state);
      if (game.type === "recall") return initRecallGame(game, set);
      return game;
    case FINISH_QUESTION:
    case SKIP_QUESTION:
      if (game.type === "recall") return nextRecallGame(game, state);
      return game;
    case INCREASE_QUESTION: {
      if (game.type !== "recall") return game;
      const positive = Math.max(0, game.questionIndex + action.amount);
      const questionIndex = Math.min(questionSet(state).length, positive);
      return { ...game, questionIndex };
    }
  }
  return game;
}
function initRecallGame(game: RecallGame, set: string[]): RecallGame {
  const indexesLeft = set.slice(1).map((id, i) => i);
  const randomIndex = Math.floor(Math.random() * indexesLeft.length);
  const randomElem = indexesLeft.splice(randomIndex, 1)[0];
  return {
    type: "recall",
    order: game.order,
    inOrderCount: game.inOrderCount,
    setIndexesLeft: indexesLeft,
    inOrderDone: 0,
    questionIndex: randomElem,
  };
}
function nextRecallGame(game: RecallGame, state: QuizState): RecallGame {
  if (game.order === "same") return game;
  const set = questionSet(state);
  const bounded = (index: number) =>
    Math.max(0, Math.min(set.length - 1, index));
  const { inOrderCount, inOrderDone, questionIndex: previous } = game;
  if (inOrderDone < inOrderCount - 1) {
    const newIndex = game.order === "random" ? previous + 1 : previous;
    return {
      ...game,
      inOrderDone: inOrderDone + 1,
      questionIndex: bounded(newIndex),
    };
  }
  if (game.order === "next")
    return { ...game, inOrderDone: 0, questionIndex: bounded(previous + 1) };
  const setIndexesLeft =
    game.setIndexesLeft && game.setIndexesLeft.length
      ? game.setIndexesLeft
      : set.slice(1).map((id, i) => i);
  const random = Math.floor(Math.random() * setIndexesLeft.length);
  const newSetIndexesLeft = setIndexesLeft.slice();
  const randomId = newSetIndexesLeft.splice(random, 1)[0];
  return {
    ...game,
    setIndexesLeft: newSetIndexesLeft,
    inOrderDone: 0,
    questionIndex: randomId,
  };
}
