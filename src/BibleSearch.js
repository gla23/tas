import React, { Fragment, useState } from "react";
import TextArea from "./TextArea";
import HiddenTextarea from "./components/HiddenTextarea";

const ntBooks = [
	"Matthew",
	"Mark",
	"Luke",
	"John",
	"Acts",
	"Romans",
	"1 Corinthians",
	"2 Corinthians",
	"Galatians",
	"Ephesians",
	"Philippians",
	"Colossians",
	"1 Thessalonians",
	"2 Thessalonians",
	"1 Timothy",
	"2 Timothy",
	"Titus",
	"Philemon",
	"Hebrews",
	"James",
	"1 Peter",
	"2 Peter",
	"1 John",
	"2 John",
	"3 John",
	"Jude",
	"Revelation",
];

const otBooks = [
	"Genesis",
	"Exodus",
	"Leviticus",
	"Numbers",
	"Deuteronomy",
	"Joshua",
	"Judges",
	"Ruth",
	"1 Samuel",
	"2 Samuel",
	"1 Kings",
	"2 Kings",
	"1 Chronicles",
	"2 Chronicles",
	"Ezra",
	"Nehemiah",
	"Esther",
	"Job",
	"Psalm",
	"Proverbs",
	"Ecclesiastes",
	"Song of Songs",
	"Isaiah",
	"Jeremiah",
	"Lamentations",
	"Ezekiel",
	"Daniel",
	"Hosea",
	"Joel",
	"Amos",
	"Obadiah",
	"Jonah",
	"Micah",
	"Nahum",
	"Habakkuk",
	"Zephaniah",
	"Haggai",
	"Zechariah",
	"Malachi",
];

const otAbbrev = [
	"Gen",
	"Ex",
	"Lev",
	"Num",
	"Deu",
	"Jos",
	"Jud",
	"Ru",
	"1S",
	"2S",
	"1K",
	"2K",
	"1C",
	"2C",
	"Ezr",
	"Neh",
	"Est",
	"Job",
	"Ps",
	"Pr",
	"Ecc",
	"Son",
	"Is",
	"Jer",
	"Lam",
	"Eze",
	"Dan",
	"Hos",
	"Joe",
	"Amo",
	"Oba",
	"Jon",
	"Mic",
	"Nah",
	"Hab",
	"Zep",
	"Hag",
	"Zec",
];

const ntChapters = [
	28,
	16,
	24,
	21,
	28,
	16,
	16,
	13,
	6,
	6,
	4,
	4,
	5,
	3,
	6,
	4,
	3,
	1,
	13,
	5,
	5,
	3,
	5,
	1,
	1,
	1,
	21,
];

const otChapters = [
	50,
	40,
	27,
	36,
	34,
	24,
	21,
	4,
	31,
	24,
	22,
	25,
	29,
	36,
	10,
	13,
	10,
	42,
	150,
	31,
	12,
	8,
	66,
	52,
	5,
	48,
	12,
	14,
	3,
	9,
	1,
	4,
	7,
	3,
	3,
	3,
	2,
	14,
	4,
];

function getCharNumber(string, position) {
	if (position >= string.length) {
		return undefined;
	}
	return string.codePointAt(position) - 96;
}

function getCharDigit(string, position) {
	let num = getCharNumber(string, position);
	if (num >= -48 && num <= -39) {
		return num + 48;
	}
	return false;
}

class OverMaximumError extends Error {
	constructor(message) {
		super(message);
		this.name = "OverMaximumError";
	}
}
class UndefinedCharacterError extends Error {
	constructor(message) {
		super(message);
		this.name = "UndefinedCharacterError";
	}
}

function getNextNumber(string, position, maximum = 150) {
	let num = getCharNumber(string, position);
	if (num === undefined) {
		return [undefined, 0];
	}
	// Letters
	if (num >= 1 && num <= 26) {
		return num <= maximum ? [num, 1] : [new OverMaximumError(), 0];
	}

	// Capital letters
	if (num >= -31 && num <= -6) {
		num = num + 32 + 27;
		return num <= maximum ? [num, 1] : [new OverMaximumError(), 0];
	}
	if (num === -48) {
		return [27, 1];
	}
	if (num === -64) {
		let lookNext = getNextNumber(string, position + 1, maximum);
		return [lookNext[0], lookNext[1] + 1];
	}
	if (num === -51) {
		return ["-", 1];
	}
	if (num >= -48 && num <= -39) {
		let nextDigit, twoDigits;
		num = num + 48;
		nextDigit = getCharDigit(string, position + 1);
		if (
			nextDigit === false ||
			num.toString() + nextDigit.toString() > maximum
		) {
			return num <= maximum ? [num, 1] : [new OverMaximumError(), 0];
		} else {
			twoDigits = num.toString() + nextDigit.toString();
		}

		nextDigit = getCharDigit(string, position + 2);
		if (
			nextDigit === false ||
			twoDigits.toString() + nextDigit.toString() > maximum
		) {
			return [twoDigits, 2];
		} else {
			return [twoDigits.toString() + nextDigit.toString(), 3];
		}
	}
	return [new UndefinedCharacterError(), 0];
}

