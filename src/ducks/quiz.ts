import { RootState } from ".";
import { useSelector } from "react-redux";
import { commonLength } from "../utils/commonLength";
import { Selection } from "../hooks/useSelectionInput";
import { MemoryBank } from "../questions/memory";
import { Passage } from "bible-tools";

const LOAD_BANK = "quiz/LOAD_BANK";
const GUESS = "quiz/GUESS";
const SELECT = "quiz/SELECT";
const CHECK = "quiz/CHECK";
const END_TWEEN = "quiz/END_TWEEN";
const INCREASE_QUESTION = "quiz/INCREASE_QUESTION";

export const changeGuess = (guess: string) => ({ type: GUESS, guess } as const);
export const check = () => ({ type: CHECK } as const);
export const endTween = () => ({ type: END_TWEEN } as const);
export const select = (selection: Selection) =>
  ({ type: SELECT, selection } as const);
export const loadBank = (bank: MemoryBank) =>
  ({ type: LOAD_BANK, bank } as const);
export const increaseQuestion = (amount: number) =>
  ({ type: INCREASE_QUESTION, amount } as const);

type QuizAction =
  | ReturnType<typeof changeGuess>
  | ReturnType<typeof check>
  | ReturnType<typeof select>
  | ReturnType<typeof endTween>
  | ReturnType<typeof increaseQuestion>
  | ReturnType<typeof loadBank>;

type QuizState = typeof initialState;
export default function quizReducer(
  state: QuizState = initialState,
  action: QuizAction
): QuizState {
  if (action.type === LOAD_BANK) return { ...state, bank: action.bank };
  if (action.type === GUESS) {
    const edited = Math.min(state.selection[0], state.previousSelection[0]);
    const reset = edited < state.highlight && {
      highlight: edited,
    };
    const completed = action.guess.startsWith(answer(state)) && {
      highlight: answer(state).length,
    };
    return { ...state, ...reset, ...completed, guess: action.guess };
  }
  if (action.type === SELECT)
    return {
      ...state,
      selection: action.selection,
      previousSelection: state.selection,
    };
  if (action.type === CHECK) {
    const highlight = commonLength(state.guess, answer(state)) + 1;
    return { ...state, highlight };
  }
  if (action.type === END_TWEEN && complete(state)) {
    const completed = state.completed + 1;
    const questionIndex = completed;
    return { ...state, completed, questionIndex, guess: "" };
  }
  if (action.type === INCREASE_QUESTION) {
    const positive = Math.max(0, state.questionIndex + action.amount);
    const questionIndex = Math.min(questionSet(state).length, positive);
    return { ...state, questionIndex };
  }
  return state;
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
const answer = (state: QuizState) => state.bank[currentId(state)] || "Hmm";

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
