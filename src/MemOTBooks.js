import React, { useState } from "react";
import MemoriseTab from "./MemoriseTab";
import { otBooks } from "./verseData";
import TasSlider from "./components/TasSlider";

const initialRangeOfRandom = [13, 28];

const MemOTBooks = props => {
	const [rangeOfRandom, setRangeOfRandom] = useState(initialRangeOfRandom);

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
					randomStart: rangeOfRandom[0],
					randomEnd: rangeOfRandom[1],
				}}
				navigation={mode =>
					mode === "random" && (
						<TasSlider
							value={rangeOfRandom}
							onChange={value => setRangeOfRandom(value)}
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
