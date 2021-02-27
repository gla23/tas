import { MemoryBank } from "../utils/memory";
import { createSelector } from "reselect";
import { RootState } from "./root";
import { occurrencesByRoot, allVerseWords } from "../utils/occurrences";

export const selectBank = createSelector(
  [(state: RootState) => state.bank, (state: RootState) => state.filter],
  (bank, filter): MemoryBank => {
    const regex = new RegExp(filter);
    return Object.fromEntries(
      Object.entries(bank).filter(([ref]) => regex.test(ref))
    );
  }
);
export const selectQuestionIds = createSelector(selectBank, (bank) =>
  Object.keys(bank)
);

export const selectVerseWords = createSelector([selectBank], (bank) =>
  allVerseWords(Object.values(bank))
);
export const selectOccurencesByRoot = createSelector(
  selectBank,
  occurrencesByRoot
);
