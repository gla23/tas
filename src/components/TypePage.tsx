import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectMainAnswer } from "../ducks/gameSelectors";
import {
  endTween,
  finishQuestion,
  increaseQuestion,
  skipQuestion,
  useQuiz,
} from "../ducks/root";
import {
  changeGuess,
  check,
  select,
  useTextAreaState,
} from "../ducks/textarea";
import { overShoot, useTween } from "../hooks/useTween";
import { charClass } from "../utils/colourProgress";
import { ColorInput } from "./ColorInput/ColorInput";
import { Hints } from "./Hints";
import { ProgressBar } from "./ProgressBar";
import { WordFindProgress } from "./WordFindProgress";

export function TypePage() {
  const dispatch = useDispatch();
  const { clue } = useQuiz();
  const mainAnswer = useSelector(selectMainAnswer);
  const { guess, highlight, selection } = useTextAreaState();
  const [showing, setShowing] = useState(false);
  const [tween, setTween] = useTween(highlight, {
    ...overShoot,
    onEnd: () => dispatch(endTween()),
  });

  useEffect(() => {
    if (tween > guess.length && highlight >= guess.length)
      setTween(guess.length);
  });

  return (
    <>
      <div className="flex m-auto max-w-3xl mt-36">
        <div className="my-auto w-full">
          <h2 className="text-6xl font-mono mt-5">
            {clue}{" "}
            <span
              className="text-xl align-middle font-sans"
              onClick={() => setShowing((v) => !v)}
            >
              <WordFindProgress />
            </span>
          </h2>
          <br />
          <ColorInput
            value={guess}
            autoFocus
            onChange={(value) => dispatch(changeGuess(value))}
            charClass={charClass(tween, mainAnswer)}
            selection={selection}
            onSelectionChange={(sel) => dispatch(select(sel))}
            shortcutMap={{
              Enter: () => dispatch(check()),
              PageDown: () => dispatch(increaseQuestion(1)),
              PageUp: () => dispatch(increaseQuestion(-1)),
              "@": () => dispatch(skipQuestion()),
              "~": () => dispatch(finishQuestion()),
              "[": () => setShowing((v) => !v),
            }}
          />
          {showing && <Hints />}
        </div>
      </div>
    </>
  );
}

export const CurrentProgress: React.FunctionComponent = () => {
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
