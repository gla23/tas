import { useState } from "react";

const useLocalStorage = (name, initalState) => {
	let [state, setState] = useState(() => {
		const stored = JSON.parse(window.localStorage.getItem(name));
		return stored !== null ? stored : initalState;
	});
	const setStorage = newStateOrFn => {
		const newState =
			newStateOrFn instanceof Function ? newStateOrFn(state) : newStateOrFn;
		state = newState;
		window.localStorage.setItem(name, JSON.stringify(newState));
		setState(newState);
	};
	return [state, setStorage];
};

export default useLocalStorage;
