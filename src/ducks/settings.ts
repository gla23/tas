import { RootState } from ".";
import { useSelector } from "react-redux";

export const initialState = { parseMnemonics: true, dark: true };
export type Setting = keyof typeof initialState;

const CHANGE = "settings/CHANGE";
const TOGGLE_DARK = "settings/TOGGLE_DARK";

type SettingsState = typeof initialState;
interface ChangeAction<S extends Setting> {
  type: typeof CHANGE;
  setting: S;
  value: SettingsState[S];
}
type SettingsAction = ChangeAction<Setting> | { type: typeof TOGGLE_DARK };
export default function settingsReducer(
  state: SettingsState = initialState,
  action: SettingsAction
) {
  if (action.type === CHANGE)
    return { ...state, [action.setting]: action.value };
  if (action.type === TOGGLE_DARK) return { ...state, dark: !state.dark };
  return state;
}

export const typeOf = (setting: Setting) => {
  if (typeof initialState[setting] === "boolean") return "checkbox";
  throw new Error("No widget for this data type");
};

export const selectSetting = (setting: Setting) => (state: RootState) =>
  state.settings[setting];

export const useParseMnemonic = () =>
  useSelector(selectSetting("parseMnemonics"));
export const useTheme = () =>
  useSelector(selectSetting("dark")) ? "dark" : "light";
export const useDark = () => useSelector(selectSetting("dark"));
export function toggleDark() {
  return { type: TOGGLE_DARK };
}
export function setSetting<S extends Setting>(
  setting: S,
  value: SettingsState[S]
) {
  return { type: CHANGE, setting, value };
}
