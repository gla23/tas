import React, { useState, useEffect, useMemo } from "react";
import MemoriseTab from "../components/MemoriseTab";
import { parseVerse } from "../data/verseCodeParsing";
import TasRadioGroup from "../widgets/TasRadioGroup";
import TasSlider from "../widgets/TasSlider";
import useLocalStorage from "../hooks/useLocalStorage";
// import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
// import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
// import IconButton from "@material-ui/core/IconButton";

const loopSectionSize = 20;

const Tas = props => {
	const [loopRange, setLoopRange] = useLocalStorage("tasLoop", [1, 2]);
	const [parsingVerses] = useLocalStorage("parsingVerses", true);
	const [loopStart, loopEnd] = loopRange;
	const [answers, setAnswers] = useState();
	const [clues, setClues] = useState();

	const loops = useMemo(
		() => [
			{
				randomStart: 0,
				randomEnd: loopStart,
				label: "Older",
				modes: ["random", "next", "same"],
			},
			{
				randomStart: loopStart,
				randomEnd: loopEnd,
				label: "Recent: " + (clues && clues[loopStart]),
				modes: ["random", "next", "same"],
			},
			{
				randomStart: loopEnd,
				label: "New: " + (clues && clues[loopEnd]),
				modes: ["next", "same"],
			},
		],
		[loopStart, loopEnd, clues]
	);

	useEffect(() => {
		fetch("memory.txt")
			.then(response => response.text())
			.then(text => parseTextLines(text, parsingVerses))
			.then(({ clues, answers }) => {
				setAnswers(answers);
				setClues(clues);
			});
	}, []);

	const [loop, setLoop] = useState(0);
	const nextLoop = () => loop < loops.length - 1 && setLoop(loop => loop + 1);

	if (!clues) return null;

	function* questionGeneratorFunction() {
		yield* clues.map((clue, index) => ({ clue, answer: answers[index] }));
	}

	return (
		<>
			<MemoriseTab
				key={loop}
				questions={questionGeneratorFunction}
				onQuestionAnswered={correctCount =>
					correctCount >= loopSectionSize && nextLoop()
				}
				modes={loops[loop].modes}
				questionOptions={loops[loop]}
				navigation={mode => (
					<>
						<div style={{ display: "flex" }}>
							<TasRadioGroup
								options={loops.map((loopObj, index) => ({
									...loopObj,
									value: String(index),
								}))}
								value={String(loop)}
								onChange={value => setLoop(Number(value))}
							/>
						</div>
						{(mode === "random" || true) && (
							<div style={{ display: "flex" }}>
								<TasSlider
									value={loopRange}
									onChange={value => setLoopRange(value)}
									max={clues.length - 1}
									valueLabelDisplay="auto"
									valueLabelFormat={book => clues[book]}
									width="600px"
								/>
							</div>
						)}
					</>
				)}
			/>
		</>
	);
};

function parseTextLines(text, parsingVerses) {
	let answers = [];
	let clues = [];

	let lines = text.split("\n");
	for (var i = 0; i < lines.length; i++) {
		if (i % 2 === 0) {
			let clue =
				parsingVerses && lines[i].length <= 6 ? parseVerse(lines[i]) : lines[i];
			answers.push(lines[i + 1]);
			clues.push(clue);
		}
	}
	return { clues, answers };
}

export default Tas;
