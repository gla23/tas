import React, { useState, useEffect } from "react";
import TypeArea from "./TypeArea";
import TasButton from "./components/TasButton";
import TasCheckbox from "./components/TasCheckbox";

// const delay = time => new Promise(resolve => setTimeout(resolve, time));

const learnLoopEnd = 152;
const learnLoopStart = learnLoopEnd - 15;
const loopSectionSize = 15;

function parseTextLines(text) {
	let answers = {};
	let clues = [];

	let lines = text.split("\n");
	for (var i = 0; i < lines.length; i++) {
		if (i % 2 === 0) {
			answers[lines[i]] = lines[i + 1];
			clues.push(lines[i]);
		}
	}
	return { clues, answers };
}
function randomInt(int) {
	return Math.floor(Math.random() * int);
}

const Tas = () => {
	const [answers, setAnswers] = useState({ " ": "" });
	const [clues, setClues] = useState([" "]);
	const [questionIndex, setQuestionIndexExact] = useState(0);
	const [correctCount, setCorrectCount] = useState(1);
	const [freeze, setFreeze] = useState(false);

	const setQuestionIndex = index => {
		setQuestionIndexExact(Math.max(0, Math.min(index, clues.length - 1)));
	};

	const increaseQuestion = (inc = 1) => setQuestionIndex(questionIndex + inc);
	const setRandomQuestion = () => setQuestionIndex(randomInt(clues.length));
	const newFirstLoop = () => setQuestionIndex(randomInt(learnLoopStart));
	const newSecondLoop = () =>
		setQuestionIndex(learnLoopStart + randomInt(learnLoopEnd - learnLoopStart));
	const nextLearnLoops = () => {
		setCorrectCount(correctCount + 1);
		if (correctCount < loopSectionSize) {
			newFirstLoop();
		} else if (correctCount < 2 * loopSectionSize) {
			newSecondLoop();
		} else {
			if (questionIndex < learnLoopEnd) {
				setQuestionIndex(learnLoopEnd);
			}
			setQuestionIndex(questionIndex + 1);
		}
	};

	useEffect(() => {
		fetch("memory.txt")
			.then(response => response.text())
			.then(text => parseTextLines(text))
			.then(({ clues, answers }) => {
				setAnswers(answers);
				setClues(clues);
			});
	}, []);

	useEffect(() => {
		setQuestionIndex(randomInt(learnLoopStart));
	}, [clues]);

	let shortcutMap = new Map();
	// shortcutMap.set("*", console.log);
	shortcutMap.set("PageDown", () => increaseQuestion(1));
	shortcutMap.set("PageUp", () => increaseQuestion(-1));
	shortcutMap.set("]", () => setFreeze(!freeze));

	let loopsNavigationDiv = () =>
		clues[learnLoopStart] && (
			<span>
				<h5>Change mem</h5>
				<TasButton
					text={"Recent - " + clues[learnLoopStart]}
					onClick={() => {
						setCorrectCount(loopSectionSize + 1);
						setQuestionIndex(learnLoopStart);
					}}
				/>
				<TasButton
					text={"New - " + clues[learnLoopEnd]}
					onClick={() => {
						setCorrectCount(2 * loopSectionSize + 1);
						setQuestionIndex(learnLoopEnd);
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

export default Tas;
