import "./App.css";
import React, { useState } from "react";
import { SettingsInput } from "./ducks/SettingsInput";
import { CloseButton } from "./components/CloseButton";
import { CurrentProgress, TypePage } from "./components/TypePage";
import { DarkModeButton } from "./components/DarkModeButton";

export const App = () => {
  const [menu, setMenu] = useState(false);
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
    </>
  );
};
