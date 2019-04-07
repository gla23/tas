import React, { useState, Fragment } from "react";
import "./App.css";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { withStyles } from "@material-ui/core/styles";
// import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
// import word from './word.png';
import logo from "./tasLogo.png";
import Tas from "./Tas.js";
import BibleSearch from "./BibleSearch.js";
import MajorSystem from "./MajorSystem";

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    // width: 500,
  },
});

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

const focusTextArea = () => {
  let textarea = document.getElementById("textarea");
  textarea && textarea.focus();
};

const App = props => {
  const [currentTab, setCurrentTab] = useState(0);

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
          {currentTab === 0 && <Tas />}
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
