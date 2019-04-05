import React, { Fragment, useState } from "react";
import TextArea from "./TextArea";
import HiddenTextarea from "./components/HiddenTextarea";

import {
	getVerseDesciptor,
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

function getTextFromDescriptor(verseDesciptor) {
	const { testament, book, chapter, verse } = verseDesciptor;
	let expanded = "";
	if (typeof book === "number" || typeof book === "string") {
		expanded += testament === "new" ? ntBooks[book - 1] : otBooks[book - 1];
		expanded += " ";
	}
	if (typeof chapter === "number" || typeof book === "string") {
		expanded += chapter;
	}
	if (typeof verse === "number" || typeof book === "string") {
		expanded += ":" + verse;
	}
	// if (versesEnd !== undefined) {
	// 	expanded += "-" + versesEnd;
	// }

	return expanded;
}

function getErrorsFromDescriptor(verseDesciptor) {
	const { book, chapter, verse } = verseDesciptor;
	let errors = [];
	if (book instanceof OverMaximumError) {
		errors.push(book.message + " books");
	}
	if (book instanceof UndefinedCharacterError) {
		errors.push(book.message);
	}
	if (chapter instanceof OverMaximumError) {
		errors.push(chapter.message + " chapters");
	}
	if (chapter instanceof UndefinedCharacterError) {
		errors.push(chapter.message);
	}
	if (verse instanceof OverMaximumError) {
		errors.push(verse.message + " verses");
	}
	if (verse instanceof UndefinedCharacterError) {
		errors.push(verse.message);
	}
	return errors;
}

const BibleSearch = props => {
	const [text, setText] = useState(props.text);

	const [selection, setSelection] = useState([0, 0, "none"]);
	const [showingCursor, setShowingCursor] = useState(0);

	const verseDesciptor = getVerseDesciptor(text, 0);
	const expanded = getTextFromDescriptor(verseDesciptor);
	const errors = getErrorsFromDescriptor(verseDesciptor);

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
