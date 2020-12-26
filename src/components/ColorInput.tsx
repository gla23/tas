import React, { useEffect, useState } from "react";
import { useSelection } from "../hooks/useSelection";
import "./ColorInput.css";

interface ColorInputProps {
  id: string;
  value: string;
  autoFocus?: boolean;
  width?: string;
  fontSize?: string;
  onChange: (value: string) => void;
  debug?: boolean;
  charColor?: CharColor;
}
interface CharColor {
  (
    inSelection: boolean,
    character: string,
    index: number,
    string: string
  ): string;
}

export function ColorInput(props: ColorInputProps) {
  const [focused, setFocused] = useState(false);
  const [
    selection,
    mirrorSelection,
    withinSelection,
    hasCursor,
  ] = useSelection();

  const [cursorOn, setCursorOn] = useState(true);
  useEffect(() => {
    setCursorOn(true);
    let flashInterval = setInterval(() => setCursorOn((old) => !old), 600);
    return () => clearInterval(flashInterval);
  }, [focused, selection]);

  const {
    width = "100%",
    fontSize = "3rem",
    charColor = (sel, char, i, s) => (sel ? "#94b5ff" : "inherit"),
    debug,
  } = props;

  const style = { width, fontSize };

  const spans = Array.from(props.value + " ").map((char, index) => (
    <span
      style={{
        backgroundColor: charColor(
          withinSelection(index),
          char,
          index,
          props.value
        ),
      }}
      className={cursorOn && focused && hasCursor(index) ? "cursor " : ""}
      key={(char.codePointAt(0) || 0) * 1000 + index}
    >
      {char}
    </span>
  ));
  return (
    <>
      <p
        className="ColorInput"
        style={style}
        onClick={() => focusTextarea(props.id)}
      >
        {spans}
      </p>
      <textarea
        style={{
          ...style,
          position: debug ? "initial" : "absolute",
          left: "200vh",
        }}
        className="ColorInput"
        onChange={(e) => props.onChange(e.target.value)}
        spellCheck={false}
        id={props.id}
        value={props.value}
        autoFocus={props.autoFocus}
        onSelect={(e) => mirrorSelection(e.target as any)}
        onKeyPress={(e) => mirrorSelection(e.target as any)}
        onKeyUp={(e) => mirrorSelection(e.target as any)}
        onInput={(e) => mirrorSelection(e.target as any)}
        onFocus={() => {
          setFocused(true);
        }}
        onBlur={() => {
          setFocused(false);
        }}
      />
    </>
  );
}

const focusTextarea = (id: string) =>
  (document.querySelector("textarea#" + id) as HTMLTextAreaElement)?.focus();
