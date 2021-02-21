import "./App.css";
import React, { useState } from "react";
import { SettingsInput } from "./components/SettingsInput";
import { CloseButton } from "./components/CloseButton";
import { CurrentProgress, TypePage } from "./components/TypePage";
import { DarkModeButton } from "./components/DarkModeButton";
import { rootWord } from "./utils/rootWord";
import {
  verb as rootVerb,
  noun as rootNoun,
  adjective as rootAdjective,
} from "wink-lemmatizer";

export const App = () => {
  const [menu, setMenu] = useState(false);
  const [input, setInput] = useState("passed");
  if (!menu)
    return (
      <>
        <div className="flex">
          <CloseButton size={48} onClick={(e) => setMenu(true)} />
          <CurrentProgress />
          <DarkModeButton size={48} />
        </div>
        <TypePage />
      </>
    );
  return (
    <>
      <SettingsInput setting="parseMnemonics">Translate</SettingsInput>
      <SettingsInput setting="dark">Dark mode</SettingsInput>
      <br />
      {rootWord(input)}
      {" <- "}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <br />
      {rootVerb(input)} Verb
      <br />
      {rootNoun(input)} Noun
      <br />
      {rootAdjective(input)} Adjective
    </>
  );
};
