import React from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import MemoriseTab from "../components/MemoriseTab";
import TasSlider from "../widgets/TasSlider";

const initialRange = [1, 10];
const MemOTBooks = props => {
	const [range, setRange] = useLocalStorage("letters", initialRange);

	function* questionsGeneratorFunction() {
		yield* letters.map((letter, index) => ({
			clue: index + 1,
			answer: letter,
		}));
	}

	return (
		<>
			<MemoriseTab
				questions={questionsGeneratorFunction}
				modes={["random", "next"]}
				caseSensitive={false}
				questionOptions={{
					randomStart: range[0],
					randomEnd: range[1] + 1,
					consecutive: 1,
				}}
				navigation={mode =>
					mode === "random" && (
						<TasSlider
							value={range}
							onChange={value => setRange(value)}
							max={38}
							valueLabelDisplay="auto"
							valueLabelFormat={index => letters[index]}
							width="400px"
						/>
					)
				}
			/>
		</>
	);
};

const letters = [
	"a",
	"b",
	"c",
	"d",
	"e",
	"f",
	"g",
	"h",
	"i",
	"j",
	"k",
	"l",
	"m",
	"n",
	"o",
	"p",
	"q",
	"r",
	"s",
	"t",
	"u",
	"v",
	"w",
	"x",
	"y",
	"z",
	"ç",
	"ş",
	"ö",
	"ü",
	"A",
	"B",
	"C",
	"D",
	"E",
	"F",
	"G",
	"H",
	"I",
	"J",
	"K",
	"L",
	"M",
	"N",
	"O",
	"P",
	"Q",
	"R",
	"S",
	"T",
	"U",
	"V",
	"W",
	"X",
	"Y",
	"Z",
	"Ç",
	"Ş",
	"Ö",
	"Ü",
];

export default MemOTBooks;
