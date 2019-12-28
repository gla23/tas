import {
	ntBooks,
	ntChapters,
	ntVerses,
	otBooks,
	otChapters,
	otVerses,
	otAbbrev,
} from "./verseData.js";

function getCharNumber(string, position) {
	if (position >= string.length) {
		return undefined;
	}
	return string.codePointAt(position);
}

function getCharDigit(string, position) {
	let num = getCharNumber(string, position);
	if (num >= 48 && num <= 57) {
		return num - 48;
	}
	return false;
}

export class OverMaximumError extends Error {
	constructor(message) {
		super(message);
		this.name = "OverMaximumError";
	}
}
export class UndefinedCharacterError extends Error {
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

	const filterMax = (num, maximum) =>
		num <= maximum
			? [num, 1]
			: [new OverMaximumError(num + " is over maximum of " + maximum), 1];

	// Letters
	if (num >= 97 && num <= 122) {
		return filterMax(num - 96, maximum);
	}

	// Capital letters
	if (num >= 65 && num <= 90) {
		num = num + 128 - 192 + 30;
		return filterMax(num, maximum);
	}
	// 0
	if (num === 48) {
		return filterMax(30, maximum);
	}
	let letters = {
		231: 27, // ç
		351: 28, // ş
		246: 29, // ö
		252: 30, // ü
		199: 57, // Ç
		350: 58, // Ş
		214: 59, // Ö
		220: 60, // Ü
	};
	if (letters[num]) {
		return filterMax(letters[num], maximum);
	}

	// " "
	if (num === 32) {
		let lookNext = getNextNumber(string, position + 1, maximum);
		return [lookNext[0], lookNext[1] + 1];
	}

	// -
	if (num === 45) {
		return ["-", 1];
	}

	// Numbers
	if (num >= 48 && num <= 57) {
		let nextDigit, twoDigits, threeDigits;
		num = num - 48;
		nextDigit = getCharDigit(string, position + 1);
		twoDigits = num.toString() + nextDigit.toString();
		if (!nextDigit || Number(twoDigits) > maximum) {
			return filterMax(num, maximum);
		}

		nextDigit = getCharDigit(string, position + 2);
		threeDigits = twoDigits + nextDigit.toString();
		return nextDigit !== false && Number(threeDigits) <= maximum
			? [Number(threeDigits), 3]
			: [Number(twoDigits), 2];
	}
	return [new UndefinedCharacterError(string[position] + " not number"), 1];
}

function getNextBook(string, index) {
	let otBook = otAbbrev.filter(abbr =>
		string
			.slice(index)
			.toLowerCase()
			.startsWith(abbr.toLowerCase())
	);
	if (otBook.length > 0) {
		let otIndex = otAbbrev.indexOf(otBook[0]);
		return ["old", otIndex + 1, otBook[0].length];
	}
	let next = getNextNumber(string, index, 27);
	return ["new", ...next];
}

export function getVerseDesciptor(string, start = 0) {
	let verseDesciptor = {};
	if (!string) return verseDesciptor;

	let charUpTo = start;

	// Testament/book
	charUpTo += numberOfSpaces(string, charUpTo);
	let [testament, book, bookCodeLength] = getNextBook(string, charUpTo);
	if (book === undefined || book instanceof Error) {
		verseDesciptor.book = book;
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
	charUpTo += numberOfSpaces(string, charUpTo);
	let [chapter, chapterCodeLength] = getNextNumber(
		string,
		charUpTo,
		testament === "new" ? ntChapters[book - 1] : otChapters[book - 1]
	);
	if (chapter === undefined || chapter instanceof Error) {
		verseDesciptor.chapter = chapter;
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
	charUpTo += numberOfSpaces(string, charUpTo);
	let [verse, verseCodeLength] = getNextNumber(
		string,
		charUpTo,
		testament === "new"
			? ntVerses[book - 1][chapter - 1]
			: otVerses[book - 1][chapter - 1]
	);
	if (verse === undefined || verse instanceof Error) {
		verseDesciptor.verse = verse;
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

function numberOfSpaces(string, charUpTo) {
	let count = 0;
	while (charUpTo < string.length) {
		if (string[charUpTo] === " ") {
			charUpTo += 1;
			count += 1;
		} else {
			return count;
		}
	}
	return count;
}

export function parseVerse(string) {
	if (string === undefined || string === " " || string === "") {
		return "";
	}
	const verseDesciptor = getVerseDesciptor(string);
	return getTextFromDescriptor(verseDesciptor);
}

export function getTextFromDescriptor(verseDesciptor) {
	const { testament, book, chapter, verse } = verseDesciptor;
	let expanded = "";
	if (typeof book === "number") {
		expanded += testament === "new" ? ntBooks[book - 1] : otBooks[book - 1];
		expanded += " ";
	}
	if (typeof chapter === "number") {
		expanded += chapter;
	}
	if (typeof verse === "number") {
		expanded += ":" + verse;
	}
	// if (versesEnd !== undefined) {
	// 	expanded += "-" + versesEnd;
	// }

	return expanded;
}

export function getErrorsFromDescriptor(verseDesciptor) {
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
