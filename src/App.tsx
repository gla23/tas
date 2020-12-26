import React, { useMemo, useState } from "react";
import { useParseMnemonic } from "./ducks/settings";
import { useAwait } from "./hooks/useAwait";
import { memory, toQuestions } from "./questions/memory";
import { SettingsInput } from "./ducks/SettingsInput";
import { ColorInput } from "./components/ColorInput";

export const App = () => {
  const bank = useAwait(memory);
  const parsing = useParseMnemonic();
  const questions = useMemo(() => bank && toQuestions(bank, parsing), [
    parsing,
    bank,
  ]);
  const [value, setValue] = useState("ggwp");
  return (
    <>
      <SettingsInput setting="parseMnemonics">Hide mnemonics</SettingsInput>
      <br />
      <ColorInput
        id="test"
        value={value}
        onChange={setValue}
        charColor={(sel) => (sel ? "#94b5ff" : "#FFF")}
      />
      <pre>{JSON.stringify(questions, null, 2)}</pre>
    </>
  );
};
