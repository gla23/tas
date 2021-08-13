import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { App } from "./pages/App";
import { createStore, applyMiddleware } from "redux";
import { Provider, useDispatch } from "react-redux";
import reduxThunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { Scrollable } from "./components/ColorInput/ColorInput";
import rootReducer, { loadBank } from "./ducks/root";
import { useTheme } from "./ducks/settings";
import { memory } from "./utils/memory";
import { loadState, saveState } from "./utils/session";


const middleware = [reduxThunk];

const store = createStore(
  rootReducer,
  loadState(),
  composeWithDevTools(applyMiddleware(...middleware))
);
store.subscribe(() => {
  saveState(store.getState());
});

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
      <Scrollable className="transition duration-500 bg-white text-black dark:bg-gray-800 dark:text-white">
        {props.children}
      </Scrollable>
    </div>
  );
}
