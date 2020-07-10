import React, { useState, useEffect } from "react";
import TypeArea from "./TypeArea";
import useQuestions from "../hooks/useQuestions";
import ErrorBoundary from "./ErrorBoundary";
import TasRadioGroup from "../widgets/TasRadioGroup";
import TasCheckbox from "../widgets/TasCheckbox";

const verseTime = (verse) => verse.length * 100;

const MemoriseTab = (props) => {
	const [mode, setMode] = useState(props.modes[0]);
	const [again, setAgain] = useState(false);
	const [invert, setInvert] = useState(false);
	// TODO:
	// Add ability to change consecutive. redux? truly global?
	// Set again on too slow
	// don't let slider have both sliders on the same point
	// more splitting up?

	useEffect(() => {
		if (!props.modes.includes(mode)) {
			setMode(props.modes[0]);
		}
	});

	const [
		question,
		correctCount,
		next,
		increaseQuestion,
		changeQuestion,
	] = useQuestions({
		questions: props.questions,
		onQuestionAnswered: props.onQuestionAnswered,
		mode: again ? "same" : mode,
		options: {
			...props.questionOptions,
			invert,
			consecutive: invert ? 1 : props.questionOptions.consecutive,
		},
	});

	// This should be in the type area (probably redux) as you need to record from the first letter to allow thinking time
	// useEffect(() => {
	// 	const timer = setTimeout(() => {
	// 		console.log("timeout");
	// 		setAgain(true)
	// 	}, verseTime(question.answer));
	// 	console.log("start");
	// 	return () => clearTimeout(timer);
	// }, [question]);

	const complete = () => {
		setAgain(false);
		next();
	};

	let shortcutMap = new Map();
	shortcutMap.set("PageDown", () => increaseQuestion(1));
	shortcutMap.set("PageUp", () => increaseQuestion(-1));
	shortcutMap.set("]", () => setAgain((again) => !again));
	shortcutMap.set("=", () => console.log("= pressed") || changeQuestion());

	if (!question) return <p>No questions provided</p>;
	if (!question.answer || !question.clue) return <p>Loading</p>;

	const showOptions = props.modes.length !== 1;
	return (
		<TypeArea
			{...question}
			correctCount={correctCount}
			shortcutMap={shortcutMap}
			onComplete={complete}
			navigation={
				<>
					{showOptions && (
						<div className="container">
							<TasRadioGroup
								options={[
									{ value: "random", label: "Random" },
									{ value: "next", label: "Next" },
									{ value: "same", label: "Same" },
								].filter((mode) => props.modes.includes(mode.value))}
								onChange={(value) => setMode(value)}
								value={mode}
							/>
							<TasCheckbox
								checked={again}
								onChange={(checked) => setAgain(checked)}
								label="Again"
							/>
							<TasCheckbox
								label="Invert"
								checked={invert}
								onChange={(value) => setInvert(value)}
							/>
						</div>
					)}
					{props.navigation && props.navigation(mode, invert)}
				</>
			}
			lengthCorrect={
				(props.caseSensitive && lengthCorrectExact) || lengthCorrect
			}
			charColour={
				(props.caseSensitive &&
					((char, pos) => (question.answer[pos] === char ? "green" : "red"))) ||
				((char, pos) =>
					question.answer[pos] &&
					char &&
					question.answer[pos].toLowerCase() === char.toLowerCase()
						? "green"
						: "red")
			}
		/>
	);
};

MemoriseTab.defaultProps = { caseSensitive: true };

const MemoriseTabWithBoundary = (props) => (
	<ErrorBoundary message="Error caught within MemoriseTab">
		<MemoriseTab {...props} />
	</ErrorBoundary>
);

export default MemoriseTabWithBoundary;

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
