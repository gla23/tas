import React, { Component } from "react";
import ReactDOM from "react-dom";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";
import TextArea from "./TextArea";



const ntBooks = ["Matthew","Mark","Luke","John","Acts","Romans","1 Corinthians","2 Corinthians","Galatians","Ephesians","Philippians","Colossians","1 Thessalonians","2 Thessalonians","1 Timothy","2 Timothy","Titus","Philemon","Hebrews","James","1 Peter","2 Peter","1 John","2 John","3 John","Jude","Revelation"];
const otBooks = ["Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra", "Nehemiah", "Esther", "Job", "Psalm", "Proverbs", "Ecclesiastes", "Song of Songs", "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi"];
const otAbbrev = ["Gen", "Ex", "Lev", "Num", "Deu", "Jos", "Jud", "Ru", "1S", "2S", "1K", "2K", "1C", "2C", "Ezr", "Neh", "Est", "Job", "Ps", "Pr", "Ecc", "Son", "Is", "Jer", "Lam", "Eze", "Dan", "Hos", "Joe", "Amo", "Oba", "Jon", "Mic", "Nah", "Hab", "Zep", "Hag", "Zec"];
const ntChapters = [28, 16, 24, 21, 28, 16, 16, 13, 6, 6, 4, 4, 5, 3, 6, 4, 3, 1, 13, 5, 5, 3, 5, 1, 1, 1, 21];
const otChapters = [50, 40, 27, 36, 34, 24, 21, 4, 31, 24, 22, 25, 29, 36, 10, 13, 10, 42, 150, 31, 12, 8, 66, 52, 5, 48, 12, 14, 3, 9, 1, 4, 7, 3, 3, 3, 2, 14, 4];
function expandBibleCode(code) {
	return code;
}

