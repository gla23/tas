import React, { useState, useEffect } from "react";
import TypeArea from "./TypeArea";

const generateAnswer = num => peg2[num].join(" ");
const numberOfClues = 16;
const MajorSystem = props => {
	const randomQuestion = () => Math.floor(Math.random() * (numberOfClues - 1));
	const [question, setQuestion] = useState(randomQuestion());
	const [correctCount, setCorrectCount] = useState(1);

	let questionString = question.toString();
	if (questionString.length == 1) {
		questionString = "0" + questionString;
	}

	return (
		<TypeArea
			answer={generateAnswer(question)}
			clue={questionString}
			correctCount={correctCount}
			// shortcutMap={shortcutMap}
			onComplete={() => {
				setQuestion(randomQuestion());
				setCorrectCount(correctCount + 1);
			}}
			// navigationDiv={loopsNavigationDiv}
			// showControlDiv={true}
			// showNavigationDiv={true}
		/>
	);
};

export default MajorSystem;

let peg2 = [];
peg2 = [
	["isis", "sauce", "assess"], // swazzy sassy
	["sad", "seed", "swat"], // sat seat
	["snowy", "sun", "sign"], // assign Sign Cyan Asian son
	["sumo", "Sam", "swim"], // Zoom Assume sumo awesome
	["sorry", "sir", "swear"], // seer
	["slow", "Salah", "sell"], // Cell Hazel Hassle Hustle Seal
	["sage", "sash", "siege"], // swishy Sewage switch sachet sash sage siege
	["sick", "sock", "soak"], // sick sky soak ascii ask sack sag seek sock
	["safe", "sofa", "save"], // savvy sofa save safe
	["sappy", "soup", "sob"], // sappy soap sob sap sip soup
	["dizzy", "dice", "toss"], // as in seismic // toss toys dice dies dizzy daisy tease dose
	["tatty", "dad", "toot"], // dad dead died edit idiot tat tattoo tatty tidy tight toot
	["tin", "tuna", "tune"], // Aidan den deny tan tawny teen teeny tiny thin tin tuna twin tune as in like a piano or conducting or as you would a fork
	["tame", "tome", "time"], // adam atom adeem damn dumb tame tome tomb thumb time Tim Tom
	["tar", "tower", "tear"], // tar tear thor throw tire torah tower tree
	["tall", "tail", "duel"], // <adj> tail as in the <adj> squirrel superhero // tall teal // tail telly tool towel// tally tell duel //
	["dutch", "doge", "dodge"], // dutch tash teach dosh doge ditch dodge
	["", "", ""],
	["", "", ""],
	["", "", ""],
];
// Future Mane Chef Yakul

let peg1 = [
	[
		"easy",
		"hot",
		"new",
		"yummy",
		"hairy",
		"oily",
		"itchy",
		"key",
		"key",
		"happy",
	],
	[
		"hose",
		"hat",
		"hen",
		"home",
		"arrow",
		"whale",
		"shoe",
		"cow",
		"hoof",
		"pie",
	],
	["sew", "hate", "know", "aim", "row", "heal", "chew", "hook", "view", "buy"],
];
