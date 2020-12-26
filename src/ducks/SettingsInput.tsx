import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectSetting, setSetting, Setting, typeOf } from "./settings";

export interface SettingsInputProps {
  children: string;
  setting: Setting;
}

export const SettingsInput = (props: SettingsInputProps) => {
  const value = useSelector(selectSetting(props.setting));
  const dispatch = useDispatch();
  return (
    <>
      <input
        id={props.setting}
        type={typeOf(props.setting)}
        checked={value}
        onChange={(e) => dispatch(setSetting(props.setting, e.target.checked))}
      />
      <label htmlFor={props.setting}>{props.children}</label>
    </>
  );
};
