import { FindGame, nextFindGame, refreshFindGame } from "../games/FindGame";
import {
  nextRecallGame,
  RecallGame,
  refreshRecallGame,
} from "../games/RecallGame";
import { selectQuestionIds, selectVerseWords } from "./bank";
import { selectComplete } from "./gameSelectors";
import { Action, RootState, ThunkCreator } from "./root";

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

// Actions
export const SKIP_QUESTION = "tas/SKIP_QUESTION";
export const FINISH_QUESTION = "tas/FINISH_QUESTION";
export const INCREASE_QUESTION = "tas/INCREASE_QUESTION";
export const CHOOSE_GAME = "tas/CHOOSE_GAME";
export const CLOSE_GAME = "tas/CLOSE_GAME";
type SkipQuestionAction = { type: typeof SKIP_QUESTION };
type FinishQuestionAction = { type: typeof FINISH_QUESTION };
type IncreaseQuestionAction = {
  type: typeof INCREASE_QUESTION;
  amount: number;
};
type ChooseGameAction = {
  type: typeof CHOOSE_GAME;
  game: GameState;
  filter?: string;
};
type CloseGameAction = { type: typeof CLOSE_GAME };
export type GameAction =
  | ChooseGameAction
  | SkipQuestionAction
  | FinishQuestionAction
  | IncreaseQuestionAction
  | CloseGameAction;

// Action creators
export const skipQuestion = (): SkipQuestionAction => ({ type: SKIP_QUESTION });
export const finishQuestion = (): FinishQuestionAction => ({
  type: FINISH_QUESTION,
});
export const endCheckTween: ThunkCreator = () => (dispatch, getState) => {
  if (!selectComplete(getState())) return;
  dispatch({ type: FINISH_QUESTION });
};
export const increaseQuestion = (amount: number): IncreaseQuestionAction => ({
  type: INCREASE_QUESTION,
  amount,
});
export const chooseGame = (
  game: GameState,
  filter?: string
): ChooseGameAction => ({
  type: CHOOSE_GAME,
  game,
  filter,
});
export const closeGame = (): CloseGameAction => ({ type: CLOSE_GAME });
