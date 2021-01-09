import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { useResize } from "../../hooks/useResize";
import { useSelection } from "../../hooks/useSelection";
import "./ColorInput.css";

interface ColorInputProps {
  id?: string;
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
export const Scrollable: FunctionComponent = function Scrollable(props) {
  return (
    <div className="scrollableOuter">
      <div className="scrollable">{props.children}</div>
      <div className="textareaRoot" />
    </div>
  );
};

export function ColorInput(props: ColorInputProps) {
  const { current: randomId } = useRef(
    "ColorInput" + String(Math.random()).slice(5, 13)
  );
  const id = props.id || randomId;
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const { width: paragraphWidth } = useResize(paragraphRef);

  const [focused, setFocused] = useState(false);
  const [cursorOn, setCursorOn] = useState(true);
  const [
    selection,
    mirrorSelection,
    withinSelection,
    hasCursor,
  ] = useSelection();
  useEffect(() => {
    setCursorOn(true);
    let flashInterval = setInterval(() => setCursorOn((old) => !old), 600);
    return () => clearInterval(flashInterval);
  }, [focused, selection]);

  const textareaRoot = document.querySelector("div.textareaRoot");
  if (!textareaRoot) return null;

  const {
    width = "100%",
    fontSize = "3rem",
    charColor = (sel, char, i, s) => (sel ? "#94b5ff" : "inherit"),
    debug,
  } = props;

  return (
    <div className="ColorInput">
      <p
        className="ColorInput"
        ref={paragraphRef}
        style={{ width, fontSize }}
        onClick={() => focusTextarea(id)}
      >
        {Array.from(props.value + " ").map((char, index) => (
          <span
            style={{
              backgroundColor:
                index >= props.value.length
                  ? "inherit"
                  : charColor(
                      focused && withinSelection(index),
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
        ))}
      </p>
      {ReactDOM.createPortal(
        <textarea
          id={id}
          style={{
            position: debug ? "initial" : "absolute",
            left: "200vh",
            width: paragraphWidth + "px",
            fontSize,
          }}
          className="ColorInput"
          onChange={(e) => props.onChange(e.target.value)}
          spellCheck={false}
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
        />,
        textareaRoot
      )}
    </div>
  );
}

const focusTextarea = (id: string) =>
  (document.querySelector("textarea#" + id) as HTMLTextAreaElement)?.focus();
