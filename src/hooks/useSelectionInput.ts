import { useRef, useState } from "react";

type Direction = "none" | "forward" | "backward";
type Selection = [number, number, Direction];
type InputElement = HTMLInputElement | HTMLTextAreaElement;

export function useSelectionInput<
  E extends InputElement = HTMLTextAreaElement
>() {
  const ref = useRef<E>(null);

  function setSelection(selection: Selection) {
    const elem = ref.current;
    if (!elem) return false;
    const [start, end, direction] = selection;
    elem.selectionStart = start;
    elem.selectionEnd = end;
    elem.selectionDirection = direction;
    mirrorSelection(selection);
  }
  const [selection, mirrorSelection] = useState<Selection>([0, 0, "none"]);

  const selectionChangeCallback = (e: React.SyntheticEvent) => {
    const elem = ref.current;
    if (!elem) return false;
    mirrorSelection([
      elem.selectionStart || 0,
      elem.selectionEnd || 0,
      elem.selectionDirection || "none",
    ]);
  };

  const withinSelection = (index: number) =>
    index >= selection[0] && index < selection[1];
  const cursorIndex = selection[2] === "backward" ? selection[0] : selection[1];
  const focus = () => ref.current?.focus();

  return {
    ref,
    selection,
    setSelection,
    withinSelection,
    cursorIndex,
    focus,
    props: { ref, onSelect: selectionChangeCallback },
  } as const;
}
