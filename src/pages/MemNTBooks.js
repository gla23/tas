import React from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import MemoriseTab from "../components/MemoriseTab";
import { ntBooks } from "../data/verseData";
import TasSlider from "../widgets/TasSlider";
import TasCheckbox from "../widgets/TasCheckbox";

const initialRange = [1, 10];

const MemOTBooks = (props) => {
	const [range, setRange] = useLocalStorage("ntBooks", initialRange);

	function* questionsGeneratorFunction() {
		yield* ntBooks.map((book, index) => ({ clue: index + 1, answer: book }));
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
				}}
				navigation={(mode) => (
					<>
						<h5>Range of books</h5>
						<TasSlider
							value={range}
							max={26}
							onChange={(value) => setRange(value)}
							valueLabelFormat={(index) => ntBooks[index]}
							markSelected
						/>
					</>
				)}
			/>
		</>
	);
};

export default MemOTBooks;
