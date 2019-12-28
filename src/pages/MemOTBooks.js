import React from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import MemoriseTab from "../components/MemoriseTab";
import { otBooks } from "../data/verseData";
import TasSlider from "../widgets/TasSlider";

const initialRange = [1, 10];

const MemOTBooks = props => {
	const [range, setRange] = useLocalStorage("otBooks", initialRange);

	function* questionsGeneratorFunction() {
		yield* otBooks.map((book, index) => ({ clue: index + 1, answer: book }));
	}

	return (
		<>
			<MemoriseTab
				questions={questionsGeneratorFunction}
				modes={["random", "next"]}
				caseSensitive={false}
				questionOptions={{
					randomStart: range[0],
					randomEnd: range[1],
				}}
				navigation={mode =>
					mode === "random" && (
						<TasSlider
							value={range}
							onChange={value => setRange(value)}
							max={38}
							valueLabelDisplay="auto"
							valueLabelFormat={book => otBooks[book]}
							width="400px"
						/>
					)
				}
			/>
		</>
	);
};

export default MemOTBooks;
