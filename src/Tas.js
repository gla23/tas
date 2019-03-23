import React, { Component } from "react";
import TypeArea from "./TypeArea";
import TasButton from "./components/TasButton";
import TasCheckbox from "./components/TasCheckbox";

const learnLoopEnd = 152;
const learnLoopStart = learnLoopEnd - 15;
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
		this.shortcutMap.set("PageDown", () => this.setQuestion(this.increaseVerse(1), false, true));
		this.shortcutMap.set("PageUp", () => this.setQuestion(this.increaseVerse(-1), false, true));
		this.shortcutMap.set("]", this.toggleFreeze);

		document.title = "Type and see";
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
	setQuestion(verseFn, incrementCorrectCount = true, overrideFrozen = false) {
		let setStateObj = {};
		 
		if (!this.state.questionFreezed || overrideFrozen) {
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