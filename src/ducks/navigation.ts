import { useSelector } from "react-redux";
import { Action } from "redux";
import { RootState } from "./root";
import { CHOOSE_GAME } from "./game";

export interface NavigationState {
  page: "game" | "menu";
}

const initialState: NavigationState = {
  page: "game",
};

export const CLOSE_GAME = "tas/CLOSE_GAME";
export const FINISH_GAME = "tas/FINISH_GAME";
type CloseGameAction = { type: typeof CLOSE_GAME };
type FinishGameAction = { type: typeof FINISH_GAME };
export const closeGame = (): CloseGameAction => ({ type: CLOSE_GAME });
export const finishGame = (): FinishGameAction => ({ type: FINISH_GAME });

export type NavigationAction = CloseGameAction | FinishGameAction;

export default function navigationReducer(
  state: NavigationState = initialState,
  action: Action
): NavigationState {
  switch (action.type) {
    case CLOSE_GAME:
    case FINISH_GAME:
      return { ...state, page: "menu" };
    case CHOOSE_GAME:
      return { ...state, page: "game" };
    default:
      return state;
  }
}

export const selectPage = (state: RootState) => state.navigation.page;
export const usePage = () => useSelector(selectPage);
