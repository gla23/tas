import {
  Action,
  RootState,
  LOAD_BANK,
  questionSet,
  FINISH_QUESTION,
  SKIP_QUESTION,
  INCREASE_QUESTION,
} from "./root";
import {
  RecallGame,
  refreshRecallGame,
  nextRecallGame,
  initialRecallGame,
} from "../games/RecallGame";
import { FindGame } from "./FindGame";

export const initialGameState: GameState = initialRecallGame;
export type GameState = RecallGame | FindGame;

export function gameReducer(
  game: GameState,
  action: Action,
  state: RootState
): GameState {
  switch (action.type) {
    case LOAD_BANK:
      const set = questionSet(state);
      if (game.type === "recall") return refreshRecallGame(game, set);
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
