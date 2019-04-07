import React, { useState, useEffect, Fragment } from "react";
import "./App.css";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { withStyles } from "@material-ui/core/styles";
// import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
// import word from './word.png';
import logo from "./tasLogo.png";
import MemoriseTab from "./MemoriseTab";
import BibleSearch from "./BibleSearch";
import MajorSystem from "./MajorSystem";
import { parseVerse } from "./verseCodeParsing";

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    // width: 500,
  },
});

const loopEnd = 162;
const loopStart = loopEnd - 15;
const loopSectionSize = 15;

const appHeader = () => (
  <header className="App-header">
    <h3>Type and see</h3>
    <img
      src={logo}
      alt={"tasLogo"}
      style={{ width: "100px", marginLeft: "30px", marginTop: "-10px" }}
    />
    <p />
  </header>
);

function parseTextLines(text) {
  let answers = {};
  let clues = [];

  let lines = text.split("\n");
  for (var i = 0; i < lines.length; i++) {
    if (i % 2 === 0) {
      let clue = lines[i].length <= 6 ? parseVerse(lines[i]) : lines[i];
      answers[clue] = lines[i + 1];
      clues.push(clue);
    }
  }
  return { clues, answers };
}

const focusTextArea = () => {
  let textarea = document.getElementById("textarea");
  textarea && textarea.focus();
};

const App = props => {
  const [currentTab, setCurrentTab] = useState(0);
  const [answers, setAnswers] = useState({ " ": "" });
  const [clues, setClues] = useState([" "]);

  useEffect(() => {
    fetch("memory.txt")
      .then(response => response.text())
      .then(text => parseTextLines(text))
      .then(({ clues, answers }) => {
        setAnswers(answers);
        setClues(clues);
      });
  }, []);

  return (
    <div className="App" onClick={focusTextArea}>
      {appHeader()}

      {true && (
        <AppBar position="static" className={props.classes.root}>
          <Tabs
            value={currentTab}
            onChange={(event, value) => setCurrentTab(value)}
            indicatorColor="primary"
            textColor="primary"
            centered
            // theme="dark" hmm supposed to be object
          >
            <Tab label="Tas" />
            <Tab label="Search" />
            <Tab label="Major System" />
          </Tabs>
        </AppBar>
      )}

      <div className="maxWidthFloat">
        <div className="AppSection">
          {currentTab === 0 && (
            <MemoriseTab
              answers={answers}
              clues={clues}
              loopStart={loopStart}
              loopEnd={loopEnd}
              loopSectionSize={loopSectionSize}
            />
          )}
          {currentTab === 1 && (
            <Fragment>
              <BibleSearch text="" />
            </Fragment>
          )}
          {currentTab === 2 && (
            <Fragment>
              <MajorSystem />
            </Fragment>
          )}
        </div>
      </div>
    </div>
  );
};

export default withStyles(styles)(App);
