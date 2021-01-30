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
import { changeGuess, check, select, useQuiz } from "./ducks/quiz";
import { useDispatch } from "react-redux";
import { useTween, overShoot } from "./hooks/useTween";

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));
const selected = "bg-blue-300 bg-opacity-50";
const right = (fraction: number) =>
  "bg-green-500 bg-opacity-" + 50 * clamp(Math.round(fraction * 5) / 5, 0, 1);
const wrong = (fraction: number) =>
  "bg-red-500 bg-opacity-" + 50 * clamp(Math.round(fraction * 5) / 5, 0, 1);
function charClass(highlight: number, answer: string): CharClass {
  return (sel, char, i, s) => {
    if (sel) return selected;
    if (i >= highlight) return "inherit";
    return char === answer[i] ? right(highlight - i) : wrong(highlight - i);
  };
}

export const App = () => {
  // Create Questionsets UI
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
  const { guess, highlight, clue, selection, answer } = useQuiz();
  const [value2, setValue2] = useState("gg");
  const tween = useTween(highlight, overShoot);

  return (
    <div className={theme}>
      <Scrollable className="transition duration-500 text-black dark:text-white bg-white dark:bg-gray-800">
        <SettingsInput setting="parseMnemonics">Hide mnemonics</SettingsInput>
        <SettingsInput setting="dark">Dark mode</SettingsInput>
        <div className="flex m-auto max-w-3xl mt-36">
          <div className="my-auto w-full">
            <h2 className="text-6xl font-mono mt-5">{clue}</h2>
            <br />
            <ColorInput
              value={guess}
              autoFocus
              onChange={(value) => dispatch(changeGuess(value))}
              charClass={charClass(tween, answer)}
              selection={selection}
              setSelection={(sel) => dispatch(select(sel))}
              shortcutMap={{
                Enter: () => dispatch(check()),
                PageDown: () => console.log("increaseQuestion"),
                "=": () => console.log("changeQuestion"),
              }}
            />
            {/* <ColorInput width="50%" value={value2} onChange={setValue2} /> */}
            {/* {qs?.length} */}
            {/* <pre>{JSON.stringify(qs, null, 2)}</pre> */}
          </div>
        </div>
      </Scrollable>
    </div>
  );
};
