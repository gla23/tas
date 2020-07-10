import React from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import MemoriseTab from "../components/MemoriseTab";
import TasSlider from "../widgets/TasSlider";

const initialRange = [9, 30];
const maxRange = 100;
const initialMod = 8;
const maxMod = 14;
const markTexts = [2, 3, 6, 8].map((value) => ({ value, label: value }));

const Mod = (props) => {
	const [range, setRange] = useLocalStorage("modRange", initialRange);
	const [mod, setMod] = useLocalStorage("mod", initialMod);
	function* questionsGeneratorFunction() {
		yield* Array(maxRange + 1)
			.fill()
			.map((_, index) => ({
				clue: index + " mod " + mod,
				answer: index % mod,
			}));
	}
	return (
		<>
			<MemoriseTab
				questions={questionsGeneratorFunction}
				modes={["random"]}
				caseSensitive={false}
				questionOptions={{
					randomStart: range[0],
					randomEnd: range[1] + 1,
					consecutive: 1,
				}}
				navigation={(mode) => (
					<>
						<h5>Range of n</h5>
						<div className="container">
							<TasSlider
								value={range}
								onChange={setRange}
								min={mod}
								max={maxRange}
								markSelected
							/>
						</div>

						<h5>Mod value</h5>
						<TasSlider
							value={mod}
							onChange={setMod}
							max={maxMod}
							min={2}
							track={false}
							marks={markTexts}
							markSelected
						/>
					</>
				)}
			/>
		</>
	);
};

export default Mod;
