import { useSelector } from "react-redux";
import { Action, RootState } from "./root";

const initialSettings = { parseMnemonics: true, dark: true, hue: 113 };
export type SettingsState = typeof initialSettings;
export type Setting = keyof SettingsState;
export type BooleanSetting = keyof {
  [S in Setting as SettingsState[S] extends boolean ? S : never]: any;
};
const CHANGE = "settings/CHANGE";
const TOGGLE_DARK = "settings/TOGGLE_DARK";

interface ChangeAction<S extends Setting> {
  type: typeof CHANGE;
  setting: S;
  value: SettingsState[S];
}
export type SettingsAction =
  | ChangeAction<Setting>
  | { type: typeof TOGGLE_DARK };

export default function settingsReducer(
  state: SettingsState = initialSettings,
  action: Action
) {
  if (action.type === CHANGE)
    return { ...state, [action.setting]: action.value };
  if (action.type === TOGGLE_DARK) return { ...state, dark: !state.dark };
  return state;
}

export const typeOf = (setting: Setting) => {
  if (typeof initialSettings[setting] === "boolean") return "checkbox";
  throw new Error("No widget for this data type");
};

export const selectSetting = <T extends Setting>(setting: T) => (
  state: RootState
): SettingsState[T] => state.settings[setting];

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
