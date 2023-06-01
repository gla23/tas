import "../App.css";
import React, { useState } from "react";
import { SettingsInput } from "../components/SettingsInput";
import { GamePage } from "./GamePage";
import { rootWord } from "../utils/rootWord";
import {
  verb as rootVerb,
  noun as rootNoun,
  adjective as rootAdjective,
} from "wink-lemmatizer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../ducks/root";
import { GameState, chooseGame } from "../ducks/game";
import { verseWords } from "../utils/occurrences";
import { HueSlider } from "../components/HueSlider";
import { Passage } from "bible-tools";
import { usePage } from "../ducks/navigation";
import { RecallGame } from "../games/RecallGame";
import { FindGame } from "../games/FindGame";
import { Thing } from "./Thing";
import { ContentModal } from "content-modal";

const randomRecall: RecallGame = {
  type: "recall",
  completed: 0,
  completedGoal: 12,
  order: "random",
  questionIndex: 0,
  inOrderCount: 2,
  inOrderDone: 0,
  setIndexesLeft: [],
};
const typeOut: RecallGame = {
  ...randomRecall,
  order: "next",
  inOrderCount: 1,
  completedGoal: Infinity,
};
export const App = () => {
  const dispatch = useDispatch();
  const bank = useSelector((state: RootState) => state.bank);
  if (!bank)
    throw new Error(
      "The bank is missing. Likely fix is to do localStorage.clear()"
    );
  const page = usePage();
  const dark = useSelector((state: RootState) => state.settings.dark);
  const [word, setWord] = useState("passed");
  const [verse, setVerse] = useState("genah");
  const [doRecap, setDoRecap] = useState(true);
  const passage = new Passage(verse || "t");
  const newVerseIndex = Object.keys(bank).indexOf(verse);
  const [findWords, setFindWords] = useState("");
  const [help, setHelp] = useState(false);
  const findGame: FindGame = {
    type: "find",
    completed: 0,
    completedGoal: 3,
    order: "choose",
    answerType: "text",
    hintType: "text",
    questionIndex: -1,
    queue: findWords ? findWords.split(" ") : [],
    found: [],
    doRecap,
  };

  const goGame = (game: GameState, filter: string) => {
    dispatch(chooseGame(game, filter));
  };
  if (page === "game") return <GamePage />;
  return (
    <>
      <ContentModal
        darkMode={dark}
        content={[
          "a",
          "b b b b b b b b b b b b b b b b b b b b b b b b b b b b b b b b b b b b b b b b b b b",
          "c",
          <Thing />,
        ]}
        width={800}
        height={400}
        onClose={() => setHelp(false)}
        isOpen={help}
      />
      <span
        className="mt-3"
        onClick={(e) => filterOf(e) && goGame(typeOut, filterOf(e))}
      >
        Type out:{" "}
        <span className="ml-24">
          <VerseSections />
        </span>
      </span>
      <br />
      <br />
      <span
        className="mt-3"
        onClick={(e) => filterOf(e) && goGame(randomRecall, filterOf(e))}
      >
        Random recall from:
        <span className="ml-6">
          <VerseSections />
        </span>
      </span>
      <br />
      <div className="mt-6"></div>
      <span
        className="mt-3"
        onClick={(e) => filterOf(e) && goGame(findGame, filterOf(e))}
      >
        Find random word from: <VerseSections />
      </span>
      <br />
      starting with:{" "}
      <input
        type="text"
        value={findWords}
        onChange={(e) => setFindWords(e.target.value)}
      />
      <br />
      recap after:{" "}
      <input
        type="checkbox"
        checked={doRecap}
        onChange={(e) => setDoRecap(e.target.checked)}
      />
      <br />
      <div className="mt-6"></div>
      New verse:{" "}
      <input
        type="text"
        className="mt-3 w-14"
        value={verse}
        onChange={(e) => setVerse(e.target.value)}
      />
      <span className="ml-4" />
      {newVerseIndex === -1 ? (
        "Invalid verse"
      ) : (
        <>
          <span
            className="opacity-50 cursor-pointer"
            onClick={() =>
              goGame(
                {
                  type: "recall",
                  completed: 0,
                  completedGoal: Infinity,
                  order: "next",
                  setIndexesLeft: [],
                  inOrderDone: 1,
                  inOrderCount: 0,
                  questionIndex: newVerseIndex,
                },
                "^"
              )
            }
          >
            Observe and recall
          </span>
          <br />
          <span
            className="mt-3 opacity-50 cursor-pointer"
            onClick={() =>
              goGame(
                {
                  type: "find",
                  completed: 0,
                  completedGoal: 10,
                  order: "next",
                  answerType: "text",
                  hintType: "text",
                  questionIndex: 0,
                  queue: verseWords(bank[verse]),
                  found: [],
                  doRecap,
                },
                "^" + passage.book.shortcut
              )
            }
          >
            Find each word in {passage.reference} throughout {passage.book.name}{" "}
            {"^" + passage.book.shortcut}
          </span>
        </>
      )}
      <br />
      <div className="mt-3"></div>
      <h2 className="text-xl">Practice strats</h2>
      Ready for meditation:
      <ul>
        <li className="opacity-70">- Recall random pairs</li>
        <li className="opacity-70">- Find occurrences of 3 words</li>
      </ul>
      Recent (consolidation? piecing together?):
      <ul>
        <li className="opacity-70">- Same as above for smaller group?</li>
        <li className="opacity-70">- Draw chapter map on paper</li>
      </ul>
      <h2 className="text-xl mt-2">Ideas</h2>
      all:
      <ul>
        <li className="opacity-70">- Occurrences of word pairs</li>
        <li className="opacity-70">- Type rest of verse for occurrence find</li>
        <li className="opacity-70">- Type/recall speed goal/limit</li>
        <li className="opacity-70">
          - After finding occurrences, find references. With time limit?
        </li>
        <li className="opacity-70">
          - Find way of filtering "meaningful" words? Use wink for nouns?
        </li>
      </ul>
      <div className="mt-12" />
      {rootWord(word)}
      {" <- "}
      <input
        type="text"
        value={word}
        onChange={(e) => setWord(e.target.value)}
      />
      <br />
      {rootVerb(word)} Verb
      <br />
      {rootNoun(word)} Noun
      <br />
      {rootAdjective(word)} Adjective
      <br />
      <HueSlider />
      <br />
      <SettingsInput setting="parseMnemonics">Translate</SettingsInput>
      <SettingsInput setting="dark">Dark mode</SettingsInput>
      <button onClick={() => setHelp((a) => !a)}>❔ {String(help)}</button>
    </>
  );
};

