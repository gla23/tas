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
import { RootState } from "./ducks/root";
import { GameState, chooseGame } from "./ducks/game";
import { verseWords } from "./utils/occurrences";
import { HueSlider } from "./components/HueSlider";
import { Passage } from "bible-tools";
import { closeGame, usePage } from "./ducks/navigation";
import { selectGameDescription } from "./ducks/gameSelectors";

// Listen to min width from text size
// Make modal for "?" with keyboard shortcuts (and later fancy info cards)
// How to delay finishing the previous one... need to hold it there until the progress bar is done
// Work out how to get all ESV verses
// Build game collecting UI - proper test for game description.

export const App = () => {
  const dispatch = useDispatch();
  const bank = useSelector((state: RootState) => state.bank);
  const page = usePage();
  const [word, setWord] = useState("passed");
  const [verse, setVerse] = useState("prcg");
  const passage = new Passage(verse || "t");
  const newVerseIndex = Object.keys(bank).indexOf(verse);
  const [findWords, setFindWords] = useState("");
  const gameDescription = useSelector(selectGameDescription);
  const goGame = (game: GameState, filter: string) => {
    dispatch(chooseGame(game, filter));
  };
  if (page === "game")
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
              completed: 0,
              completedGoal: 20,
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
              completed: 0,
              completedGoal: 3,
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
        <li className="opacity-70">
          - Make intro page for the practice section
        </li>
        <li className="opacity-70">
          You are doing random (2 in a row) over these verses
        </li>
        <li className="opacity-70">difficulty: hard</li>
        <li className="opacity-70">This helps train the following things...</li>
        <li className="opacity-70">Recall</li>
        <li className="opacity-70">Random Recall</li>
        <li className="opacity-70">Word find</li>
        <li className="opacity-70">Word find with recap</li>
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
  Assorted:
    "^prce-f|^sl|^ps139|^prp|^fo|^la[i-l]|^jerq|^ubk|^cr|^fhş|^ba[n-o]|^gaq|^gmd-g",
  Matthew: "^a",
  "5-7": "^a[e-g]",
  "8-9 ": "^a[h-i]",
  "10 ": "^aj",
  James: "^t",
  "1-3": "^t[a-c]",
  "4-5": "^t[d-e]",
  Psalms: "^ps",
  "16 ": "^psp",
  "25 ": "^psy",
  "67 ": "^ps67",
  Warfare: "^jf",
  "New Assorted": "^pr(s|cg)|^ibt|^sc|^cj|^isM",
  Genesis: "^gen",
  Revelation: "^rev",
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
