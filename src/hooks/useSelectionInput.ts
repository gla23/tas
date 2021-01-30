import { useEffect, useRef } from "react";

type Direction = "none" | "forward" | "backward";
export type Selection = [number, number, Direction];
type InputElement = HTMLInputElement | HTMLTextAreaElement;

export function useSelectionInput<E extends InputElement = HTMLTextAreaElement>(
  selection: Selection,
  setSelection: (selection: Selection) => any
) {
  const ref = useRef<E>(null);

  useEffect(() => {
    const elem = ref.current;
    if (!elem) return undefined;
    const [start, end, direction] = selection;
    elem.selectionStart = start;
    elem.selectionEnd = end;
    elem.selectionDirection = direction;
  }, [selection]);

  const selectionChangeCallback = (e: React.SyntheticEvent) => {
    const elem = ref.current;
    if (!elem) return false;
    setSelection([
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
    withinSelection,
    cursorIndex,
    focus,
    props: {
      ref,
      onSelect: selectionChangeCallback,
      onInput: selectionChangeCallback,
    },
  } as const;
}
