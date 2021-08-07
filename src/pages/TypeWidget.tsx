import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectMainAnswer } from "../ducks/gameSelectors";
import {
  endCheckTween,
  finishQuestion,
  increaseQuestion,
  skipQuestion,
} from "../ducks/game";
import {
  changeGuess,
  check,
  select,
  useTextAreaState,
} from "../ducks/textarea";
import { overShoot, useTween } from "../hooks/useTween";
import { charClass } from "../utils/colourProgress";
import { ColorInput } from "../components/ColorInput/ColorInput";
import { Hints } from "../components/Hints";
import { StatePair } from "./GamePage";

export const TypeWidget = (props: { hintState: StatePair<boolean> }) => {
  const [showing, setShowing] = props.hintState;
  const dispatch = useDispatch();
  const mainAnswer = useSelector(selectMainAnswer);
  const { guess, highlight, selection } = useTextAreaState();
  const [tween, setTween] = useTween(highlight, {
    ...overShoot,
    onEnd: () => dispatch(endCheckTween()),
  });

  useEffect(() => {
    if (tween > guess.length && highlight >= guess.length)
      setTween(guess.length);
  });
  return (
    <>
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
      <br />
      {showing && <Hints />}
    </>
  );
};