function getNextBook(string, index) {
	let otBook = otAbbrev.filter(abbr =>
		string.toLowerCase().startsWith(abbr.toLowerCase())
	);
	if (otBook.length > 0) {
		let otIndex = otAbbrev.indexOf(otBook[0]);
		return ["old", otIndex + 1, otBook[0].length];
	}
	return ["new", ...getNextNumber(string, index, 27)];
}

function getVerseDesciptor(string, start) {
	let verseDesciptor = {};
	if (!string) return verseDesciptor;

	// Testament/book
	let charUpTo = start;
	let [testament, book, bookCodeLength] = getNextBook(string, charUpTo);
	if (book === undefined) {
		verseDesciptor.book = undefined;
		verseDesciptor.bookStart = charUpTo;
		verseDesciptor.bookEnd = charUpTo + bookCodeLength;
		return verseDesciptor;
	} else {
		verseDesciptor.testament = testament;
		verseDesciptor.book = book;
		verseDesciptor.bookStart = charUpTo;
		verseDesciptor.bookEnd = charUpTo + bookCodeLength;
	}
	charUpTo += bookCodeLength;

	// Chapter
	let [chapter, chapterCodeLength] = getNextNumber(
		string,
		charUpTo,
		testament === "new" ? ntChapters[book - 1] : otChapters[book - 1]
	);
	if (chapter === undefined) {
		verseDesciptor.chapter = undefined;
		verseDesciptor.chapterStart = charUpTo;
		verseDesciptor.chapterEnd = charUpTo + chapterCodeLength;
		return verseDesciptor;
	} else {
		verseDesciptor.testament = testament;
		verseDesciptor.chapter = chapter;
		verseDesciptor.chapterStart = charUpTo;
		verseDesciptor.chapterEnd = charUpTo + chapterCodeLength;
	}
	charUpTo += chapterCodeLength;

	// Verse
	let [verse, verseCodeLength] = getNextNumber(string, charUpTo, 999);
	if (verse === undefined) {
		verseDesciptor.verse = undefined;
		verseDesciptor.verseStart = charUpTo;
		verseDesciptor.verseEnd = charUpTo + verseCodeLength;
		return verseDesciptor;
	} else {
		verseDesciptor.testament = testament;
		verseDesciptor.verse = verse;
		verseDesciptor.verseStart = charUpTo;
		verseDesciptor.verseEnd = charUpTo + verseCodeLength;
	}
	charUpTo += verseCodeLength;

	return verseDesciptor;

	// let [afterVerse, afterVerseCodeLength] = getNextNumber(string, charUpTo, 999);

	// let versesEnd, versesEndCodeLength;
	// if (afterVerse === "-") {
	// 	charUpTo += afterVerseCodeLength;
	// 	[versesEnd, versesEndCodeLength] = getNextNumber(string, charUpTo, 999);
	// 	charUpTo += versesEndCodeLength;
	// 	if (versesEnd <= verse) {
	// 		versesEnd = undefined;
	// 	}
	// }

	// let expanded = "";
	// if (book !== undefined) {
	// 	expanded += bookString;
	// }
	// if (chapter !== undefined) {
	// 	expanded += " " + chapter;
	// }
	// if (verse !== undefined) {
	// 	expanded += ": " + verse;
	// }
	// if (versesEnd !== undefined) {
	// 	expanded += "-" + versesEnd;
	// }
	// return [expanded, charUpTo];
}

const BibleSearch = props => {
	// const [text, setText] = useState(props.text);
	// const [text, setText] = useState("abc 000 c38d d893345");
	const [text, setText] = useState("AA 3ğ");
	const [selection, setSelection] = useState([0, 0, "none"]);
	const [showingCursor, setShowingCursor] = useState(0);

	const verseDesciptor = getVerseDesciptor(text, 0);
	const { testament, book, chapter, verse } = verseDesciptor;
	const {
		bookStart,
		bookEnd,
		chapterStart,
		chapterEnd,
		verseStart,
		verseEnd,
	} = verseDesciptor;
	let expanded = "";
	if (book !== undefined) {
		expanded += testament === "new" ? ntBooks[book - 1] : otBooks[book - 1];
	}
	if (chapter !== undefined) {
		expanded += " " + chapter;
	}
	if (verse !== undefined) {
		expanded += ": " + verse;
	}
	// if (versesEnd !== undefined) {
	// 	expanded += "-" + versesEnd;
	// }

	return (
		<Fragment>
			<p />
			<TextArea
				text={text}
				charType={(char, pos) =>
					(pos >= bookStart && pos < bookEnd && "grey") ||
					(pos >= chapterStart && pos < chapterEnd && "grey2") ||
					(pos >= verseStart && pos < verseEnd && "grey3")
				}
				showingCursor={showingCursor}
				selection={selection}
				checkUpTo={text.length}
				wrap={"off"}
			/>

			<p>{expanded}</p>

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
