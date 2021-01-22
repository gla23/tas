import { RootState } from ".";
import { useSelector } from "react-redux";

export const initialState = {
  guess:
    "ggwp sldkfjdsljk kf sfldkj djsfk ggwp sldkfjdsljk kf sfldkj djsfk ggwp sldkfjdsljk kf sfldkj djsfk ggwp sldkfjdsljk kf sfldkj djsfk ",
  clue: "prpe",
  answer: "The Lord detests the proud; they will surely be punished.",
  correct: 0,
};
type QuizState = typeof initialState;

const CHANGE_GUESS = "answer/CHANGE_GUESS";
export const changeGuess = (guess: string) =>
  ({ type: CHANGE_GUESS, guess } as const);

const CHECK = "answer/CHECK";
export const check = () => ({ type: CHECK } as const);

export default function quizReducer(
  state: QuizState = initialState,
  action: ReturnType<typeof changeGuess> | ReturnType<typeof check>
) {
  if (action.type === CHANGE_GUESS) return { ...state, guess: action.guess };
  if (action.type === CHECK)
    return {
      ...state,
      correct: Math.floor(Math.random() * state.guess.length - 2),
    };
  return state;
}

export const useGuess = () =>
  useSelector(
    (state: RootState) => [state.quiz.guess, state.quiz.correct] as const
  );
