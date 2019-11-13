import React, { useState, useMemo } from "react";
import MemoriseTab from "./MemoriseTab";
import TasRadioGroup from "./components/TasRadioGroup";
import TasSlider from "./components/TasSlider";

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
	["dizzy", "Tess", "toss"], // as in seismic // toss Tess toys dice dies dizzy daisy tease dose
	["tatty", "dad", "tattoo"], // dad dead died edit idiot tat tattoo tatty tidy tight toot
	["tin", "tuna", "tune"], // Aidan den deny tan tawny teen teeny tiny thin tin tuna twin tune as in like a piano or conducting or as you would a fork
	["tame", "tome", "tomb"], // adam atom adeem damn dumb tame tome tomb thumb time Tim Tom
	["tar", "Thor", "tear"], // tar tear thor throw tire torah tower tree
	["tall", "tail", "duel"], // <adj> tail as in the <adj> squirrel superhero // tall teal // tail telly tool towel// tally tell duel //
	["tash", "doge", "dodge"], // dutch tash teach dosh doge ditch dodge
	["thug", "taco", "take"], // dog Deke take thick attack attic tack/y taco take talk tech thick thug toga took tuck tug twig
	["toffee", "dove", "dive"], // dive like football or water //  deaf dove defy dafoe dive thief thieve though toffee
	["tape", "Toby", "dab"], // Toby from scorpion made of sellotape? // tape deep dubai dip tuba type tabby tap dab teepee tip toby top tub dope
	["nasa", "Ness", "ionise"], // Ness from smash bros // noisy nose ionise nasa nice ness
	["knight", "newt", "knit"], // newt as in amphibian version? // neat net unite knight knit knot neat newt nut knead
	["neon", "nun", "nani"], // neon onion nanny nun naan nano inane no-no
	["numb", "Nemo", "nom"], // numb enemy name Nemo nom gnome
	["noir", "Nero", "gnaw"], // narrow winery honour Nero henry gnaw near knorr knower norway noir
	["noel", "Neil", "kneel"], // annual nail inhale Neil kneel nil noel
	["hench", "angel", "nudge"], // nudgy nacho enjoy nudge hinge angel notch gnash hench nosh
	["nike", "Nick", "knock"], // neck knock naggy enoch eunuch gnocchi hang nick nag nike nuke nokia
	["navy", "knave", "knife"], // envy info knife naff naive navy knave - a dishonest or unscrupulous man
	["newbie", "honeybee", "nope"], // nap nab nape nib nip nope wannabe honeybee
	["moss", "moose", "Mace"], // Yoe Windu with mace, // moose amaze amos amuse Holmes hummus Mace mace mass mouse mess miss moss Moss Moyes muzzo ohms
	["mud", "mute", "meth"], // emote emit mate mad maid matt mat math meat meaty met meth mit moat mood moth mud mute myth mouth
	["mane", "Mane", "ameen"], // man amen/ameen human humane immune main mana mane (aslan) mayan mean moan money moon omani omen
	["meme", "imam", "mime"], // imam maim mum mayhem meme mime memo
	["merry", "mario", "marry"], // amari homer humour mare mario marrow marry (peach?) mayor merry (tipsy to diff from noel) mire moore Murray ymir omar
	["mole", "mule", "maul"], // email mail Emily male maul melee mellow mill moghul mole mule
	["mesh", "magi", "mash"], // amish image macho magi mash match mesh mojo mosh much mushy
	["", "", ""], //
	["", "", ""], //
	// Future
	// Chef Yakul
];

// Includes 00
const numberOfClues = 37;

const peg2Notes = [];
peg2Notes[0] = ["", "Sauce is a live ketchup bottle", ""];
peg2Notes[3] = [
	"",
	["Sam in Gisbourne road kitchen?", "Mulitude of sam: lines parkin watson"],
	"",
];
peg2Notes[7] = ["", "Soup can fly out the bowl and be magical", ""];
peg2Notes[17] = ["as in thug life", "", "take as in steal"];

const initialRangeOfRandom = [20, numberOfClues - 1];

