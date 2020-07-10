import React from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import MemoriseTab from "../components/MemoriseTab";
import TasSlider from "../widgets/TasSlider";

const initialRange = [1, 10];
const MemOTBooks = (props) => {
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
				navigation={(mode, inverted) => (
					<>
						<h5>Range of letters</h5>
						<TasSlider
							value={range}
							max={38}
							onChange={(value) => setRange(value)}
							valueLabelFormat={(index) => letters[index]}
							markSelected
						/>
					</>
				)}
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
