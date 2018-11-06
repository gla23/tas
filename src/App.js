import React, { Component } from "react";
import logo from "./logo.svg";
import Tas from "./Tas.js";
import "./App.css";


let yoe = "https://www.youtube.com/watch?v=3PCHyHvLr4M";
let rainyMood = "https://rainymood.com/"
class App extends Component {
  render() {
    return (
      <div className="App">

        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <Link link={yoe} title="Listen to Yoe Mase"/>
          <Link link={rainyMood} title="Rainy mood"/>
          <p></p>
        </header>
        <body>
          
          <Tas/>
          
        </body>
      </div>
    );
  }
}

function Link(props) {
  return(
      <a className="App-link" href={props.link}>{props.title}</a>
    )
}

export default App;
