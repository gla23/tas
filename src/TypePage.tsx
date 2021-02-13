import React, { useEffect, useState } from "react";
import { ColorInput } from "./ColorInput/ColorInput";
import {
  useQuiz,
  endTween,
  increaseQuestion,
  skipQuestion,
  finishQuestion,
} from "./ducks/quiz";
import { changeGuess, check, select } from "./ducks/textarea";
import { useDispatch } from "react-redux";
import { useTween, overShoot } from "./hooks/useTween";
import { charClass } from "./utils/colourProgress";

export function TypePage() {
  const dispatch = useDispatch();
  const { guess, highlight, clue, selection, answer } = useQuiz();
  const [showing, setShowing] = useState(false);

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
              "[": () => setShowing((v) => !v),
              "~": () => dispatch(finishQuestion()),
            }}
          />
          {showing && answer}
        </div>
      </div>
    </>
  );
}
