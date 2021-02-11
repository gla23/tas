import { commonLength } from "../utils/commonLength";
import { Selection } from "../hooks/useSelectionInput";
import {
  QuizAction,
  answer,
  FINISH_QUESTION,
  QuizState,
  INCREASE_QUESTION,
} from "./quiz";

// Actions
const GUESS = "quiz/GUESS";
const SELECT = "quiz/SELECT";
const CHECK = "quiz/CHECK";

export type TextAreaAction =
  | ReturnType<typeof changeGuess>
  | ReturnType<typeof check>
  | ReturnType<typeof select>;

// Actions creators
export const changeGuess = (guess: string) => ({ type: GUESS, guess } as const);
export const check = () => ({ type: CHECK } as const);
export const select = (selection: Selection) =>
  ({ type: SELECT, selection } as const);

// Reducer
export function textAreaReducer(
  state: TextAreaState,
  action: QuizAction,
  fullState: QuizState
): TextAreaState {
  switch (action.type) {
    case FINISH_QUESTION:
      return { ...state, guess: "" };
    case GUESS: {
      const edited = Math.min(state.selection[0], state.previousSelection[0]);
      const reset = edited < state.highlight && {
        highlight: edited,
      };
      const completed = action.guess.startsWith(answer(fullState)) && {
        highlight: answer(fullState).length,
      };
      return { ...state, ...reset, ...completed, guess: action.guess };
    }
    case SELECT:
      return {
        ...state,
        selection: action.selection,
        previousSelection: state.selection,
      };
    // For INCREASE_QUESTION we need to do the same as CHECK except that the answer
    // selector needs to be provided the new state that hasn't been created yet!
    // What is the idiomatic redux way to solve this?
    // 1. Do a second action in the thunk "dependency change style thing"
    // 2. Hook it up to a component that does useEffect on the selector?
    // What does redux saga add to the conversation?
    case INCREASE_QUESTION:
    case CHECK:
      const highlight = commonLength(state.guess, answer(fullState)) + 1;
      return { ...state, highlight };
    default:
      return state;
  }
}

export interface TextAreaState {
  guess: string;
  selection: Selection;
  previousSelection: Selection;
  highlight: number;
}
export const initialTextAreaState: TextAreaState = {
  guess: "",
  selection: [0, 0, "forward"],
  previousSelection: [0, 0, "forward"],
  highlight: 0,
};
