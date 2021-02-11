import { combineReducers } from "redux";
import settings from "./settings";
import { ThunkAction } from "redux-thunk";
import quiz, { QuizAction } from "./quiz";

type Thunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  QuizAction
>;
export type ThunkCreator<R = void> = (...args: any[]) => Thunk<R>;

export const rootReducer = combineReducers({ settings, quiz });
export type RootState = ReturnType<typeof rootReducer>;
