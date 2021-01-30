import { FunctionComponent, useEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { useResize } from "../../hooks/useResize";
import { useSelectionInput, Selection } from "../../hooks/useSelectionInput";
import { childIndex } from "./selectionSet";
import "./ColorInput.css";
import { useRAF } from "../../hooks/useRAF";

interface ColorInputProps {
  id?: string;
  value: string;
  selection?: Selection;
  setSelection?: (selection: Selection) => any;
  autoFocus?: boolean;
  width?: string;
  fontSize?: string;
  onChange: (value: string) => void;
  debug?: boolean;
  charClass?: CharClass;
  shortcutMap?: { [key: string]: (unPrevent: Function) => any };
}
export interface CharClass {
  (
    inSelection: boolean,
    character: string,
    index: number,
    string: string
  ): string;
}
const defaultCharClass: CharClass = (sel, char, i, s) =>
  sel ? "bg-blue-300 bg-opacity-50" : "inherit";

// Performance issues to work out
// - Could use useReducer to add keys for each char in the string
// - Maybe keys aren't needed, solve multiple renders with useReducer
// - Remove textarea onChange as selectChange can handle it all once?
// - Why does removing setSelection's mirrorSelection stop dragging/clicking from being shown?

export function ColorInput(props: ColorInputProps) {
  const { current: randomId } = useRef(
    "ColorInput" + String(Math.random()).slice(5, 13)
  );
  const id = props.id || randomId;
  const jeeves = useState<Selection>([0, 0, "none"]);
  const { selection = jeeves[0], setSelection = jeeves[1] } = props;

  const textareaRoot = document.querySelector("div.textareaRoot");
  const [focused, setFocused] = useState(false);
  const [cursorOn, setCursorOn] = useState(true);
  const [dragStart, setDragStart] = useState<null | number>(null);

  const textarea = useSelectionInput(selection, setSelection);
  const [request] = useRAF();
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const { width: paragraphWidth } = useResize(paragraphRef);

  useEffect(() => {
    if (!focused) return;
    setCursorOn(true);
    let flashInterval = setInterval(() => setCursorOn((old) => !old), 600);
    return () => clearInterval(flashInterval);
  }, [focused, selection]);

  useEffect(() => {
    const callback = (event: MouseEvent) => {
      if (dragStart === null) return;
      request(() => {
        const dragEnd = childIndex(event, paragraphRef);
        setSelection(
          dragEnd > dragStart
            ? [dragStart, dragEnd, "forward"]
            : [dragEnd, dragStart, "backward"]
        );
      });
    };
    document.body.addEventListener("mousemove", callback);
    return () => document.body.removeEventListener("mousemove", callback);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragStart]);

  useEffect(() => {
    const callback = (event: MouseEvent) => {
      if (dragStart === null) return;
      textarea.focus();
      setDragStart(null);
    };
    document.body.addEventListener("mouseup", callback);
    return () => document.body.removeEventListener("mouseup", callback);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragStart]);

  const {
    width = "100%",
    fontSize = "3rem",
    charClass = defaultCharClass,
    debug,
    shortcutMap = {},
  } = props;

  const spans = useMemo(() => {
    const spans: JSX.Element[] = [];
    Array.prototype.forEach.call(props.value + " ", (char, index) => {
      let className = "";
      if (index === textarea.cursorIndex) className += "cursor ";
      if (index < props.value.length)
        className += charClass(
          textarea.withinSelection(index),
          char,
          index,
          props.value
        );
      spans.push(
        <span className={className} key={index}>
          {char}
        </span>
      );
    });
    return spans;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [charClass, props.value, selection[0], selection[1]]);

  if (!textareaRoot) return null;
  return (
    <div className="ColorInput">
      <p
        className={
          "ColorInput " + (cursorOn && (focused || dragStart) ? "cursorOn" : "")
        }
        ref={paragraphRef}
        style={{ width, fontSize }}
        onMouseDown={(e) => {
          if (e.detail !== 1) return;
          const index = childIndex(e, paragraphRef);
          setSelection([index, index, "none"]);
          setDragStart(index);
        }}
        onClick={(e) => {
          textarea.focus();
          if (e.detail === 3)
            return setSelection([0, props.value.length, "forward"]);
          if (e.detail !== 2) return;
          const index = childIndex(e, paragraphRef, false);
          const word = /\w/.test(props.value[index]);
          const start =
            props.value.slice(0, index).match(word ? /\w+$/ : /\W+$/)?.[0] ??
            "";
          const end =
            props.value.slice(index).match(word ? /^\w+/ : /^\W+/)?.[0] ?? "";
          setSelection([index - start.length, index + end.length, "forward"]);
        }}
      >
        {spans}
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
          onKeyDown={(e) => {
            const shorcut = shortcutMap[e.key];
            if (shorcut) {
              let prevent = true;
              shorcut(() => (prevent = false));
              if (prevent) e.preventDefault();
            }
          }}
          onChange={(e) => props.onChange(e.target.value)}
          spellCheck={false}
          value={props.value}
          autoFocus={props.autoFocus}
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
