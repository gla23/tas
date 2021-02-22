import { FindGame, nextFindGame, refreshFindGame } from "../games/FindGame";
import {
  nextRecallGame,
  RecallGame,
  refreshRecallGame,
} from "../games/RecallGame";
import { selectQuestionIds, selectVerseWords } from "./bank";
import {
  Action,
  FINISH_QUESTION,
  INCREASE_QUESTION,
  LOAD_BANK,
  RootState,
  SKIP_QUESTION,
} from "./root";

export type GameState = RecallGame | FindGame;
export const initialFindGame: FindGame = {
  type: "find",
  order: "random",
  answerType: "ref",
  hintType: "text",
  questionIndex: 0,
  queue: [],
  found: [],
};
// initialRecallGame
const initialState: GameState = initialFindGame;

export function gameReducer(
  game: GameState = initialState,
  action: Action,
  state: RootState
): GameState {
  switch (action.type) {
    case LOAD_BANK:
      if (game.type === "recall")
        return refreshRecallGame(game, selectQuestionIds(state));
      if (game.type === "find") return refreshFindGame(game, state);
      return game;
    case FINISH_QUESTION:
    case SKIP_QUESTION:
      if (game.type === "recall") return nextRecallGame(game, state);
      if (game.type === "find") return nextFindGame(game, state);
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
