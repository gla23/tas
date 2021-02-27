import { useDispatch, useSelector } from "react-redux";
import {
  BooleanSetting,
  selectSetting,
  setSetting,
  typeOf,
} from "../ducks/settings";

export interface SettingsInputProps {
  children: string;
  setting: BooleanSetting;
  className?: string;
}

export const SettingsInput = (props: SettingsInputProps) => {
  const value = useSelector(selectSetting(props.setting));
  const dispatch = useDispatch();

  return (
    <span className="px-1 checkbox">
      <input
        className={props.className}
        id={props.setting}
        type={typeOf(props.setting)}
        checked={value}
        onChange={(e) => dispatch(setSetting(props.setting, e.target.checked))}
      />
      <label className="px-1" htmlFor={props.setting}>
        {props.children}
      </label>
    </span>
  );
};
