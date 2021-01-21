import React, { useMemo, useState } from "react";
import { Motion, spring } from "react-motion";
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

const selected = "bg-blue-300 bg-opacity-50";

function memo<A, R>(fn: (arg: A) => R): (arg: A) => R {
  let previous: A | undefined;
  let previousValue: R | undefined;
  return (arg: A) => {
    if (previousValue && previous === arg) return previousValue;
    previousValue = fn(arg);
    previous = arg;
    return previousValue;
  };
}
function charClass(upTo: number): CharClass {
  return (sel, char, i, s) =>
    sel ? selected : i < upTo ? "bg-red-500 bg-opacity-50" : "inherit";
}
const memoCharClass = memo(charClass);

export const App = () => {
  // Create Questionsets UI
  // Add shortcut key listening
  // Make correct check charClass function
  // Do the animation stuff - perhaps copy over
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
  const [value, setValue] = useState(
    "ggwp sldkfjdsljk kf sfldkj djsfk ggwp sldkfjdsljk kf sfldkj djsfk ggwp sldkfjdsljk kf sfldkj djsfk ggwp sldkfjdsljk kf sfldkj djsfk "
  );
  const [value2, setValue2] = useState("gg");

  return (
    <div className={theme}>
      <Scrollable className="transition duration-500 text-black dark:text-white bg-white dark:bg-gray-800">
        <SettingsInput setting="parseMnemonics">Hide mnemonics</SettingsInput>
        <SettingsInput setting="dark">Dark mode</SettingsInput>
        <br />
        <Motion style={{ length: spring(value2.length) }}>
          {(style) => (
            <ColorInput
              value={value}
              onChange={setValue}
              charClass={memoCharClass(Math.floor(style.length))}
            />
          )}
        </Motion>
        <ColorInput width="50%" value={value2} onChange={setValue2} />
        {qs?.length}
        {/* <pre>{JSON.stringify(qs, null, 2)}</pre> */}
      </Scrollable>
    </div>
  );
};
