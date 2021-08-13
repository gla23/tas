import { useSelector } from "react-redux";
import { ThunkAction } from "redux-thunk";
import { MemoryBank } from "../utils/memory";
import { selectBank } from "./bank";
import {
  gameReducer,
  GameState,
  GameAction,
  chooseGame,
  CHOOSE_GAME,
} from "./game";
import { selectClue } from "./gameSelectors";
import navigationReducer, {
  NavigationAction,
  NavigationState,
} from "./navigation";
import settingsReducer, { SettingsAction, SettingsState } from "./settings";
import { TextAreaAction, textAreaReducer, TextAreaState } from "./textarea";

type Thunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action
>;
export type ThunkCreator<R = void> = (...args: any[]) => Thunk<R>;

// Actions
export const LOAD_BANK = "tas/LOAD_BANK";
type LoadBankAction = { type: typeof LOAD_BANK; bank: MemoryBank };

export type Action =
  | TextAreaAction
  | SettingsAction
  | LoadBankAction
  | GameAction
  | NavigationAction;

// Action creators
export const loadBank: ThunkCreator =
  (bank: MemoryBank) => (dispatch, getState) => {
    const state = getState();
    dispatch({ type: LOAD_BANK, bank });
    if (state.navigation.page === "game") dispatch(chooseGame(state.game));
  };

// Reducer
export default function rootReducer(
  state = initialState as RootState,
  action: Action
): RootState {
  const loadBank = action.type === LOAD_BANK && { bank: action.bank };
  const filter = action.type === CHOOSE_GAME &&
    action.filter && { filter: action.filter };
  return {
    ...state,
    ...loadBank,
    ...filter,
    navigation: navigationReducer(state.navigation, action),
    settings: settingsReducer(state.settings, action),
    textArea: textAreaReducer(state.textArea, action, state),
    game: gameReducer(state.game, action, { ...state, ...filter }),
  };
}

export interface RootState {
  bank: MemoryBank;
  filter: string;
  navigation: NavigationState;
  settings: SettingsState;
  textArea: TextAreaState;
  game: GameState;
}

const initialState: Partial<RootState> = {
  bank: {},
  filter: "^t[de]",
};

export const useQuiz = () =>
  useSelector((state: RootState) => ({
    ...state,
    clue: selectClue(state),
    bank: selectBank(state),
  }));
