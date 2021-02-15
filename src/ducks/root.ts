import { useSelector } from "react-redux";
import { MemoryBank } from "../utils/memory";
import { Passage } from "bible-tools";
import {
  initialTextAreaState,
  TextAreaAction,
  textAreaReducer,
  TextAreaState,
} from "./textarea";
import { gameReducer, GameState, initialGameState } from "./game";
import settingsReducer, {
  initialSettings,
  SettingsAction,
  SettingsState,
} from "./settings";
import { ThunkAction } from "redux-thunk";

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
  if (!complete(getState())) return;
  dispatch({ type: FINISH_QUESTION } as const);
};
export const increaseQuestion = (amount: number) =>
  ({ type: INCREASE_QUESTION, amount } as const);

// Reducer
export default function rootReducer(
  state: RootState = initialState,
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
const initialState: RootState = {
  bank: {},
  filter: "^t",
  completed: 0,
  completedGoal: 20,
  settings: initialSettings,
  textArea: initialTextAreaState,
  game: initialGameState,
};

export const questionSet = (state: RootState) => {
  const regex = new RegExp(state.filter);
  return Object.keys(state.bank).filter(regex.test.bind(regex));
};
const clue = (state: RootState) => {
  const id = currentId(state);
  if (!id) return "";
  return state.settings.parseMnemonics ? new Passage(id).reference : id;
};
export const answer = (state: RootState) => state.bank[currentId(state)] || "";
export const complete = (state: RootState) =>
  state.textArea.guess.startsWith(answer(state));

const currentId: (state: RootState) => string = (state) => {
  const set = questionSet(state);
  if (state.game.type === "recall") return set[state.game.questionIndex];
  return "aee";
};
export const useQuiz = () =>
  useSelector((state: RootState) => ({
    ...state,
    answer: answer(state),
    clue: clue(state),
    bank: Object.fromEntries(
      Object.entries(state.bank).filter(([ref]) =>
        new RegExp(state.filter).test(ref)
      )
    ),
  }));
