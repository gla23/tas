import React, { useState, useEffect } from "react";
import TypeArea from "./TypeArea";
import TasButton from "./components/TasButton";
import TasCheckbox from "./components/TasCheckbox";

function randomInt(int) {
	return Math.floor(Math.random() * int);
}

const clamp = (val, min, max) => Math.max(min, Math.min(val, max));

function lengthCorrectExact(text, answer) {
	let correctLength = 0;
	for (let i = 0; i < text.length; i++) {
		if (text[i] !== answer[i]) {
			break;
		} else {
			correctLength = i + 1;
		}
	}
	return correctLength;
}
function lengthCorrect(text, answer) {
	let correctLength = 0;
	for (let i = 0; i < text.length; i++) {
		let textLetter = text[i] || " ";
		let answerLetter = answer[i] || " ";
		if (textLetter.toLowerCase() !== answerLetter.toLowerCase()) {
			break;
		} else {
			correctLength = i + 1;
		}
	}
	return correctLength;
}

const MemoriseTab = props => {
	const { answers, clues, caseSensitive = true } = props;
	const {
		loopStart = clues.length,
		loopEnd = clues.length,
		loopSectionSize = 150000,
	} = props;

	if (!answers || !clues) {
		return <p>Loading</p>;
	}

	const [questionIndex, setQuestionIndexExact] = useState(0);
	const [correctCount, setCorrectCount] = useState(1);
	const [freeze, setFreeze] = useState(false);

	const setQuestionIndex = index => {
		setQuestionIndexExact(clamp(index, 0, clues.length - 1));
	};

	const increaseQuestion = (inc = 1) =>
		setQuestionIndexExact(old => clamp(old + inc, 0, clues.length - 1));
	// const setRandomQuestion = () => setQuestionIndex(randomInt(clues.length));
	const newFirstLoop = () => setQuestionIndex(randomInt(loopStart));
	const newSecondLoop = () =>
		setQuestionIndex(loopStart + randomInt(loopEnd - loopStart));
	const nextLearnLoops = () => {
		setCorrectCount(correctCount + 1);
		if (freeze) {
			increaseQuestion(0);
			return;
		}
		if (correctCount < loopSectionSize) {
			newFirstLoop();
		} else if (correctCount < 2 * loopSectionSize) {
			newSecondLoop();
		} else {
			if (questionIndex < loopEnd) {
				setQuestionIndex(loopEnd);
			} else {
				setQuestionIndex(questionIndex + 1);
			}
		}
	};

	useEffect(() => {
		setQuestionIndex(randomInt(loopStart));
	}, [clues]);

	let shortcutMap = new Map();
	shortcutMap.set("PageDown", () => increaseQuestion(1));
	shortcutMap.set("PageUp", () => increaseQuestion(-1));
	shortcutMap.set("]", () => setFreeze(!freeze));

	let LoopsNavigationDiv = () => (
		<span>
			<h5>Change mem</h5>
			{clues[loopStart] && (
				<TasButton
					text={"Random Older"}
					onClick={() => {
						setCorrectCount(1);
						newFirstLoop();
					}}
				/>
			)}
			{clues[loopStart] && (
				<TasButton
					text={"Recent: " + clues[loopStart]}
					onClick={() => {
						setCorrectCount(loopSectionSize + 1);
						setQuestionIndex(loopStart);
					}}
				/>
			)}
			{clues[loopEnd] && (
				<TasButton
					text={"New: " + clues[loopEnd]}
					onClick={() => {
						setCorrectCount(2 * loopSectionSize + 1);
						setQuestionIndex(loopEnd);
					}}
				/>
			)}
			{/*<TasButton text="Random" onClick={setRandomQuestion} />*/}
			{process.env.NODE_ENV === "development" && (
				<TasButton text="Complete" onClick={nextLearnLoops} />
			)}
			<TasCheckbox
				text="Freeze"
				onClick={() => setFreeze(!freeze)}
				checked={freeze}
			/>
		</span>
	);

	document.title = "Type and see";
	let answer = answers[questionIndex];
	let clue = clues[questionIndex];

	if (!answer || !clue) {
		return <p>Loading 2</p>;
	}

	return (
		<TypeArea
			answer={answer}
			clue={clue}
			correctCount={correctCount}
			shortcutMap={shortcutMap}
			onComplete={() => {
				nextLearnLoops();
			}}
			NavigationDiv={LoopsNavigationDiv}
			lengthCorrect={(caseSensitive && lengthCorrectExact) || lengthCorrect}
			charColour={
				(caseSensitive &&
					((char, pos) => (answer[pos] === char ? "green" : "red"))) ||
				((char, pos) =>
					answer[pos] &&
					char &&
					answer[pos].toLowerCase() === char.toLowerCase()
						? "green"
						: "red")
			}
		/>
	);
};

export default MemoriseTab;
