import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { App } from "./App";
import { createStore, applyMiddleware } from "redux";
import { Provider, useDispatch } from "react-redux";
import reduxThunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { Scrollable } from "./components/ColorInput/ColorInput";
import rootReducer, { loadBank } from "./ducks/root";
import { useTheme } from "./ducks/settings";
import { memory } from "./utils/memory";

const middleware = [reduxThunk];

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(...middleware))
);

ReactDOM.render(
  <Provider store={store}>
    <AppWrapper>
      <App />
    </AppWrapper>
  </Provider>,
  document.getElementById("root")
);

function AppWrapper(props: React.PropsWithChildren<{}>) {
  const dispatch = useDispatch();
  const theme = useTheme();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => void memory.then((bank) => dispatch(loadBank(bank))), []);

  return (
    <div className={theme}>
      <Scrollable className="transition duration-500 text-black dark:text-white bg-white dark:bg-gray-800">
        {props.children}
      </Scrollable>
    </div>
  );
}
