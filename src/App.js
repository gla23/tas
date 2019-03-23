import React, { Component } from "react";
import Tas from "./Tas.js";
import BibleSearch from "./BibleSearch.js";
import "./App.css";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { withStyles } from '@material-ui/core/styles';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
// import word from './word.png';
import logo from './tasLogo.png';


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
            textarea && textarea.focus()
          }
        }
      >
        <header className="App-header">

          <h3>Type and see</h3>
          <img src={logo} style={{width: "100px", marginLeft: "30px", marginTop: "-10px"}}/>
          <p />
        </header>

        {true && (<AppBar position="static" className={this.props.classes.root}>
                  <Tabs
                    value={this.state.value}
                    onChange={this.handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    centered
                    // theme="dark"
                  >
                    <Tab label="Tas" />
                    <Tab label="Search" />
                    <Tab label="Major System" />
                  </Tabs>
                </AppBar>)}

        <div className="maxWidthFloat">
          <div className="AppSection">
            {this.state.value === 0 && (
              <Tas />
            )}
            {this.state.value === 1 && <div>
              <BibleSearch 
                text="asdlfkjfsd"
              />
            </div>}
            {this.state.value === 2 && <div>
              <p>Major</p>
            </div>}
          </div>
        </div>
        
        

      </div>
    );
  }
}

export default withStyles(styles)(App);
