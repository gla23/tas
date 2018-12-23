import React, { Component } from "react";
// import ReactDOM from 'react-dom';
import logo from "./logo.svg";
import Tas from "./Tas.js";
import "./App.css";


let yoe = "https://www.youtube.com/watch?v=3PCHyHvLr4M";
class App extends Component {
  render() {
    return (
      <div className="App">

        <header className="App-header">
          {/*<img src={logo} className="App-logo" alt="logo" />*/}
          <h3>Tas Title</h3>
          {/*<Link link={yoe} title="Listen to Yoe Mase"/>*/}
          {/*<Link link="https://rainymood.com/" title="Rainy mood"/> */}
          <p></p>
        </header>

        <Tas/>

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
