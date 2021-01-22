import { combineReducers } from "redux";
import settings from "./settings";
import quiz from "./quiz";

export const rootReducer = combineReducers({ settings, quiz });
export type RootState = ReturnType<typeof rootReducer>;
