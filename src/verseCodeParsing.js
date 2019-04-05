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
	return string.codePointAt(position) - 96;
}

function getCharDigit(string, position) {
	let num = getCharNumber(string, position);
	if (num >= -48 && num <= -39) {
		return num + 48;
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
	// Letters
	if (num >= 1 && num <= 26) {
		return num <= maximum
			? [num, 1]
			: [new OverMaximumError(num + " is over maximum of " + maximum), 1];
	}

	// Capital letters
	if (num >= -31 && num <= -6) {
		num = num + 32 + 27;
		return num <= maximum
			? [num, 1]
			: [new OverMaximumError(num + " is over maximum of " + maximum), 1];
	}
	// 0
	if (num === -48) {
		return [27, 1];
	}

	// " "
	if (num === -64) {
		let lookNext = getNextNumber(string, position + 1, maximum);
		return [lookNext[0], lookNext[1] + 1];
	}

	// -
	if (num === -51) {
		return ["-", 1];
	}

	// Numbers
	if (num >= -48 && num <= -39) {
		let nextDigit, twoDigits;
		num = num + 48;
		nextDigit = getCharDigit(string, position + 1);
		if (
			nextDigit === false ||
			num.toString() + nextDigit.toString() > maximum
		) {
			return num <= maximum
				? [num, 1]
				: [new OverMaximumError(num + " is over maximum of " + maximum), 1];
		} else {
			twoDigits = num.toString() + nextDigit.toString();
		}

		nextDigit = getCharDigit(string, position + 2);
		let threeDigits = twoDigits + nextDigit.toString();
		if (nextDigit === false || threeDigits > maximum) {
			return [Number(twoDigits), 2];
		} else {
			return [Number(threeDigits), 3];
		}
	}
	return [new UndefinedCharacterError(string[position] + " not number"), 1];
}

function getNextBook(string, index) {
	let otBook = otAbbrev.filter(abbr =>
		string.toLowerCase().startsWith(abbr.toLowerCase())
	);
	if (otBook.length > 0) {
		let otIndex = otAbbrev.indexOf(otBook[0]);
		return ["old", otIndex + 1, otBook[0].length];
	}
	// new OverMaximumError(
	// 			"There are not this many chapters!"
	// 		);
	let next = getNextNumber(string, index, 27);
	return ["new", ...next];
}

export function getVerseDesciptor(string, start) {
	let verseDesciptor = {};
	if (!string) return verseDesciptor;

	// Testament/book
	let charUpTo = start;
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
