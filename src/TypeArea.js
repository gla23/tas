import React, { useState, useEffect, useCallback } from "react";
import TasButton from "./components/TasButton";
import TextArea from "./TextArea";
import HiddenTextarea from "./components/HiddenTextarea";
import useCheckAnimate from "./CheckAnimate";

const TypeArea = props => {
	const [focused, setFocused] = useState(false);
	const [selection, setSelection] = useState([0, 0, "none"]);
	const [showingAnswer, setShowingAnswer] = useState(false);
	const toggleAnswer = useCallback(() => setShowingAnswer(r => !r), []);
	const [showingUI, setshowingUI] = useState(true);
	const toggleUI = useCallback(() => setshowingUI(r => !r), []);

	const [text, setText] = useState("");

	const {
		answer,
		clue,
		onComplete,
		correctCount,
		shortcutMap,
		NavigationDiv,
		lengthCorrect,
		charColour,
	} = props;

	const [
		checkedUpTo,
		setCheckedUpTo,
		setCheckUpTo,
		startChecking,
	] = useCheckAnimate(
		text,
		answer,
		// onReachEnd
		() =>
			lengthCorrect(text, answer) >= answer.length &&
			setTimeout(onComplete, 100)
	);

	useEffect(() => {
		lengthCorrect(text, answer) === answer.length && startChecking();
	}, [text]);

	useEffect(() => {
		setCheckUpTo(lengthCorrect(text, answer));
		setCheckedUpTo(0);
		if (answer) {
			if (text.length > 0) startChecking();
		}
	}, [answer, clue]);

	useEffect(() => {
		setText("");
		setCheckUpTo(0);
	}, [correctCount]);

	const shortcut = useCallback(event => {
		if (event.key === "Enter") {
			event.preventDefault();
			startChecking();
		}
		if (event.key === "[") {
			event.preventDefault();
			toggleAnswer();
		}
		if (event.key === "#" || event.key === "Escape") {
			event.preventDefault();
			toggleUI();
		}
		if (shortcutMap) {
			let shortcutFunction = shortcutMap.get(event.key);
			if (shortcutFunction) {
				event.preventDefault();
				shortcutFunction(event.key);
			}
		}
	}, []);

	const onHiddenTextChange = event => {
		let text = event.target.value;
		let oldSelectionPosition = selection[0];
		let newSelectionPosition = event.target.selectionStart;
		let checkPosToSet = Math.min(
			checkedUpTo,
			oldSelectionPosition,
			newSelectionPosition
		);
		setCheckedUpTo(checkPosToSet);

		setText(text);
		setCheckUpTo(lengthCorrect(text, answer));
	};

	return (
		<div>
			{ClueDiv(clue, correctCount)}

			<TextArea
				checkUpTo={checkedUpTo}
				text={text}
				charType={charColour}
				focused={focused}
				selection={selection}
			/>

			{showingUI && ControlDiv(startChecking, toggleAnswer)}

			{AnswerReveal(answer, showingAnswer)}

			<div className="navigationDiv">{showingUI && <NavigationDiv />}</div>

			<p className="bigGap" />

			<HiddenTextarea
				text={text}
				onChange={answer && onHiddenTextChange}
				onKeyDown={shortcut}
				updateSelection={setSelection}
				onChangeFocus={setFocused}
			/>
		</div>
	);
};

export const Buttons = (buttonsDescriptor, className) => {
	const buttons = buttonsDescriptor.map((button, index) => (
		<TasButton {...button} key={index} />
	));
	return className ? <div className={className}>{buttons}</div> : buttons;
};

const ControlDiv = (startChecking, toggleAnswer) =>
	Buttons(
		[
			{
				text: "Check ⏎",
				onClick: startChecking,
			},
			{ text: "Reveal [", onClick: toggleAnswer },
		],
		"controlDiv"
	);

const ClueDiv = (clue, correctCount) => (
	<div className="clueDiv">
		<span className="clue">{clue}</span>

		{CorrectCountText(correctCount)}
	</div>
);

const CorrectCountText = correctCount => (
	<span className="countText" style={{ whiteSpace: "pre-wrap" }}>
		{" " + correctCount + " "}
	</span>
);

const AnswerReveal = (verse, showingAnswer) => (
	<div className="AnswerReveal">
		<p>{showingAnswer && verse}</p>
	</div>
);

export default TypeArea;
