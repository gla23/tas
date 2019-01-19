import React, { Component } from "react";
import TypeArea from "./TypeArea";
import TasButton from "./components/TasButton";
import TasCheckbox from "./components/TasCheckbox";


// const ntBooks = ["Matthew","Mark","Luke","John","Acts","Romans","1 Corinthians","2 Corinthians","Galatians","Ephesians","Philippians","Colossians","1 Thessalonians","2 Thessalonians","1 Timothy","2 Timothy","Titus","Philemon","Hebrews","James","1 Peter","2 Peter","1 John","2 John","3 John","Jude","Revelation"];
// const otBooks = ["Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra", "Nehemiah", "Esther", "Job", "Psalm", "Proverbs", "Ecclesiastes", "Song of Songs", "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi"];
// const otAbbrev = ["Gen", "Ex", "Lev", "Num", "Deu", "Jos", "Jud", "Ru", "1S", "2S", "1K", "2K", "1C", "2C", "Ezr", "Neh", "Est", "Job", "Ps", "Pr", "Ecc", "Son", "Is", "Jer", "Lam", "Eze", "Dan", "Hos", "Joe", "Amo", "Oba", "Jon", "Mic", "Nah", "Hab", "Zep", "Hag", "Zec"];
// const ntChapters = [28, 16, 24, 21, 28, 16, 16, 13, 6, 6, 4, 4, 5, 3, 6, 4, 3, 1, 13, 5, 5, 3, 5, 1, 1, 1, 21];
// const otChapters = [50, 40, 27, 36, 34, 24, 21, 4, 31, 24, 22, 25, 29, 36, 10, 13, 10, 42, 150, 31, 12, 8, 66, 52, 5, 48, 12, 14, 3, 9, 1, 4, 7, 3, 3, 3, 2, 14, 4];
// function expandBibleCode(code) {
// 	return code;
// }

const learnLoopEnd = 148 - 3;
const learnLoopStart = learnLoopEnd - 15 + 4;
const loopSectionSize = 15;

let verses;
let verseStrings
verses = "a b c d".split(" ")
verseStrings = {
	a: "aaaa",
	b: "bbbb",
	c: "cccc",
	d: "dddd",
};

function loadVerses() {
	let answers = {};
	let clues = [];
	fetch('memory.txt')
	  .then(response => response.text())
	  .then(text => OpenTextLines.call(this, text))
	function OpenTextLines(text) {
		let lines = text.split("\n");
		for (var i = 0; i < lines.length; i++) {
			if (i % 2 === 0) {
				answers[lines[i]] = lines[i + 1];
				clues.push(lines[i]);
			}
		}
		this.answers = answers;
		this.clues = clues;
		setTimeout(() => this.setState({loaded: true}), 0)
	}
}


class Tas extends Component {
	constructor(props) {
		super(props);
		this.answers = verseStrings;
		this.clues = verses;

		this.state = {
			verseIndex: Math.floor(Math.random() * learnLoopStart),
			correctCount: 1,
			questionFreezed: false,
			loaded: false,
		};
		this.setQuestion = this.setQuestion.bind(this);
		this.learnLoops = this.learnLoops.bind(this);
		this.toggleFreeze = this.toggleFreeze.bind(this);

		loadVerses.call(this)

		this.shortcutMap = new Map();
		// this.shortcutMap.set("*", console.log);
		this.shortcutMap.set("PageDown", () => this.setQuestion(this.increaseVerse(1), false));
		this.shortcutMap.set("PageUp", () => this.setQuestion(this.increaseVerse(-1), false));
		this.shortcutMap.set("]", this.toggleFreeze);
	}

	incrementVerse = () => Math.min(this.state.verseIndex + 1, this.clues.length - 1);
	randomVerse = () => Math.floor(Math.random() * this.clues.length)
	toggleFreeze() {
		this.setState({questionFreezed: !this.state.questionFreezed});
	}
	increaseVerse(increase) {
		return () => {
			let newVerse = this.state.verseIndex + increase;
			let cappedAtTop = Math.min(newVerse, this.clues.length - 1);
			let clamped = Math.max(0, cappedAtTop);
			return clamped;	
		}
	}
	learnLoops() {
		if (this.state.correctCount < loopSectionSize) {
			return Math.floor(Math.random() * learnLoopStart)
		} else if (this.state.correctCount < 2 * loopSectionSize) {
			return learnLoopStart + Math.floor(
				Math.random() * (learnLoopEnd - learnLoopStart)
			);
		} else {
			if (this.state.verseIndex < learnLoopEnd) {
				return learnLoopEnd;
			}
			return this.incrementVerse();
		}
	}
	setQuestion(verseFn, incrementCorrectCount = true) {
		let setStateObj = {};
		 
		if (!this.state.questionFreezed) {
			setStateObj.verseIndex = verseFn();
		}
		if (incrementCorrectCount) {
			setStateObj.correctCount = this.state.correctCount + 1;
			setStateObj.verseShowing = false;
		}
		this.setState(setStateObj);
	}

	render() {
		return (
			<div>
				<TypeArea
					answer={this.answers[this.clues[this.state.verseIndex]]}
					clue={this.clues[this.state.verseIndex]}
					correctCount={this.state.correctCount}
					shortcutMap={this.shortcutMap}
					onComplete={function(){ this.setQuestion(this.learnLoops)}.bind(this)}
					navigationDiv={() => this.loopsNavigationDiv()}
					showControlDiv={true}
					showNavigationDiv={true}
				/>
			</div>
		);
	}
	loopsNavigationDiv() {
		return this.clues[learnLoopStart] && (
			<span>
				<h5>Change mem</h5>

				<TasButton
					text={"Recent - " + (this.clues[learnLoopStart])}
					onClick={() => this.setState({correctCount: loopSectionSize + 1, verseIndex: learnLoopStart})}
				/>
				<TasButton
					text={"New - " + (this.clues[learnLoopEnd])}
					onClick={() => this.setState({correctCount: 2 * loopSectionSize + 1, verseIndex: learnLoopEnd})}
				/>
				<TasButton
					text="Random"
					onClick={() => this.setQuestion(this.randomVerse, false)}
				/>
				<TasButton
					text="Complete"
					onClick={() => this.setQuestion(this.learnLoops)}
				/>
				<TasCheckbox
					text="Freeze"
					onClick={this.toggleFreeze}
					checked={this.state.questionFreezed}
				/>
			</span>
		)
	}
}

export default Tas;