import { useState } from "react";

const getItem = <S>(key: string, initialState: S) => {
  const storedValue = window.localStorage.getItem(key);
  if (storedValue === null) return initialState;
  try {
    return JSON.parse(storedValue);
  } catch (error) {
    return storedValue;
  }
};

const useLocalStorage = <S>(key: string, initialState: S) => {
  const [state, setState] = useState<S>(() => getItem(key, initialState));

  function setStorageToo(state: S): void;
  function setStorageToo(updater: (oldState: S) => S): void;
  function setStorageToo(stateOrFn: S | ((oldState: S) => S)) {
    const newState =
      stateOrFn instanceof Function ? stateOrFn(state) : stateOrFn;
    window.localStorage.setItem(key, JSON.stringify(newState));
    setState(newState);
  }

  return [state, setStorageToo] as const;
};

export default useLocalStorage;
