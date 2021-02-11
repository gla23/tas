import "./App.css";
import React, { useEffect, useState } from "react";
import { useTheme } from "./ducks/settings";
import { memory } from "./utils/memory";
import { SettingsInput } from "./ducks/SettingsInput";
import { ColorInput, Scrollable } from "./ColorInput/ColorInput";
import {
  useQuiz,
  endTween,
  loadBank,
  increaseQuestion,
  skipQuestion,
} from "./ducks/quiz";
import { changeGuess, check, select } from "./ducks/textarea";
import { useDispatch } from "react-redux";
import { useTween, overShoot } from "./hooks/useTween";
import { charClass } from "./utils/colourProgress";

export const App = () => {
  const dispatch = useDispatch();
  const { guess, highlight, clue, selection, answer, completed } = useQuiz();
  const theme = useTheme();
  const [tween, setTween] = useTween(highlight, {
    ...overShoot,
    onEnd: () => dispatch(endTween()),
  });
  useEffect(() => void (tween > guess.length && setTween(guess.length)));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => void memory.then((bank) => dispatch(loadBank(bank))), []);

  const [showing, setShowing] = useState(false);
  return (
    <div className={theme}>
      <Scrollable className="transition duration-500 text-black dark:text-white bg-white dark:bg-gray-800">
        <SettingsInput setting="parseMnemonics">Translate</SettingsInput>
        <SettingsInput setting="dark">Dark mode</SettingsInput>
        <span className="text-2xl font-sans">{completed + 1}</span>
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
              }}
            />
            {showing && answer}
          </div>
        </div>
      </Scrollable>
    </div>
  );
};
