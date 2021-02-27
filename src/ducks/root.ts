import { useSelector } from "react-redux";
import { ThunkAction } from "redux-thunk";
import { MemoryBank } from "../utils/memory";
import { selectBank } from "./bank";
import { gameReducer, GameState } from "./game";
import { selectClue, selectComplete } from "./gameSelectors";
import settingsReducer, { SettingsAction, SettingsState } from "./settings";
import { TextAreaAction, textAreaReducer, TextAreaState } from "./textarea";

type Thunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action
>;
export type ThunkCreator<R = void> = (...args: any[]) => Thunk<R>;

// Actions
export const LOAD_BANK = "tas/LOAD_BANK";
export const SKIP_QUESTION = "tas/SKIP_QUESTION";
export const FINISH_QUESTION = "tas/FINISH_QUESTION";
export const INCREASE_QUESTION = "tas/INCREASE_QUESTION";
export const CHOOSE_GAME = "tas/CHOOSE_GAME";

type LoadBankAction = { type: typeof LOAD_BANK; bank: MemoryBank };
type ChooseGameAction = {
  type: typeof CHOOSE_GAME;
  game: GameState;
  filter?: string;
};
type SkipQuestionAction = { type: typeof SKIP_QUESTION };
type FinishQuestionAction = { type: typeof FINISH_QUESTION };
type IncreaseQuestionAction = {
  type: typeof INCREASE_QUESTION;
  amount: number;
};

type TasAction =
  | LoadBankAction
  | ChooseGameAction
  | SkipQuestionAction
  | FinishQuestionAction
  | IncreaseQuestionAction;

export type Action = TextAreaAction | SettingsAction | TasAction;

// Action creators
export const loadBank: ThunkCreator = (bank: MemoryBank) => (
  dispatch,
  getState
) => {
  const state = getState();
  dispatch({ type: LOAD_BANK, bank });
  dispatch(chooseGame(state.game));
};
export const chooseGame = (
  game: GameState,
  filter?: string
): ChooseGameAction => ({
  type: CHOOSE_GAME,
  game,
  filter,
});
export const skipQuestion = (): SkipQuestionAction => ({ type: SKIP_QUESTION });
export const finishQuestion = (): FinishQuestionAction => ({
  type: FINISH_QUESTION,
});
export const endTween: ThunkCreator = () => (dispatch, getState) => {
  if (!selectComplete(getState())) return;
  dispatch({ type: FINISH_QUESTION });
};
export const increaseQuestion = (amount: number): IncreaseQuestionAction => ({
  type: INCREASE_QUESTION,
  amount,
});

// Reducer
export default function rootReducer(
  state = initialState as RootState,
  action: Action
): RootState {
  const loadBank = action.type === LOAD_BANK && { bank: action.bank };
  const incrementCompleted = action.type === FINISH_QUESTION && {
    completed: state.completed + 1,
  };
  const filter = action.type === CHOOSE_GAME &&
    action.filter && { filter: action.filter };
  return {
    ...state,
    ...loadBank,
    ...incrementCompleted,
    ...filter,
    settings: settingsReducer(state.settings, action),
    textArea: textAreaReducer(state.textArea, action, state),
    game: gameReducer(state.game, action, { ...state, ...filter }),
  };
}

export interface RootState {
  bank: MemoryBank;
  filter: string;
  completed: number;
  completedGoal: number;
  settings: SettingsState;
  textArea: TextAreaState;
  game: GameState;
}

// Move completed and completedGoal into game
// Fix findGame incrementing on every occurence
// Work out how to get all ESV verses
// Build game collecting UI

const initialState: Partial<RootState> = {
  bank: {},
  filter: "^a",
  completed: 0,
  completedGoal: 20,
};

export const useQuiz = () =>
  useSelector((state: RootState) => ({
    ...state,
    clue: selectClue(state),
    bank: selectBank(state),
  }));
