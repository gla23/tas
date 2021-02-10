import { commonLength } from "../utils/commonLength";
import { Selection } from "../hooks/useSelectionInput";
import { QuizState, QuizAction, answer, FINISH_QUESTION } from "./quiz";

const GUESS = "quiz/GUESS";
const SELECT = "quiz/SELECT";
const CHECK = "quiz/CHECK";
export const changeGuess = (guess: string) => ({ type: GUESS, guess } as const);
export const check = () => ({ type: CHECK } as const);
export const select = (selection: Selection) =>
  ({ type: SELECT, selection } as const);

export function textareaReducer(
  state: QuizState,
  action: QuizAction
): QuizState {
  switch (action.type) {
    case FINISH_QUESTION:
      return { ...state, guess: "" };
    case GUESS: {
      const edited = Math.min(state.selection[0], state.previousSelection[0]);
      const reset = edited < state.highlight && {
        highlight: edited,
      };
      const completed = action.guess.startsWith(answer(state)) && {
        highlight: answer(state).length,
      };
      return { ...state, ...reset, ...completed, guess: action.guess };
    }
    case SELECT:
      return {
        ...state,
        selection: action.selection,
        previousSelection: state.selection,
      };
    case CHECK:
      const highlight = commonLength(state.guess, answer(state)) + 1;
      return { ...state, highlight };
    default:
      return state;
  }
}
