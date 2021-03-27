import { FindGame, nextFindGame, refreshFindGame } from "../games/FindGame";
import {
  nextRecallGame,
  RecallGame,
  refreshRecallGame,
} from "../games/RecallGame";
import { selectQuestionIds, selectVerseWords } from "./bank";
import {
  Action,
  CHOOSE_GAME,
  FINISH_QUESTION,
  INCREASE_QUESTION,
  RootState,
  SKIP_QUESTION,
} from "./root";

export interface GameCommon {
  completed: number;
  completedGoal: number;
}
export type GameState = RecallGame | FindGame;

export const initialState: FindGame = {
  type: "find",
  completed: 0,
  completedGoal: 3,
  order: "random",
  answerType: "text",
  hintType: "text",
  questionIndex: 0,
  queue: [],
  found: [],
};

export function gameReducer(
  game: GameState = initialState,
  action: Action,
  state: RootState
): GameState {
  switch (action.type) {
    case CHOOSE_GAME:
      if (action.game.type === "recall")
        return refreshRecallGame(action.game, selectQuestionIds(state));
      if (action.game.type === "find")
        return refreshFindGame(action.game, state);
      return game;
    case FINISH_QUESTION:
    case SKIP_QUESTION:
      const skip = action.type === SKIP_QUESTION;
      if (game.type === "recall") return nextRecallGame(game, state, skip);
      if (game.type === "find") return nextFindGame(game, state, skip);
      return game;
    case INCREASE_QUESTION: {
      const newIndex = game.questionIndex + action.amount;
      const maxIndex =
        game.type === "find"
          ? selectVerseWords(state).length
          : selectQuestionIds(state).length;
      const questionIndex = Math.min(maxIndex, Math.max(0, newIndex));
      return { ...game, questionIndex };
    }
  }
  return game;
}
