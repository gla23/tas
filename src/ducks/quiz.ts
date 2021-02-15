import { RootState } from ".";
import { useSelector } from "react-redux";
import { MemoryBank } from "../utils/memory";
import { Passage } from "bible-tools";
import {
  initialTextAreaState,
  TextAreaAction,
  textAreaReducer,
  TextAreaState,
} from "./textarea";
import { ThunkCreator } from ".";
import { gameReducer, GameState, initialGameState } from "./game";

// Actions
export const LOAD_BANK = "quiz/LOAD_BANK";
export const SKIP_QUESTION = "quiz/SKIP_QUESTION";
export const FINISH_QUESTION = "quiz/FINISH_QUESTION";
export const INCREASE_QUESTION = "quiz/INCREASE_QUESTION";

export type QuizAction =
  | TextAreaAction
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
  if (!complete(getState().quiz)) return;
  dispatch({ type: FINISH_QUESTION } as const);
};
export const increaseQuestion = (amount: number) =>
  ({ type: INCREASE_QUESTION, amount } as const);

// Reducer
export default function quizReducer(
  state: QuizState = initialState,
  action: QuizAction
): QuizState {
  const loadBank = action.type === LOAD_BANK && { bank: action.bank };
  const incrementCompleted = action.type === FINISH_QUESTION && {
    completed: state.completed + 1,
  };
  return {
    ...state,
    ...loadBank,
    ...incrementCompleted,
    textArea: textAreaReducer(state.textArea, action, state),
    game: gameReducer(state.game, action, state),
  };
}

export interface QuizState {
  bank: MemoryBank;
  filter: string;
  textArea: TextAreaState;
  completed: number;
  completedGoal: number;
  game: GameState;
}
const initialState: QuizState = {
  bank: {},
  filter: "^t",
  completed: 0,
  completedGoal: 20,
  textArea: initialTextAreaState,
  game: initialGameState,
};

export const questionSet = (state: QuizState) => {
  const regex = new RegExp(state.filter);
  return Object.keys(state.bank).filter(regex.test.bind(regex));
};
const clue = (state: RootState) => {
  const id = currentId(state.quiz);
  if (!id) return "";
  return state.settings.parseMnemonics ? new Passage(id).reference : id;
};
export const answer = (state: QuizState) => state.bank[currentId(state)] || "";
export const complete = (state: QuizState) =>
  state.textArea.guess.startsWith(answer(state));

const currentId: (state: QuizState) => string = (state) => {
  const set = questionSet(state);
  if (state.game.type === "recall") return set[state.game.questionIndex];
  return "aee";
};
export const useQuiz = () =>
  useSelector((state: RootState) => ({
    ...state.quiz,
    ...state.quiz.textArea,
    highlight: Math.min(
      state.quiz.textArea.guess.length,
      state.quiz.textArea.highlight
    ),
    answer: answer(state.quiz),
    clue: clue(state),
    bank: Object.fromEntries(
      Object.entries(state.quiz.bank).filter(([ref]) =>
        new RegExp(state.quiz.filter).test(ref)
      )
    ),
  }));
