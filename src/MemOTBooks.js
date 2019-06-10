import React, { useState, useEffect } from "react";
import MemoriseTab from "./MemoriseTab";
import { otBooks } from "./verseData";

const loopStart = 9;
const loopEnd = 39;
const loopSectionSize = 15;

const MemOTBooks = props => {
	return (
		<MemoriseTab
			answers={otBooks}
			clues={Object.keys(otBooks).map(c => Number(c) + 1)}
			loopStart={loopStart}
			loopEnd={loopEnd}
			loopSectionSize={loopSectionSize}
			caseSensitive={false}
		/>
	);
};

export default MemOTBooks;
