import React from "react";
import MemoriseTab from "./MemoriseTab";

const peg2 = [
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
	["tatty", "dad", "tattoo"], // dad dead died edit idiot tat tattoo tatty tidy tight toot
	["tin", "tuna", "tune"], // Aidan den deny tan tawny teen teeny tiny thin tin tuna twin tune as in like a piano or conducting or as you would a fork
	["tame", "tome", "tomb"], // adam atom adeem damn dumb tame tome tomb thumb time Tim Tom
	["tar", "thor", "tear"], // tar tear thor throw tire torah tower tree
	["tall", "tail", "duel"], // <adj> tail as in the <adj> squirrel superhero // tall teal // tail telly tool towel// tally tell duel //
	["tash", "doge", "dodge"], // dutch tash teach dosh doge ditch dodge
	["thug", "taco", "take"], // take could be as in steal // dog Deke take thick attack attic tack/y taco take talk tech thick thug toga took tuck tug twig
	["toffee", "dove", "dive"], // dive like football or water //  deaf dove defy dafoe dive thief thieve though toffee
	["tape", "Toby", "dab"], // Toby from scorpion made of sellotape? // tape deep dubai dip tuba type tabby tap dab teepee tip toby top tub dope
	["nasa", "Ness", "ionise"], // Ness from smash bros // noisy nose ionise nasa nice ness
	["knight", "newt", "knit"], // newt as in amphibian version? // neat net unite knight knit knot neat newt nut
	["neon", "nun", "nani"], // neon onion nanny nun naan nano inane no-no
	["", "Nemo", "nom"], // numb enemy name Nemo nom gnome
	["", "", ""], // narrow winery honour Nero
	["", "", ""], // annual nail inhale Neil nail
	["", "", ""], // nudgy nacho enjoy nudge hinge angel notch
	// Future Mane Chef Yakul
];

const generateAnswer = num => peg2[num].join(" ");
const generateClue = num => {
	let str = num.toString();
	if (str.length === 1) {
		str = "0" + str;
	}
	return str;
};
const numberOfClues = 22;
const answers = [];
const clues = [];
for (let i = 0; i < numberOfClues; i++) {
	answers[i] = generateAnswer(i);
	clues[i] = generateClue(i);
}
const MajorSystem = props => {
	return (
		<MemoriseTab
			answers={answers}
			clues={clues}
			learnLoopStart={numberOfClues}
			learnLoopEnd={numberOfClues}
			loopSectionSize={10}
		/>
	);
};

export default MajorSystem;

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
