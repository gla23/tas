import { useState, useEffect, useCallback, useRef } from "react";

const baseTime = 35;
const checkTreacle = 3;
const timeIncrease = 2;
const jumpMinimumTime = 1;

const useCheckAnimate = (text, answer, onReachEnd) => {
	const [checkedUpTo, setCheckedUpTo] = useState(0);
	const [checkUpTo, setCheckUpTo] = useState(0);
	const [checking, setChecking] = useState(false);
	const incrementTime = useRef(baseTime);
	const incrementTimer = useRef();
	const incrementFn = useRef();
	const startChecking = useCallback(() => setChecking(true), []);

	incrementFn.current = () => {
		let checkStart = checkedUpTo;
		let end = answer.length;
		let charsToJump = Math.ceil((59 + checkUpTo * 4 + end) / 60);
		charsToJump = Math.min(charsToJump, 6);
		let checkNew = checkStart + charsToJump;
		// console.log("incrementFn", checking, checkStart, checkedUpTo);
		if (checkStart < checkUpTo) {
			if (checkNew > checkUpTo) {
				checkNew = checkUpTo;
				// console.log("switching to slowing down");
			}
			incrementTime.current -= timeIncrease;
			setCheckedUpTo(checkNew);
			incrementTimer.current = setTimeout(
				() => incrementFn.current(),
				Math.max(incrementTime.current, jumpMinimumTime)
			);
		} else {
			if (checkStart === checkUpTo) {
				setCheckedUpTo(checkedUpTo + 1);
			}
			// At the end or slowing down
			if (checkStart >= end) {
				onReachEnd ? onReachEnd() : console.log("no onReachEnd function");
			}
			if (checkStart === text.length) {
				// Hard stop when you reach the end of the output
				incrementTime.current = baseTime + timeIncrease + 2;
			}
			let oldIncrementTime = incrementTime.current;
			let newIncrementTime = oldIncrementTime + timeIncrease * checkTreacle;

			if (oldIncrementTime > baseTime + timeIncrease + 1) {
				setChecking(false);
				return;
			}

			setCheckedUpTo(checkedUpTo + 1);
			incrementTime.current = newIncrementTime;
			incrementTimer.current = setTimeout(
				() => incrementFn.current(),
				Math.max(newIncrementTime * 5, jumpMinimumTime)
			);
		}
	};

	useEffect(() => {
		if (checking) {
			incrementFn.current();
		}
		return () => clearTimeout(incrementTimer.current);
	}, [checking]);

	return [checkedUpTo, setCheckedUpTo, setCheckUpTo, startChecking];
};

export default useCheckAnimate;