const verseSections = {
  All: "^",
  // Assorted:
  //   "^prce-f|^sl|^ps139|^prp|^fo|^la[i-l]|^jerq|^ubk|^cr|^fhş|^ba[n-o]|^gaq|^gmd-g",
  // "New Assorted": "^gf|^pr(s|cg)|^ibt|^dmD|^sc|^cj|^isM",
  Matthew: "^a[e-i]",
  "5-7": "^a[e-g]",
  "8-9 ": "^a[h-i]",
  "10 ": "^aj",
  "11 ": "^ak",
  James: "^t",
  "1-3": "^t[a-c]",
  "3-5": "^t[c-e]",
  "4-5": "^t[d-e]",
  Psalms: "^ps",
  "16 ": "^psp",
  "25 ": "^psy",
  "67 ": "^ps67",
  Warfare: "^jf",
  Genesis: "^gen",
  "1-2  ": "^gen[a-b]",
  "3  ": "^genc",
  Revelation: "^rev",
  "1-2 ": "^rev[a-b]",
  "3 ": "^revc",
};
const VerseSections = () => (
  <>
    {Object.entries(verseSections).map(([name, filter], index) => (
      <span
        key={index}
        className={"text-xl mt-3 ml-3 cursor-pointer opacity-50"}
        data-verse-filter={filter}
      >
        {name}
      </span>
    ))}
  </>
);
const filterOf = (e: React.MouseEvent) => {
  if (!(e.target instanceof HTMLSpanElement)) return "";
  return e.target.getAttribute("data-verse-filter") || "";
};
