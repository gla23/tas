import "./App.css";
import React, { useState } from "react";
import { SettingsInput } from "./ducks/SettingsInput";
import { CloseButton } from "./CloseButton";
import { TypePage } from "./TypePage";
import { ProgressBar } from "./ProgressBar";
import { useQuiz } from "./ducks/quiz";
import { DarkModeButton } from "./DarkModeButton";

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

const CurrentProgress: React.FunctionComponent = () => {
  const { completed, completedGoal } = useQuiz();
  return (
    <div className="m-auto px-32 flex-grow">
      <ProgressBar complete={completed / completedGoal} className="w-full">
        <span className="font-sans text-xs">
          {completed}/{completedGoal}
        </span>
      </ProgressBar>
    </div>
  );
};