const verses = ["a", "afs", "aft"];
const verseText = {
	a: "aa",
	afs:
		"Do not lay up for yourselves treasures on earth, where moth and rust destroy and where thieves break in and steal,",
	aft:
		"but lay up for yourselves treasures in heaven, where neither moth nor rust destroys and where thieves do not break in and steal."
};
const checkBaseTime = 30;
const checkTreacle = 7;
const freshData = {
	text: "",
	selection: [-1, -1, "none"],
	checkLength: 0,
	checkedLength: 0,
	checkIncrementTime: 10,
	correctLength: 0,
}
class TypeArea extends Component {
	constructor(props) {
		super(props);
		this.state = {
			verse: verses[0],
			text: "Benny bob",
			...freshData
		};
		this.textareaRef = React.createRef();
		this.onTextChange = this.onTextChange.bind(this);
		this.charCorrect = this.charCorrect.bind(this);
		this.handleInput = this.handleInput.bind(this);
		this.startSearching = this.startSearching.bind(this);
		this.focusTextArea = this.focusTextArea.bind(this);
		this.incrementCheckedLength = this.incrementCheckedLength.bind(this);
		this.moveToNext = this.moveToNext.bind(this);
		this.moveToVerse = this.moveToVerse.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);
	}
	componentDidMount() {
		if (this.textareaRef.current) {
			// Direct reference to autocomplete DOM node
			this.node = ReactDOM.findDOMNode(this.textareaRef.current);

			// Evergreen event listener || IE8 event listener
			const addEvent = this.node.addEventListener || this.node.attachEvent;
			addEvent("keypress", this.handleKeyPress, false);
		}
	}
	componentWillUnmount() {
		const removeEvent = this.node.removeEventListener || this.node.detachEvent;
		// Reduce any memory leaks
		removeEvent("keypress", this.handleKeyPress);
	}
	handleKeyPress(event) {
		console.log(event.keyCode);
		
		if (event.keyCode === 91) {
			event.preventDefault();
			this.startSearching();
		}
		if (event.keyCode === 93) {
			event.preventDefault();
			this.moveToVerse("afs")
		}
	}
	incrementCheckedLength() {
		let startingPos = this.state.checkedLength
		let charsToJump = Math.ceil((1 + this.state.checkLength)/50)
		let newPos = this.state.checkedLength + charsToJump
		newPos = Math.min(newPos, this.state.text.length);
		console.log(newPos);
		if (startingPos < this.state.correctLength) {
			if (newPos > this.state.correctLength) {
				newPos = this.state.correctLength
			}
			let timeToNextJump = checkBaseTime/(this.state.checkedLength * 4);
			this.setState({
				checkedLength: newPos,
				checkIncrementTime: timeToNextJump
			});
			setTimeout(this.incrementCheckedLength, timeToNextJump);
			console.log(charsToJump, newPos);
			console.log("timeToNextJump", timeToNextJump, newPos);
		} else {
			// At the end or slowing down
			if (this.state.text == verseText[this.state.verse]) {
				setTimeout(this.moveToNext, 1500);
			} else {
				if (this.state.correctLength == startingPos && this.state.text.length > 0) {
					// Always check 1 char
					this.setState({checkedLength: startingPos + 1});
					setTimeout(this.incrementCheckedLength, 10);
				}
				let newIncrementTime = this.state.checkIncrementTime * checkTreacle;
				console.log(newIncrementTime);
				if (newIncrementTime > 800) {
					return
				}
				this.setState({
					checkedLength: this.state.checkedLength + 1,
					checkIncrementTime: newIncrementTime,
				});
				setTimeout(this.incrementCheckedLength, newIncrementTime);
			}
		}
	}

	moveToNext() {
		console.log("yuuup");
		this.moveToVerse(verses[verses.indexOf(this.state.verse) + 1])
	}
	moveToVerse(verse) {
		this.setState({
			verse: verse,
			...freshData
		});
	}
	focusTextArea() {
		this.textareaRef.current.focus({preventScroll: true})
	}

	onTextChange(event) {
		let text = event.target.value;
		let textElem = this.textareaRef.current;

		let enteredChar = textElem.value[textElem.selectionStart - 1]
		let moveCursor = function() {
			// textElem.selectionStart = 
			// textElem.selectionEnd = 
			// console.log(this.selectionOld);
		}
		moveCursor = moveCursor.bind(this)
		
		let oldSelectionPosition = this.state.selection[0];
		let verse = verseText[this.state.verse];
		if (!verse) {
			return;
		}

		this.setState(
			(prevState, props) => ({
				text: text,
			}),
			function() {
				// Once text has been changed
				let correctLength = 0;
				for(let i = 0; i < text.length; i++) {
					if (text[i] !== verse[i]) {
						break;
					} else {
						correctLength = i + 1;
					}
				}
				console.log("correct", correctLength);

				if (text === verse) {
					this.setState({correctLength: correctLength})
					this.startSearching();
				} else {
					let newSelectionPosition = this.state.selection[0];
					let selectionPosToSet = Math.min(this.state.checkedLength, oldSelectionPosition, newSelectionPosition)
					this.setState({
						checkedLength: selectionPosToSet,
						checkLength: selectionPosToSet,
						correctLength: correctLength,
					})
				}
			}
		)
	}

	handleInput(event) {
		let start = event.target.selectionStart
		let end = event.target.selectionEnd
		let direction = event.target.selectionDirection
		this.setState({selection: [start, end, direction]})
	}
	startSearching(event) {
		// console.log("setting check to: ", this.state.text.length)
		this.setState({checkLength: this.state.text.length}, this.incrementCheckedLength);
	}

	charCorrect(char, pos) {
		// console.log(this.state.text, pos, char);
		return (verseText[this.state.verse][pos] === char)
	}

	render() {

		const tasDivStyle = { marginLeft: "60", marginRight: "60" };

		return (
			<div
				className="Tas" 
				style={tasDivStyle}
				onClick={this.focusTextArea}
			>
				<p className="clue">{this.state.verse}</p>


				<TextArea
					text={this.state.text}
					onChange={this.onTextChange}
					charCorrect={this.charCorrect}
					selection={this.state.selection}
					checkLength={this.state.checkedLength}
					textareaRef={this.textareaRef.current}
				/>
				
				<div className="controlDiv">
					<Button 
						variant="outlined"
						color="primary"
						onClick={this.startSearching}
					>
						Check
					</Button>
					
				</div>
				

				<p 
					className="bigGap"
				/>
				
				<textarea 
					id="textarea"
					ref={this.textareaRef}
					value={this.state.text}
					onChange={this.onTextChange}
					onSelect={this.handleInput}
					onInput={this.handleInput}
					spellCheck={false}
					autoFocus={true}
					placeholder={""}
					
				/>
				
			</div>
		);
	}
}

export default TypeArea;