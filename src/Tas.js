import React, { useState, useEffect } from "react";
import MemoriseTab from "./MemoriseTab";
import { parseVerse } from "./verseCodeParsing";

const loopEnd = 162;
const loopStart = loopEnd - 15;
const loopSectionSize = 15;

function parseTextLines(text) {
	let answers = [];
	let clues = [];

	let lines = text.split("\n");
	for (var i = 0; i < lines.length; i++) {
		if (i % 2 === 0) {
			let clue = lines[i].length <= 6 ? parseVerse(lines[i]) : lines[i];
			answers.push(lines[i + 1]);
			clues.push(clue);
		}
	}
	return { clues, answers };
}

const Tas = props => {
	const [answers, setAnswers] = useState();
	const [clues, setClues] = useState();

	useEffect(() => {
		fetch("memory.txt")
			.then(response => response.text())
			.then(text => parseTextLines(text))
			.then(({ clues, answers }) => {
				setAnswers(answers);
				setClues(clues);
			});
	}, []);

	return (
		<MemoriseTab
			answers={answers}
			clues={clues}
			loopStart={loopStart}
			loopEnd={loopEnd}
			loopSectionSize={loopSectionSize}
		/>
	);
};

export default Tas;
