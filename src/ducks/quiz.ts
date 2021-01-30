import { RootState } from ".";
import { useSelector } from "react-redux";
import { commonLength } from "../utils/commonLength";
import { Selection } from "../hooks/useSelectionInput";

export const initialState = {
  guess: "The Lord detests the proud; they wilk surely be punished.",
  clue: "prpe",
  answer: "The Lord detests the proud; they will surely be punished.",
  selection: [0, 0, "forward"] as Selection,
  previousSelection: [0, 0, "forward"] as Selection,
  highlight: 0,
};
type QuizState = typeof initialState;

const GUESS = "answer/GUESS";
const SELECT = "answer/SELECT";
const CHECK = "answer/CHECK";
export const changeGuess = (guess: string) => ({ type: GUESS, guess } as const);
export const select = (selection: Selection) =>
  ({ type: SELECT, selection } as const);
export const check = () => ({ type: CHECK } as const);

type QuizAction =
  | ReturnType<typeof changeGuess>
  | ReturnType<typeof check>
  | ReturnType<typeof select>;

export default function quizReducer(
  state: QuizState = initialState,
  action: QuizAction
) {
  if (action.type === GUESS) {
    const edited = Math.min(state.selection[0], state.previousSelection[0]);
    const reset = edited < state.highlight && {
      highlight: edited,
    };
    const completed = action.guess.startsWith(state.answer) && {
      highlight: state.answer.length,
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
    const highlight = commonLength(state.guess, state.answer) + 1;
    return { ...state, highlight };
  }
  return state;
}
// const selectCorrect = (state: RootState) =>
//   commonLength(state.quiz.guess, state.quiz.answer);
export const useQuiz = () => useSelector((state: RootState) => state.quiz);
