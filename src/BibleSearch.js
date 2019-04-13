import React, { Fragment, useState, useMemo } from "react";
import TextArea from "./TextArea";
import HiddenTextarea from "./components/HiddenTextarea";

import {
	getVerseDesciptor,
	getTextFromDescriptor,
	getErrorsFromDescriptor,
	OverMaximumError,
	UndefinedCharacterError,
} from "./verseCodeParsing";

import {
	ntBooks,
	// ntChapters,
	// ntVerses,
	otBooks,
	// otChapters,
	// otVerses,
	// otAbbrev,
} from "./verseData.js";

const GatewayPage = props => {
	// return <p>hi</p>;
};

const BibleSearch = props => {
	const [text, setText] = useState(props.text);

	const [selection, setSelection] = useState([0, 0, "none"]);
	const [showingCursor, setShowingCursor] = useState(0);

	console.log("rerender");

	const [verseDesciptor, expanded, errors] = useMemo(() => {
		const verseDesciptor = getVerseDesciptor(text, 0);
		const expanded = getTextFromDescriptor(verseDesciptor);
		const errors = getErrorsFromDescriptor(verseDesciptor);
		return [verseDesciptor, expanded, errors];
	}, [text]);

	const {
		book,
		bookStart,
		bookEnd,
		chapter,
		chapterStart,
		chapterEnd,
		verse,
		verseStart,
		verseEnd,
	} = verseDesciptor;

	// console.log(verseDesciptor);

	return (
		<Fragment>
			<p />
			<TextArea
				text={text}
				charType={(char, pos) =>
					(pos >= bookStart &&
						pos < bookEnd &&
						(book instanceof Error ? "red" : "grey")) ||
					(pos >= chapterStart &&
						pos < chapterEnd &&
						(chapter instanceof Error ? "red" : "grey2")) ||
					(pos >= verseStart &&
						pos < verseEnd &&
						(verse instanceof Error ? "red" : "grey3"))
				}
				showingCursor={showingCursor}
				selection={selection}
				checkUpTo={text.length}
				wrap={"off"}
			/>

			<p>{expanded}</p>

			{errors.map((message, index) => (
				<p key={index}>{message}</p>
			))}

			{GatewayPage("old", 19, 25)}

			<p className="bigGap" />

			<HiddenTextarea
				text={text}
				onChange={event => setText(event.target.value)}
				onKeyDown={shortcuts}
				updateSelection={setSelection}
				onChangeFocus={setShowingCursor}
			/>
		</Fragment>
	);
};

let shortcuts = event => {
	if (event.key === "Enter") {
		event.preventDefault();
		console.log("enter");
	}
	if (event.key === "Enter") {
		event.preventDefault();
		console.log("enter");
	}
	if (event.key === "[") {
		event.preventDefault();
		console.log("enter");
	}
	if (event.key === "#" || event.key === "Escape") {
		event.preventDefault();
		console.log("enter");
	}
};

export default BibleSearch;
