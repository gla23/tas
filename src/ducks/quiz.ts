import { RootState } from ".";
import { useSelector } from "react-redux";
import { Selection } from "../hooks/useSelectionInput";
import { MemoryBank } from "../utils/memory";
import { Passage } from "bible-tools";
import { changeGuess, check, select, textareaReducer } from "./textarea";
import { ThunkAction } from "redux-thunk";

type Thunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  QuizAction
>;
type ThunkCreator<R = void> = (...args: any[]) => Thunk<R>;

const LOAD_BANK = "quiz/LOAD_BANK";
export const FINISH_QUESTION = "quiz/FINISH_QUESTION";
const INCREASE_QUESTION = "quiz/INCREASE_QUESTION";
const SKIP_QUESTION = "quiz/SKIP_QUESTION";

export const endTween: ThunkCreator = () => (dispatch, getState) => {
  if (!complete(getState().quiz)) return;
  dispatch({ type: FINISH_QUESTION } as const);
};
export const loadBank: ThunkCreator = (bank: MemoryBank) => (dispatch) => {
  dispatch({ type: LOAD_BANK, bank } as const);
  dispatch({ type: LOAD_BANK, bank } as const);
};

export const increaseQuestion = (amount: number) =>
  ({ type: INCREASE_QUESTION, amount } as const);
export const skipQuestion = () => ({ type: SKIP_QUESTION } as const);

export type QuizAction =
  | ReturnType<typeof changeGuess>
  | ReturnType<typeof check>
  | ReturnType<typeof select>
  | { type: typeof FINISH_QUESTION }
  | { type: typeof LOAD_BANK; bank: MemoryBank }
  | ReturnType<typeof increaseQuestion>
  | ReturnType<typeof skipQuestion>;

export default function quizReducer(
  state: QuizState = initialState,
  action: QuizAction
): QuizState {
  const bankLoad = action.type === LOAD_BANK && { bank: action.bank };
  const completed = action.type === FINISH_QUESTION && {
    completed: state.completed + 1,
  };
  state = {
    ...state,
    ...bankLoad,
    ...completed,
    game: gameReducer(state.game, action, state),
  };
  return textareaReducer(state, action);
}

export type QuizState = {
  bank: MemoryBank;
  filter: string;
  guess: string;
  selection: Selection;
  previousSelection: Selection;
  highlight: number;
  completed: number;
  game: GameState;
};
const initialState: QuizState = {
  bank: {},
  filter: "^ae[c-d]",
  guess: "",
  selection: [0, 0, "forward"],
  previousSelection: [0, 0, "forward"],
  highlight: 0,
  completed: 0,
  game: {
    questionIndex: 0,
    type: "recall",
    order: "random",
    setIndexesLeft: [],
    inOrderCount: 2,
    inOrderDone: 0,
  },
};

const questionSet = (state: QuizState) => {
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
  state.guess.startsWith(answer(state));

export interface RecallGame {
  type: "recall";
  order: "next" | "random" | "same";
  questionIndex: number;
  setIndexesLeft: number[];
  inOrderCount: number;
  inOrderDone: number;
}
export interface NewGame {
  type: "new";
}
type GameState = RecallGame | NewGame;

function gameReducer(
  game: GameState,
  action: QuizAction,
  state: QuizState
): GameState {
  switch (action.type) {
    case LOAD_BANK:
      const set = questionSet(state);
      console.log(set);
      if (game.type === "recall") return initRecallGame(game, set);
      return game;
    case FINISH_QUESTION:
    case SKIP_QUESTION:
      if (game.type === "recall") return nextRecallGame(game, state);
      return game;
    case INCREASE_QUESTION: {
      if (game.type !== "recall") return game;
      const positive = Math.max(0, game.questionIndex + action.amount);
      const questionIndex = Math.min(questionSet(state).length, positive);
      return { ...game, questionIndex };
    }
  }
  return game;
}
function initRecallGame(game: RecallGame, set: string[]): RecallGame {
  const indexesLeft = set.slice(1).map((id, i) => i);
  const randomIndex = Math.floor(Math.random() * indexesLeft.length);
  const randomElem = indexesLeft.splice(randomIndex, 1)[0];
  return {
    type: "recall",
    order: game.order,
    inOrderCount: game.inOrderCount,
    setIndexesLeft: indexesLeft,
    inOrderDone: 0,
    questionIndex: randomElem,
  };
}

function nextRecallGame(game: RecallGame, state: QuizState): RecallGame {
  if (game.order === "same") return game;
  const set = questionSet(state);
  const bounded = (index: number) =>
    Math.max(0, Math.min(set.length - 1, index));
  const { inOrderCount, inOrderDone, questionIndex: previous } = game;
  if (inOrderDone < inOrderCount - 1) {
    const newIndex = game.order === "random" ? previous + 1 : previous;
    return {
      ...game,
      inOrderDone: inOrderDone + 1,
      questionIndex: bounded(newIndex),
    };
  }
  if (game.order === "next")
    return { ...game, inOrderDone: 0, questionIndex: bounded(previous + 1) };
  const setIndexesLeft =
    game.setIndexesLeft && game.setIndexesLeft.length
      ? game.setIndexesLeft
      : set.slice(1).map((id, i) => i);
  const random = Math.floor(Math.random() * setIndexesLeft.length);
  const newSetIndexesLeft = setIndexesLeft.slice();
  const randomId = newSetIndexesLeft.splice(random, 1)[0];
  return {
    ...game,
    setIndexesLeft: newSetIndexesLeft,
    inOrderDone: 0,
    questionIndex: randomId,
  };
}

const currentId: (state: QuizState) => string = (state) => {
  const set = questionSet(state);
  if (state.game.type === "recall") return set[state.game.questionIndex];
  return "aee";
};
export const useQuiz = () =>
  useSelector((state: RootState) => ({
    ...state.quiz,
    highlight: Math.min(state.quiz.guess.length, state.quiz.highlight),
    answer: answer(state.quiz),
    clue: clue(state),
  }));
