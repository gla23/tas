import {
  findGameDescription,
  selectFindClue,
  selectPossibleAnswer,
} from "../games/FindGame";
import {
  recallAnswer,
  recallGameDescription,
  selectRecallClue,
} from "../games/RecallGame";
import { commonLength } from "../utils/commonLength";
import { RootState } from "./root";

export const selectClue = (state: RootState) => {
  const type = state.game.type;
  if (type === "recall") return selectRecallClue(state);
  if (type === "find") return selectFindClue(state);
  return "Clue";
};

export const selectGameType = (state: RootState) => state.game.type;
export const selectComplete = (state: RootState): boolean =>
  guessIsCorrect(state.textArea.guess, state);

export const correctLength = (guess: string, state: RootState): number =>
  commonLength(guess, selectMainAnswer(state));
export const guessIsCorrect = (guess: string, state: RootState): boolean => {
  return guess.startsWith(selectMainAnswer(state));
};
export const selectMainAnswer = (state: RootState): string => {
  if (state.game.type === "recall") return recallAnswer(state);
  if (state.game.type === "find") return selectPossibleAnswer(state);
  return "ggwp";
};

export const selectGameDescription = (state: RootState): string => {
  if (state.game.type === "recall")
    return recallGameDescription(state.game, state);
  if (state.game.type === "find") return findGameDescription(state.game, state);
  return "description not written yet";
};