const MajorSystem = props => {
	const [mode, setMode] = useState("aaa");
	const [rangeOfRandom, setRangeOfRandom] = useState(initialRangeOfRandom);

	const questionsGeneratorFunction = useMemo(() => createQuestions({ mode }), [
		mode,
		numberOfClues,
		peg2,
		digitsToPegQuestion,
	]);

	return (
		<MemoriseTab
			key={mode}
			questions={questionsGeneratorFunction}
			modes={mode !== "aaa" ? ["next"] : ["random", "next"]}
			questionOptions={{
				randomStart: mode === "usage" ? 0 : rangeOfRandom[0],
				randomEnd: rangeOfRandom[1],
			}}
			caseSensitive={false}
			navigation={currentMode => (
				<>
					<TasRadioGroup
						options={[
							{
								label: "Adjective Object Verb pegs",
								value: "aaa",
							},
							{
								label: "abc",
								value: "abc",
							},
							{
								label: "abcde",
								value: "abcde",
							},
							{
								label: "Usage",
								value: "usage",
							},
						]}
						value={mode}
						onChange={value => setMode(value)}
					/>
					{currentMode === "random" && (
						<TasSlider
							value={rangeOfRandom}
							onChange={value => setRangeOfRandom(value)}
							max={numberOfClues - 1}
							valueLabelDisplay="auto"
							// valueLabelFormat={book => otBooks[book]}
							width="400px"
						/>
					)}
				</>
			)}
		/>
	);
};

export default MajorSystem;

const toDigits = num => {
	let str = num.toString();
	if (str.length === 1) {
		str = "0" + str;
	}
	return str;
};

const intsToPegString = ints =>
	ints.map((int, intIndex) => peg2[int][intIndex % 3]).join(" ");

const digitsToPegQuestion = size => {
	const ints = Array(size)
		.fill()
		.map((_, index) => Math.floor(Math.random() * numberOfClues));
	return {
		clue: ints.map(int => toDigits(int)).join(" "),
		answer: intsToPegString(ints),
	};
};

const createQuestions = ({ mode }) => {
	if (mode === "aaa")
		return function*() {
			for (var i = 0; i < numberOfClues; i++) {
				yield { clue: toDigits(i), answer: peg2[i].join(" ") };
			}
		};
	if (mode === "abc")
		return function*() {
			while (true) {
				yield digitsToPegQuestion(3);
			}
		};
	if (mode === "abcde")
		return function*() {
			while (true) {
				yield digitsToPegQuestion(5);
			}
		};
	if (mode === "usage") {
		return function*() {
			// Give a usage to convert
			// e.g. time, date, ot verse, door code, uno cards? normal cards? phone number
			// then ask for the numbers back after a bit
			const uses = [
				{
					label: "Door code",
					format: numbers => numbers.join(""),
					size: 4,
				},
				{
					label: "Time",
					format: numbers => numbers.join(":"),
					size: 4,
					maxes: [23, 59],
				},
				{
					label: "Date",
					format: numbers => numbers.join("/"),
					size: 4,
					maxes: [31, 12],
					mins: [1, 1],
				},
				{
					label: "Phone",
					format: numbers => numbers.join(" "),
					size: 10,
				},
			];

			while (true) {
				let memories = uses.map(use =>
					Array(use.size / 2)
						.fill()
						.map((_, index) => {
							const min =
								use.mins && use.mins[index] !== null ? use.mins[index] : 0;
							const max =
								use.maxes && use.maxes[index] !== null
									? use.maxes[index]
									: Number.POSITIVE_INFINITY;
							return (
								min +
								Math.floor(
									Math.random() * (Math.min(max + 1, numberOfClues) - min)
								)
							);
						})
				);

				let formattedCodes = memories.map((memoryInts, useIndex) =>
					uses[useIndex].format(memoryInts.map(int => toDigits(int)))
				);
				let learn = memories.map((memoryInts, useIndex) => ({
					clue: uses[useIndex].label + " " + formattedCodes[useIndex],
					answer: intsToPegString(memoryInts),
				}));
				let recall = memories.map((memoryInts, useIndex) => ({
					clue: uses[useIndex].label,
					answer: formattedCodes[useIndex],
				}));

				yield* learn;
				yield* recall;
			}
		};
	}
};

// const peg1 = [
// 	[
// 		"easy",
// 		"hot",
// 		"new",
// 		"yummy",
// 		"hairy",
// 		"oily",
// 		"itchy",
// 		"key",
// 		"key",
// 		"happy",
// 	],
// 	[
// 		"hose",
// 		"hat",
// 		"hen",
// 		"home",
// 		"arrow",
// 		"whale",
// 		"shoe",
// 		"cow",
// 		"hoof",
// 		"pie",
// 	],
// 	["sew", "hate", "know", "aim", "row", "heal", "chew", "hook", "view", "buy"],
// ];
