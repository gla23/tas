import React, { useMemo, useState } from "react";
import { useParseMnemonic, useTheme } from "./ducks/settings";
import { useAwait } from "./hooks/useAwait";
import { memory, toQuestions } from "./questions/memory";
import { SettingsInput } from "./ducks/SettingsInput";
import { ColorInput, Scrollable } from "./components/ColorInput/ColorInput";
import "./App.css";

export const App = () => {
  // Add select with mouse
  // Create Questionsets UI
  // Add shortcut key listening
  // Make correct check charClass function
  // Do the animation stuff - perhaps copy over
  // Make ColorInput listen to mouse selections
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
  const [value, setValue] = useState("ggwp");
  const [value2, setValue2] = useState("gg");
  return (
    <div className={theme}>
      <Scrollable className="transition duration-500 text-black dark:text-white bg-white dark:bg-gray-800">
        <SettingsInput setting="parseMnemonics">Hide mnemonics</SettingsInput>
        <SettingsInput setting="dark">Dark mode</SettingsInput>
        <br />
        <ColorInput value={value} onChange={setValue} />
        <ColorInput width="50%" value={value2} onChange={setValue2} />
        {qs?.length}
        {/* <pre>{JSON.stringify(qs, null, 2)}</pre> */}
      </Scrollable>
    </div>
  );
};
