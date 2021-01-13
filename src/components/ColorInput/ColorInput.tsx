import { FunctionComponent, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { useResize } from "../../hooks/useResize";
import { useSelectionInput } from "../../hooks/useSelectionInput";
import { clickedIndex } from "./selectionSet";
import "./ColorInput.css";

interface ColorInputProps {
  id?: string;
  value: string;
  autoFocus?: boolean;
  width?: string;
  fontSize?: string;
  onChange: (value: string) => void;
  debug?: boolean;
  charClass?: CharClass;
}
interface CharClass {
  (
    inSelection: boolean,
    character: string,
    index: number,
    string: string
  ): string;
}
export const Scrollable: FunctionComponent<{
  className?: string;
}> = function Scrollable(props) {
  return (
    <div className={"scrollableOuter "}>
      <div className={"scrollable " + props.className}>{props.children}</div>
      <div className="textareaRoot" />
    </div>
  );
};
export function ColorInput(props: ColorInputProps) {
  const { current: randomId } = useRef(
    "ColorInput" + String(Math.random()).slice(5, 13)
  );
  const id = props.id || randomId;
  const textareaRoot = document.querySelector("div.textareaRoot");
  const [focused, setFocused] = useState(false);
  const [cursorOn, setCursorOn] = useState(true);
  const textarea = useSelectionInput();

  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const { width: paragraphWidth } = useResize(paragraphRef);

  useEffect(() => {
    setCursorOn(true);
    let flashInterval = setInterval(() => setCursorOn((old) => !old), 600);
    return () => clearInterval(flashInterval);
  }, [focused, textarea.selection]);

  const [dragStart, setDragStart] = useState<null | number>(null);

  if (!textareaRoot) return null;

  const {
    width = "100%",
    fontSize = "3rem",
    charClass = (sel, char, i, s) =>
      sel ? "bg-blue-300 bg-opacity-50" : "inherit",
    debug,
  } = props;

  return (
    <div className="ColorInput">
      <p
        className="ColorInput"
        ref={paragraphRef}
        style={{ width, fontSize }}
        onMouseDown={(e) => {
          const index = clickedIndex(e);
          textarea.setSelection([index, index, "none"]);
          setDragStart(index);
        }}
        onMouseMove={(e) => {
          if (dragStart !== null) {
            const dragEnd = clickedIndex(e);
            textarea.setSelection(
              dragEnd > dragStart
                ? [dragStart, dragEnd, "forward"]
                : [dragEnd, dragStart, "backward"]
            );
          }
        }}
        onMouseUp={(e) => {
          textarea.focus();
          setDragStart(null);
        }}
      >
        {Array.from(props.value + " ").map((char, index) => (
          <span
            className={
              (cursorOn && (focused || dragStart) && textarea.hasCursor(index)
                ? "cursor "
                : "") +
              (index >= props.value.length
                ? ""
                : charClass(
                    (focused || !!dragStart) && textarea.withinSelection(index),
                    char,
                    index,
                    props.value
                  ))
            }
            key={(char.codePointAt(0) || 0) * 1000 + index}
          >
            {char}
          </span>
        ))}
      </p>
      {ReactDOM.createPortal(
        <textarea
          id={id}
          {...textarea.props}
          style={{
            position: debug ? "initial" : "absolute",
            left: "200vw",
            width: paragraphWidth + "px",
            fontSize,
          }}
          className="ColorInput"
          onChange={(e) => props.onChange(e.target.value)}
          spellCheck={false}
          value={props.value}
          autoFocus={props.autoFocus}
          // onSelect={(e) => setSelection(e.target as any)}
          // onKeyPress={(e) => setSelection(e.target as any)}
          // onKeyUp={(e) => setSelection(e.target as any)}
          // onInput={(e) => setSelection(e.target as any)}
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
