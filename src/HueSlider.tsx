import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectSetting, setSetting } from "./ducks/settings";

export const HueSlider = () => {
  const hue = useSelector(selectSetting("hue"));
  const dispatch = useDispatch();
  useEffect(() => {
    const root = document.querySelector(":root");
    if (root instanceof HTMLHtmlElement)
      root.style.setProperty("--accent", `hsl(${hue}, 37%, 60%)`);
  }, [hue]);

  return (
    <input
      type="range"
      value={hue}
      min={0}
      max={255}
      onChange={(e) => dispatch(setSetting("hue", Number(e.target.value)))}
    />
  );
};
