import { RootState } from ".";
import { useSelector } from "react-redux";
import { Selection } from "../hooks/useSelectionInput";
import { MemoryBank } from "../questions/memory";
import { Passage } from "bible-tools";
import { changeGuess, check, select, textareaCases } from "./textarea";

const LOAD_BANK = "quiz/LOAD_BANK";
const END_TWEEN = "quiz/END_TWEEN";
const INCREASE_QUESTION = "quiz/INCREASE_QUESTION";

export const endTween = () => ({ type: END_TWEEN } as const);
export const loadBank = (bank: MemoryBank) =>
  ({ type: LOAD_BANK, bank } as const);
export const increaseQuestion = (amount: number) =>
  ({ type: INCREASE_QUESTION, amount } as const);

export type QuizAction =
  | ReturnType<typeof changeGuess>
  | ReturnType<typeof check>
  | ReturnType<typeof select>
  | ReturnType<typeof endTween>
  | ReturnType<typeof increaseQuestion>
  | ReturnType<typeof loadBank>;

export type QuizState = typeof initialState;
export default function quizReducer(
  state: QuizState = initialState,
  action: QuizAction
): QuizState {
  state = textareaCases(state, action);
  switch (action.type) {
    case LOAD_BANK:
      return { ...state, bank: action.bank };
    case END_TWEEN:
      if (!complete(state)) return state;
      const completed = state.completed + 1;
      const questionIndex = completed;
      return { ...state, completed, questionIndex, guess: "" };

    case INCREASE_QUESTION: {
      const positive = Math.max(0, state.questionIndex + action.amount);
      const questionIndex = Math.min(questionSet(state).length, positive);
      return { ...state, questionIndex };
    }
    default:
      return state;
  }
}

export const initialState = {
  bank: {} as MemoryBank,
  guess: "",
  selection: [0, 0, "forward"] as Selection,
  previousSelection: [0, 0, "forward"] as Selection,
  highlight: 0,
  filter: "^a",
  completed: 0,
  questionIndex: 0,
};

const questionSet = (state: QuizState) => {
  const regex = new RegExp(state.filter);
  return Object.keys(state.bank).filter(regex.test.bind(regex));
};
const currentId = (state: QuizState) =>
  questionSet(state)[state.questionIndex] || "";
const complete = (state: QuizState) => state.guess.startsWith(answer(state));

export const answer = (state: QuizState) =>
  state.bank[currentId(state)] || "Hmm";
const clue = (state: RootState) => {
  const id = currentId(state.quiz);
  return state.settings.parseMnemonics ? new Passage(id).reference : id;
};

export const useQuiz = () =>
  useSelector((state: RootState) => ({
    ...state.quiz,
    answer: answer(state.quiz),
    clue: clue(state),
  }));
