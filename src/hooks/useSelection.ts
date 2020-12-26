import { useState } from "react";

export function useSelection() {
  const [selection, setSelection] = useState<[number, number, string]>([
    0,
    0,
    "none",
  ]);
  const mirrorSelection = (target: {
    selectionStart: number;
    selectionEnd: number;
    selectionDirection: string;
  }) =>
    setSelection([
      target.selectionStart,
      target.selectionEnd,
      target.selectionDirection,
    ]);

  const withinSelection = (index: number) =>
    index >= selection[0] && index < selection[1];
  const hasCursor = (index: number) =>
    (selection[0] === selection[1] && selection[1] === index) ||
    (selection[1] === index && selection[2] === "forward") ||
    (selection[0] === index && selection[2] === "backward");
  return [selection, mirrorSelection, withinSelection, hasCursor] as const;
}
