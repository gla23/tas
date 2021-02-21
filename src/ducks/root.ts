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

export type Action =
  | TextAreaAction
  | SettingsAction
  | { type: typeof LOAD_BANK; bank: MemoryBank }
  | { type: typeof SKIP_QUESTION }
  | { type: typeof FINISH_QUESTION }
  | { type: typeof INCREASE_QUESTION; amount: number };

// Action creators
export const loadBank: ThunkCreator = (bank: MemoryBank) => (dispatch) => {
  dispatch({ type: LOAD_BANK, bank } as const);
  dispatch({ type: LOAD_BANK, bank } as const);
};
export const skipQuestion = () => ({ type: SKIP_QUESTION } as const);
export const finishQuestion = () => ({ type: FINISH_QUESTION } as const);
export const endTween: ThunkCreator = () => (dispatch, getState) => {
  if (!selectComplete(getState())) return;
  dispatch({ type: FINISH_QUESTION } as const);
};
export const increaseQuestion = (amount: number) =>
  ({ type: INCREASE_QUESTION, amount } as const);

// Reducer
export default function rootReducer(
  state = initialState as RootState,
  action: Action
): RootState {
  const loadBank = action.type === LOAD_BANK && { bank: action.bank };
  const incrementCompleted = action.type === FINISH_QUESTION && {
    completed: state.completed + 1,
  };
  return {
    ...state,
    ...loadBank,
    ...incrementCompleted,
    settings: settingsReducer(state.settings, action),
    textArea: textAreaReducer(state.textArea, action, state),
    game: gameReducer(state.game, action, state),
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
