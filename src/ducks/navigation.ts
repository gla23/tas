import { useSelector } from "react-redux";
import { Action } from "redux";
import { CHOOSE_GAME, CLOSE_GAME, RootState } from "./root";

export interface NavigationState {
  page: "game" | "menu";
}

const initialState: NavigationState = {
  page: "game",
};

export default function navigationReducer(
  state: NavigationState = initialState,
  action: Action
): NavigationState {
  switch (action.type) {
    case CLOSE_GAME:
      return { ...state, page: "menu" };
    case CHOOSE_GAME:
      return { ...state, page: "game" };
    default:
      return state;
  }
}

export const selectPage = (state: RootState) => state.navigation.page;
export const usePage = () => useSelector(selectPage);
