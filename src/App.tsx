import React, { useMemo, useState } from "react";
import { useParseMnemonic } from "./ducks/settings";
import { useAwait } from "./hooks/useAwait";
import { memory, toQuestions } from "./questions/memory";
import { SettingsInput } from "./ducks/SettingsInput";
import { ColorInput, Scrollable } from "./components/ColorInput/ColorInput";

export const App = () => {
  const bank = useAwait(memory);
  const parsing = useParseMnemonic();
  const questions = useMemo(() => bank && toQuestions(bank, parsing), [
    parsing,
    bank,
  ]);
  const qs = questions?.filter((q) => q.id.match(/^a/));
  const [value, setValue] = useState("ggwp");
  const [value2, setValue2] = useState("gg");
  return (
    <Scrollable>
      <SettingsInput setting="parseMnemonics">Hide mnemonics</SettingsInput>
      <SettingsInput setting="dark">Dark mode</SettingsInput>
      <br />
      <ColorInput
        value={value}
        onChange={setValue}
        charColor={(sel) => (sel ? "#94b5ff" : "#F99")}
      />
      <ColorInput
        width="50%"
        value={value2}
        onChange={setValue2}
        charColor={(sel) => (sel ? "#94b5ff" : "#F99")}
      />
      {qs?.length}
      <pre>{JSON.stringify(qs, null, 2)}</pre>
    </Scrollable>
  );
};
