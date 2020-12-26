import { RootState } from ".";
import { useSelector } from "react-redux";

export const initialState = { parseMnemonics: true };
export type Setting = keyof typeof initialState;

const CHANGE = "settings/CHANGE";

type SettingsState = typeof initialState;
interface SettingsAction<S extends Setting> {
  type: typeof CHANGE;
  setting: S;
  value: SettingsState[S];
}

export default function settingsReducer(
  state: SettingsState = initialState,
  action: SettingsAction<Setting>
) {
  if (action.type === CHANGE)
    return { ...state, [action.setting]: action.value };
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
export function setSetting<S extends Setting>(
  setting: S,
  value: SettingsState[S]
) {
  return { type: CHANGE, setting, value };
}
