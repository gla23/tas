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
function* generateRandomConsecutive(between, inARow = 1) {
	inARow = Math.min(between, inARow);
	if (inARow === 0) return null;

	let queue = [];
	const restartQueue = () => {
		queue = shuffleArray(
			Array(between + 1 - inARow)
				.fill()
				.map((_, index) => index)
		);
	};

	while (true) {
		if (!queue.length) restartQueue();
		yield* yieldConsecutive(queue.pop(), inARow);
	}
}

function expandQuestionsGenerator(generator, inverting, size = 1000) {
	const questions = [];
	let id = -1;
	for (const question of generator) {
		if (++id >= size) break;
		questions.push({
			id,
			clue: question[inverting ? "answer" : "clue"].toString(),
			answer: question[inverting ? "clue" : "answer"].toString(),
			uninvertible: question.uninvertible,
		});
	}
	return questions;
}

export const clamp = (val, min, max) => Math.max(min, Math.min(val, max));

const useQuestions = ({
	questions: questionGenerator,
	onQuestionAnswered,
	mode = "random",
	options = {},
}) => {
	const {
		randomStart = 0,
		randomEnd = null,
		invert = false,
		consecutive = 2,
	} = options;

	const questions = useMemo(
		() => expandQuestionsGenerator(questionGenerator(), invert),
		[questionGenerator, invert]
	);
	const filteredQuestions = useMemo(
		() =>
			questions.filter(
				(q) =>
					q.id >= randomStart && q.id < randomEnd && !(invert && q.uninvertible)
			),
		[questions, randomStart, randomEnd, invert]
	);
	const lastId = questions[questions.length - 1].id;
	const firstId = questions[0].id;

	const randomIndexGenerator = useMemo(
		() => generateRandomConsecutive(filteredQuestions.length, consecutive),
		[filteredQuestions, consecutive]
	);
	const nextRandomId = () =>
		filteredQuestions[randomIndexGenerator.next().value].id;

	const [questionId, setQuestionExact] = useState(() => {
		if (mode === "random") return nextRandomId();
		if (mode === "next") return questions[randomStart - 1].id;
	});
	const setQuestion = (id) => setQuestionExact(clamp(id, 0, lastId));
	const increaseQuestion = (inc = 1) => setQuestion(questionId + inc);
	const setRandomQuestion = () => setQuestion(nextRandomId());
	const changeQuestion = () => {
		mode === "random" && setRandomQuestion();
		mode === "next" && increaseQuestion();
	};

	useEffect(() => {
		if (questionId < randomStart) setQuestion(firstId);
		if (questionId >= randomEnd) setQuestion(lastId);
		if (filteredQuestions.every((q) => q.id !== questionId)) changeQuestion();
	}, [randomIndexGenerator, randomStart, randomEnd]);

	const [correctCount, setCorrectCount] = useState(1);

	const complete = () => {
		changeQuestion();
		setCorrectCount((count) => count + 1);
		onQuestionAnswered && onQuestionAnswered(correctCount);
	};

	const question = questions.find((q) => q.id === questionId);

	console.log(questionId, question, correctCount);

	return [question, correctCount, complete, increaseQuestion, changeQuestion];
};

export default useQuestions;
