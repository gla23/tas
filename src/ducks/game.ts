import {
  QuizAction,
  QuizState,
  LOAD_BANK,
  questionSet,
  FINISH_QUESTION,
  SKIP_QUESTION,
  INCREASE_QUESTION,
} from "./quiz";
import {
  RecallGame,
  initRecallGame,
  nextRecallGame,
} from "../games/RecallGame";

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
