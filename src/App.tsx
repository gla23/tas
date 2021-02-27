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
import { useDispatch, useSelector } from "react-redux";
import { chooseGame, RootState } from "./ducks/root";
import { GameState } from "./ducks/game";
import { verseWords } from "./utils/occurrences";
import { HueSlider } from "./HueSlider";
import { Passage } from "bible-tools";

export const App = () => {
  const dispatch = useDispatch();
  const bank = useSelector((state: RootState) => state.bank);
  const [menu, setMenu] = useState(false);
  const [word, setWord] = useState("passed");
  const [verse, setVerse] = useState("teg");
  const passage = new Passage(verse || "t");
  const newVerseIndex = Object.keys(bank).indexOf(verse);
  const [findWords, setFindWords] = useState("");

  const goGame = (game: GameState, filter: string) => {
    setMenu(false);
    dispatch(chooseGame(game, filter));
  };
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
      Random recall from:
      <span
        className="mt-3"
        onClick={(e) =>
          filterOf(e) &&
          goGame(
            {
              type: "recall",
              order: "random",
              questionIndex: 0,
              inOrderCount: 2,
              inOrderDone: 0,
              setIndexesLeft: [],
            },
            filterOf(e)
          )
        }
      >
        <VerseSections />
      </span>
      <br />
      <div className="mt-6"></div>
      <span
        className="mt-3"
        onClick={(e) =>
          filterOf(e) &&
          goGame(
            {
              type: "find",
              order: "random",
              answerType: "text",
              hintType: "text",
              questionIndex: 0,
              queue: findWords ? findWords.split(" ") : [],
              found: [],
            },
            filterOf(e)
          )
        }
      >
        Find random word from: <VerseSections />
      </span>
      <br />
      starting with:{" "}
      <input
        type="text mt-8"
        value={findWords}
        onChange={(e) => setFindWords(e.target.value)}
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
                  order: "next",
                  answerType: "text",
                  hintType: "text",
                  questionIndex: 0,
                  queue: verseWords(bank[verse]),
                  found: [],
                },
                passage.book.shortcut
              )
            }
          >
            Find each word in {passage.reference} throughout {passage.book.name}{" "}
          </span>
        </>
      )}
      <br />
      <div className="mt-3"></div>
      <h2 className="text-xl">Practice strats</h2>
      Old:
      <ul>
        <li className="opacity-70">- Recall random pairs</li>
        <li className="opacity-70">- Find occurrences of random words</li>
        <li className="opacity-70">
          - Find occurrences of each word in one verse
        </li>
      </ul>
      Recent:
      <ul>
        <li className="opacity-70">- Same as above for smaller group?</li>
        <li className="opacity-70">- Draw chapter map on paper</li>
      </ul>
      New:
      <ul>
        <li className="opacity-70">- Observe, define/image, recall</li>
        <li className="opacity-70">- Recall with time limit</li>
        <li className="opacity-70">
          - Find occurrences of each word in new verse
        </li>
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
    </>
  );
};

const verseSections = {
  "All verses": "^",
  Matthew: "^a",
  James: "^t",
  Psalms: "^ps",
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
