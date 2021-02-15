import React, { useEffect, useState } from "react";
import { ColorInput } from "./ColorInput/ColorInput";
import {
  useQuiz,
  endTween,
  increaseQuestion,
  skipQuestion,
  finishQuestion,
} from "../ducks/quiz";
import { changeGuess, check, select } from "../ducks/textarea";
import { useDispatch } from "react-redux";
import { useTween, overShoot } from "../hooks/useTween";
import { charClass } from "../utils/colourProgress";
import { ProgressBar } from "./ProgressBar";
import { occurencesByRoot } from "../utils/occurences";

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

export function TypePage() {
  const dispatch = useDispatch();
  const { guess, highlight, clue, selection, answer, bank } = useQuiz();
  const [showing, setShowing] = useState(false);

  Object.entries(occurencesByRoot(bank))
    .filter(
      ([root, occurences]) => occurences.length > 1 && occurences.length < 5
    )
    .forEach(([root, occurences]) => console.log(root, occurences));

  const [tween, setTween] = useTween(highlight, {
    ...overShoot,
    onEnd: () => dispatch(endTween()),
  });
  useEffect(() => void (tween > guess.length && setTween(guess.length)));
  return (
    <>
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
          {showing && answer}
        </div>
      </div>
    </>
  );
}
