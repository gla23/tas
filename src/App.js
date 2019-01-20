import React, { Component } from "react";
import Tas from "./Tas.js";
import "./App.css";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { withStyles } from '@material-ui/core/styles';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
// import word from './word.png';
import logo from './tasLogo.png';
// import logo2 from './tasLogo2.png';
// import logo3 from './tasLogo3.png';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    // width: 500,
  },
});

class App extends Component {
  state = {
    value: 0
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const tasDivStyle = { marginLeft: "60", marginRight: "60" };
    return (
      <div
        className="App"
        onClick={function() {
          let textarea = document.getElementById('textarea')
          textarea.focus()
        }}
      >
        <header className="App-header">

          <h3>Type and see</h3>
          <img src={logo} style={{width: "100px", marginLeft: "30px", marginTop: "-10px"}}/>
          <span style={{marginLeft: "320px", position: "absolute"}}>(#Nick Green)</span>
          <p />
        </header>

        {/*<AppBar position="static" className={this.props.classes.root}>
                  <Tabs
                    value={this.state.value}
                    onChange={this.handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    centered
                    theme="dark"
                  >
                    <Tab label="Tas" />
                    <Tab label="mms" />
                    <Tab label="Item Three" />
                  </Tabs>
                </AppBar>*/}

        <div className="maxWidthFloat">
          <div className="AppSection">
            {this.state.value === 0 && (
              <Tas />
            )}
            {this.state.value === 1 && <div>mms</div>}
            {this.state.value === 2 && <div>Item Three</div>}
          </div>
        </div>
        
        

      </div>
    );
  }
}

export default withStyles(styles)(App);
