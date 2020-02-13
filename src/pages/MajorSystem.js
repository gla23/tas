import React, { useMemo } from "react";
import MemoriseTab from "../components/MemoriseTab";
import TasRadioGroup from "../widgets/TasRadioGroup";
import TasSlider from "../widgets/TasSlider";
import useLocalStorage from "../hooks/useLocalStorage";
import { otBooks } from "../data/verseData";

const peg2 = [
	// swazzy sassy
	["isis", "sauce", "assess"], 
	// sat seat
	["sad", "seed", "swat"], 
	// assign Sign Cyan Asian son
	["snowy", "sun", "sign"], 
	// Zoom Assume sumo awesome
	["sumo", "Sam", "swim"], 
	// seer
	["sorry", "sir", "swear"], 
	// Cell Hazel Hassle Hustle Seal
	["slow", "Salah", "sell"], 
	// swishy Sewage switch sachet sash sage siege
	["sage", "sash", "siege"], 
	// sick sky soak ascii ask sack sag seek sock
	["sick", "sock", "soak"], 
	// savvy sofa save safe
	["safe", "sofa", "save"], 
	// sappy soap sob sap sip soup
	["sappy", "soup", "sob"], 
	// toss Tess toys dice dies dizzy daisy tease dose
	["dizzy", "Tess", "toss"], 
	// dad dead died edit idiot tat tattoo tatty tidy tight toot dodo
	["tatty", "dodo", "tattoo"], 
	// Aidan den deny tan tawny teen teeny tiny thin tin tuna twin tune
	["tin", "tuna", "tune"], 
	// adam atom adeem damn dumb tame tome tomb thumb time Tim Tom
	["tame", "tome", "tomb"], 
	// tar tear thor throw tire torah tower tree
	["tar", "Thor", "tear"], 
	// <adj> tail as in the <adj> squirrel superhero // tall teal // tail telly tool towel// tally tell duel //
	["tall", "tail", "duel"], 
	// dutch tash teach dosh doge ditch dodge
	["tash", "doge", "dodge"], 
	// dog Deke take thick attack attic tack/y taco take talk tech thick thug toga took tuck tug twig
	["thug", "taco", "take"], 
	// dive like football or water //  deaf dove defy dafoe dive thief thieve though toffee
	["toffee", "dove", "dive"], 
	// tape deep dubai dip tuba type tabby tap dab teepee tip toby top tub dope
	["tape", "Toby", "dab"], 
	// Ness from smash bros // noisy nose ionise nasa nice ness
	["nasa", "Ness", "ionise"], 
	// newt as in amphibian version? // neat net unite knight knit knot neat newt nut knead
	["knight", "newt", "knit"], 
	// neon onion nanny nun naan nano inane no-no
	["neon", "nun", "nani"], 
	// numb enemy name Nemo nom gnome
	["numb", "Nemo", "nom"], 
	// narrow winery honour Nero henry gnaw near knorr knower norway noir
	["noir", "Nero", "gnaw"], 
	// annual nail inhale Neil kneel nil noel
	["noel", "Neil", "kneel"], 
	// nudgy nacho enjoy nudge hinge angel notch gnash hench nosh
	["hench", "angel", "nudge"], 
	// neck knock naggy enoch eunuch gnocchi hang nick nag nike nuke nokia
	["nike", "Nick", "knock"], 
	// envy info knife naff naive navy knave - a dishonest or unscrupulous man
	["navy", "knave", "knife"], 
	// nap nab nape nib nip nope wannabe honeybee
	["newbie", "honeybee", "nope"], 
	// Yoe Windu with mace, // moose amaze amos amuse Holmes hummus Mace mace mass mouse mess miss moss Moss Moyes muzzo ohms
	["moss", "moose", "Mace"], 
	// emote emit mate mad maid matt mat math meat meaty met meth mit moat mood moth mud mute myth mouth meadow aimed amati amd amity emmet hemmed homed humid m8 mata math mead
	["mud", "moth", "mayday"], 
	// man amen/ameen human humane immune main mana mane (aslan) mayan mean moan money moon omani omen
	["mane", "Mane", "ameen"], 
	// imam maim mum mayhem meme mime memo
	["meme", "imam", "mime"], 
	// amari homer humour mare mario marrow marry mayor merry mire moore Murray ymir omar
	["merry", "mario", "marry"], 
	// email mail Emily male maul melee mellow mill moghul mole mule
	["mole", "mule", "maul"], 
	// amish image macho magi mash match mesh mojo mosh much mushy
	["mesh", "magi", "mash"], 
	//
	["", "", ""], 
	//
	["", "", ""], 
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
peg2Notes[10] = ["", "", "seismic toss"];
peg2Notes[12] = ["", "", "tune a piano or fork, or conducting"];
peg2Notes[17] = ["as in thug life", "", "take as in steal"];
peg2Notes[31] = ["", "venemoth", "to be saved by mystery dungeon team"];
peg2Notes[34] = ["tipsy to diff from noel", "", "marry peach"];
peg2Notes[99] = ["", "", ""];

const initialRange = [20, numberOfClues - 1];

const MajorSystem = props => {
	const [mode, setMode] = useLocalStorage("majorMode", "aaa");
	const [range, setRange] = useLocalStorage("majorRange", initialRange);

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
				randomStart: mode === "usage" ? 0 : range[0],
				randomEnd: range[1],
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
							value={range}
							onChange={value => setRange(value)}
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
				yield {
					clue: toDigits(i),
					answer:
						peg2[i][0] +
						" " +
						otBooks[i - 1] +
						" " +
						peg2[i].slice(1).join(" "),
				};
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
					format: numbers =>
						numbers[0] +
						numbers[1] +
						" " +
						numbers[2] +
						numbers[3].slice(0, 1) +
						" " +
						numbers[3].slice(1, 2) +
						numbers[4],
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
