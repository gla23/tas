import React from "react";

import { loadVerses } from "../data/loadVerses";
// import { parse } from "../parsing/verseCode";
import "../parsing/test.ts";

const New = (props) => {
	loadVerses.then((verses) => console.log(verses));
	// parse("aff");
	return <p>hiya</p>;
};

export default New;
