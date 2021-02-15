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
import { commonLength } from "../utils/commonLength";

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
  if (state.game.type === "recall") {
    const id = questionSet(state)[state.game.questionIndex];
    return id && state.settings.parseMnemonics ? new Passage(id).reference : id;
  }
  return "Clue";
};
const answers = (state: RootState): string[] => {
  if (state.game.type === "recall") return [recallAnswer(state)];
  return [];
};
const mainAnswer = (state: RootState): string => {
  if (state.game.type === "recall") return recallAnswer(state);
  return "ggwp";
};
const recallAnswer = (state: RootState): string => {
  const set = questionSet(state);
  if (state.game.type !== "recall")
    throw new Error("recallAnswer only works for recall games");
  const id = set[state.game.questionIndex];
  return state.bank[id] || "";
};

export const correctLength = (guess: string, state: RootState): number => {
  if (state.game.type === "recall")
    return commonLength(guess, recallAnswer(state));
  return 0;
};
export const guessIsCorrect = (guess: string, state: RootState): boolean => {
  if (state.game.type === "recall")
    return guess.startsWith(recallAnswer(state));
  return false;
};

const complete = (state: RootState): boolean =>
  guessIsCorrect(state.textArea.guess, state);
export const useQuiz = () =>
  useSelector((state: RootState) => ({
    ...state,
    answers: answers(state),
    mainAnswer: mainAnswer(state),
    clue: clue(state),
    bank: Object.fromEntries(
      Object.entries(state.bank).filter(([ref]) =>
        new RegExp(state.filter).test(ref)
      )
    ),
  }));
