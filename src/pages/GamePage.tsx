import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectGameDescription } from "../ducks/gameSelectors";
import { useQuiz } from "../ducks/root";
import { ProgressBar } from "../components/ProgressBar";
import { WordFindProgress } from "../components/WordFindProgress";
import { CloseButton } from "../components/CloseButton";
import { DarkModeButton } from "../components/DarkModeButton";
import { closeGame } from "../ducks/navigation";
import { TypeWidget } from "./TypeWidget";
import { selectGameWidget } from "../ducks/game";
import { CheckboxesWidget } from "./CheckboxesWidget";

export type StatePair<T> = [T, React.Dispatch<React.SetStateAction<T>>];

export function GamePage() {
  const dispatch = useDispatch();
  const { clue } = useQuiz();
  const gameDescription = useSelector(selectGameDescription);
  const hintState = useState(false);
  const [, setShowHints] = hintState;
  const gameWidget = useSelector(selectGameWidget);

  return (
    <>
      <div className="flex">
        <CloseButton size={48} onClick={(e) => dispatch(closeGame())} />
        <div className="m-auto px-32 flex-grow">
          <div className="pb-2">{gameDescription}</div>
          <CurrentProgress />
        </div>
        <DarkModeButton size={48} />
      </div>
      <div className="flex m-auto max-w-3xl sm:mt-20 md:mt-36">
        <div className="my-auto w-full">
          <h2 className="text-6xl font-mono mt-5">
            {clue}{" "}
            {gameWidget.type !== "checkboxes" && (
              <span
                className="text-xl align-middle font-sans"
                onClick={() => setShowHints((v) => !v)}
              >
                <WordFindProgress />
              </span>
            )}
          </h2>
          <br />
          {gameWidget.type === "checkboxes" ? (
            <CheckboxesWidget />
          ) : (
            <TypeWidget hintState={hintState} />
          )}
        </div>
      </div>
    </>
  );
}

export const CurrentProgress: React.FunctionComponent = () => {
  const { completed, completedGoal } = useQuiz().game;
  return (
    <ProgressBar complete={completed / completedGoal} className="w-full">
      <span className="font-sans text-xs">
        {completed}/{completedGoal}
      </span>
    </ProgressBar>
  );
};
