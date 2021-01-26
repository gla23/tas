import React, { useMemo, useState } from "react";
import { useParseMnemonic, useTheme } from "./ducks/settings";
import { useAwait } from "./hooks/useAwait";
import { memory, toQuestions } from "./questions/memory";
import { SettingsInput } from "./ducks/SettingsInput";
import {
  CharClass,
  ColorInput,
  Scrollable,
} from "./components/ColorInput/ColorInput";
import "./App.css";
import { changeGuess, check, useQuiz } from "./ducks/quiz";
import { useDispatch } from "react-redux";
import { useTween, overShoot } from "./hooks/useTween";

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));
const selected = "bg-blue-300 bg-opacity-50";
const right = (fraction: number) =>
  "bg-green-500 bg-opacity-" + 50 * clamp(Math.ceil(fraction * 5) / 5, 0, 1);
const wrong = (fraction: number) =>
  "bg-red-500 bg-opacity-" + 50 * clamp(Math.ceil(fraction * 5) / 5, 0, 1);
function charClass(highlight: number, correct: number): CharClass {
  return (sel, char, i, s) => {
    if (sel) return selected;
    if (i >= highlight) return "inherit";
    return i >= correct ? wrong(highlight - i) : right(highlight - i);
  };
}

export const App = () => {
  // Create Questionsets UI
  // Make correct check charClass function
  // Replace springs with own hook
  const bank = useAwait(memory);
  const parsing = useParseMnemonic();
  const theme = useTheme();
  const questions = useMemo(() => bank && toQuestions(bank, parsing), [
    parsing,
    bank,
  ]);
  const qs = questions?.filter((q) => q.id.match(/^a/));
  // const matches = qs?.flatMap((q) => q.match());
  // const collected = collectByString(qs);
  const dispatch = useDispatch();
  const { guess, correct, clue } = useQuiz();
  const [value2, setValue2] = useState("gg");
  const correctTweened = useTween(correct, overShoot);

  return (
    <div className={theme}>
      <Scrollable className="transition duration-500 text-black dark:text-white bg-white dark:bg-gray-800">
        <SettingsInput setting="parseMnemonics">Hide mnemonics</SettingsInput>
        <SettingsInput setting="dark">Dark mode</SettingsInput>
        <div className="max-w-4xl m-auto">
          <h2 className="text-6xl">{clue}</h2>
          <br />
          <ColorInput
            value={guess}
            onChange={(value) => dispatch(changeGuess(value))}
            charClass={charClass(correctTweened, correct)}
            shortcutMap={{
              Enter: () => dispatch(check()),
              PageDown: () => console.log("increaseQuestion"),
              "=": () => console.log("changeQuestion"),
            }}
          />
          <ColorInput width="50%" value={value2} onChange={setValue2} />
          {qs?.length}
          {/* <pre>{JSON.stringify(qs, null, 2)}</pre> */}
        </div>
      </Scrollable>
    </div>
  );
};
