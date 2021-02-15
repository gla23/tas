import { CharClass } from "../components/ColorInput/ColorInput";

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));
const selected = "bg-blue-300 bg-opacity-50";
const right = (fraction: number) =>
  "bg-green-500 bg-opacity-" + 50 * clamp(Math.round(fraction * 5) / 5, 0, 1);
const wrong = (fraction: number) =>
  "bg-red-500 bg-opacity-" + 50 * clamp(Math.round(fraction * 5) / 5, 0, 1);
export function charClass(highlight: number, answer: string): CharClass {
  return (sel, char, i, s) => {
    if (sel) return selected;
    if (i >= highlight) return "inherit";
    return char === answer[i] ? right(highlight - i) : wrong(highlight - i);
  };
}
