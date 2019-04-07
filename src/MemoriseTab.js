import React, { useState, useEffect } from "react";
import TypeArea from "./TypeArea";
import TasButton from "./components/TasButton";
import TasCheckbox from "./components/TasCheckbox";

function randomInt(int) {
	return Math.floor(Math.random() * int);
}

const MemoriseTab = props => {
	const { answers, clues } = props;
	const {
		loopStart = clues.length - 1,
		loopEnd = clues.length - 1,
		loopSectionSize = 15,
	} = props;

	if (!answers || !clues) {
		return <p>Loading</p>;
	}

	const [questionIndex, setQuestionIndexExact] = useState(0);
	const [correctCount, setCorrectCount] = useState(1);
	const [freeze, setFreeze] = useState(false);

	const setQuestionIndex = index => {
		setQuestionIndexExact(Math.max(0, Math.min(index, clues.length - 1)));
	};

	const increaseQuestion = (inc = 1) => setQuestionIndex(questionIndex + inc);
	const setRandomQuestion = () => setQuestionIndex(randomInt(clues.length));
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
			console.log(questionIndex, loopEnd);
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
	// shortcutMap.set("*", console.log);
	shortcutMap.set("PageDown", () => increaseQuestion(1));
	shortcutMap.set("PageUp", () => increaseQuestion(-1));
	shortcutMap.set("]", () => setFreeze(!freeze));

	let loopsNavigationDiv = () =>
		clues[loopStart] && (
			<span>
				<h5>Change mem</h5>
				<TasButton
					text={"Recent - " + clues[loopStart]}
					onClick={() => {
						setCorrectCount(loopSectionSize + 1);
						setQuestionIndex(loopStart);
					}}
				/>
				<TasButton
					text={"New - " + clues[loopEnd]}
					onClick={() => {
						setCorrectCount(2 * loopSectionSize + 1);
						setQuestionIndex(loopEnd);
					}}
				/>
				<TasButton text="Random" onClick={setRandomQuestion} />
				<TasButton text="Complete" onClick={nextLearnLoops} />
				<TasCheckbox
					text="Freeze"
					onClick={() => setFreeze(!freeze)}
					checked={freeze}
				/>
			</span>
		);

	document.title = "Type and see";

	return (
		<TypeArea
			answer={answers[clues[questionIndex]]}
			clue={clues[questionIndex]}
			correctCount={correctCount}
			shortcutMap={shortcutMap}
			onComplete={() => {
				nextLearnLoops();
			}}
			navigationDiv={loopsNavigationDiv}
			showControlDiv={true}
			showNavigationDiv={true}
		/>
	);
};

export default MemoriseTab;
