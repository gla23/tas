import { useState, useMemo, useEffect } from "react";

function shuffleArray(array) {
	for (var i = array.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		var temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
	return array;
}

function* yieldConsecutive(from, size) {
	for (var i = 0; i < size; i++) {
		yield from + i;
	}
}
function* generateRandomConsecutiveIndexes(howMany, inARow = 1, offset = 0) {
	let queue = [];
	let nextId;
	inARow = Math.min(howMany, inARow);
	if (inARow === 0) {
		return null;
	}
	while (true) {
		if (!queue.length) {
			queue = shuffleArray(
				Array(howMany + 1 - inARow)
					.fill()
					.map((_, index) => index)
			);
		}
		nextId = queue.pop();
		yield* yieldConsecutive(nextId + offset, inARow);
	}
}

function expandQuestionsGenerator(generator, size = 1000) {
	const clues = [];
	const answers = [];
	for (const { clue, answer } of generator) {
		clues.push(clue);
		answers.push(answer);
		if (clues.length > size) break;
	}
	return [clues, answers];
}

const clamp = (val, min, max) => Math.max(min, Math.min(val, max));

const useQuestions = ({
	questions,
	onQuestionAnswered,
	mode = "random",
	options = {},
}) => {
	const [clues, answers] = useMemo(
		() => expandQuestionsGenerator(questions()),
		[questions]
	);

	const {
		randomStart = 0,
		randomEnd = clues.length,
		invert = false,
		consecutive = 2,
	} = options;

	if (randomStart === randomEnd) {
		console.log(
			"randomStart and randomEnd should not both be " +
				randomStart +
				", leaving a sequence of length 0"
		);
	}

	const randomGenerator = useMemo(
		() =>
			generateRandomConsecutiveIndexes(
				randomEnd - randomStart,
				consecutive,
				randomStart
			),
		[randomStart, randomEnd, consecutive]
	);

	const [questionIndex, setQuestionExact] = useState(() => {
		if (mode === "random") return randomGenerator.next().value;
		if (mode === "next") return randomStart;
	});

	const setQuestion = index => {
		setQuestionExact(clamp(index, 0, clues.length - 1));
	};

	const increaseQuestion = (inc = 1) => setQuestion(questionIndex + inc);
	const setRandomQuestion = () => setQuestion(randomGenerator.next().value);

	useEffect(() => {
		if (questionIndex < randomStart || questionIndex >= randomEnd) {
			setRandomQuestion();
		}
	}, [randomGenerator, randomStart, randomEnd]);

	const [correctCount, setCorrectCount] = useState(1);

	const changeQuestion = () => {
		mode === "random" && setRandomQuestion();
		mode === "next" && increaseQuestion();
	};
	const complete = () => {
		changeQuestion();
		setCorrectCount(count => count + 1);
		onQuestionAnswered && onQuestionAnswered(correctCount);
	};

	const clue = (invert ? answers : clues)[questionIndex].toString();
	const answer = (invert ? clues : answers)[questionIndex].toString();

	// console.log(questionIndex, clue, correctCount);

	return [
		{ clue, answer },
		correctCount,
		complete,
		increaseQuestion,
		changeQuestion,
	];
};

export default useQuestions;
