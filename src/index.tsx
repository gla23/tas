import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import reduxThunk from "redux-thunk";
import { rootReducer } from "./ducks";
import { composeWithDevTools } from "redux-devtools-extension";

const middleware = [reduxThunk];

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(...middleware))
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
