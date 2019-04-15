import React, { Component, useState } from "react";
import TasButton from "./components/TasButton";
import TextArea from "./TextArea";
import HiddenTextarea from "./components/HiddenTextarea";
import CheckAnimate from "./CheckAnimate";

const freshClueData = {
	checkUpTo: 0,
};

const freshCountData = {
	text: "",
};

const TypeArea = props => {
	const [focused, setFocused] = useState(false);
	const [selection, setSelection] = useState([0, 0, "none"]);
	const [showingAnswer, setShowingAnswer] = useState(false);
	const toggleAnswer = () => setShowingAnswer(r => !r);
	const [showingUI, setshowingUI] = useState(true);
	const toggleUI = () => setshowingUI(r => !r);
	return (
		<OldTypeArea
			{...props}
			focused={focused}
			setFocused={setFocused}
			selection={selection}
			setSelection={setSelection}
			showingAnswer={showingAnswer}
			toggleAnswer={toggleAnswer}
			showingUI={showingUI}
			toggleUI={toggleUI}
		/>
	);
};

class OldTypeArea extends Component {
	constructor(props) {
		super(props);
		this.state = {
			text: " ",
			...freshClueData,
			...freshCountData,
		};
		this.onHiddenTextChange = this.onHiddenTextChange.bind(this);
		this.setNewCheckAnimate();

		this.shortcut = this.shortcut.bind(this);
	}
	updateCheckedUpTo(val) {
		this.setState({ checkedUpTo: val });
	}
	ifCorrectComplete() {
		console.log("completing");
		this.state.text === this.props.answer &&
			setTimeout(this.props.onComplete, 10);
	}

	setNewCheckAnimate = () => {
		if (this.props.answer) {
			this.checkAnimate = new CheckAnimate(
				this.props.answer.length,
				this.updateCheckedUpTo.bind(this),
				this.ifCorrectComplete.bind(this)
			);
		} else {
			console.log("not setting checkAnimate");
		}
	};
	shortcut(event) {
		if (event.key === "Enter") {
			event.preventDefault();
			this.checkAnimate.start();
		}
		if (event.key === "[") {
			event.preventDefault();
			this.props.toggleAnswer();
		}
		if (event.key === "#" || event.key === "Escape") {
			event.preventDefault();
			this.props.toggleUI();
		}
		if (this.props.shortcutMap) {
			let shortcutFunction = this.props.shortcutMap.get(event.key);

			if (shortcutFunction) {
				event.preventDefault();
				shortcutFunction(event.key);
			} else {
				let allFunction = this.props.shortcutMap.get("*");
				if (allFunction) {
					allFunction(event.key);
				}
			}
		}
	}

	componentDidUpdate(prevProps, prevState) {
		// Object.entries(this.props).forEach(
		// 	([key, val]) =>
		// 		prevProps[key] !== val && console.log(`Prop '${key}' changed`)
		// );

		if (prevProps.correctCount !== this.props.correctCount) {
			this.setState({ ...freshClueData, ...freshCountData });
		} else {
			if (prevProps.clue !== this.props.clue) {
				this.setNewCheckAnimate();
				this.setState(freshClueData);
				this.checkAnimate.checkUpTo = 0;
			}
		}
		if (prevState.text !== this.state.text) {
			this.checkAnimate.checkUpTo = lengthCorrect(
				this.state.text,
				this.props.answer
			);
		}
	}

	onHiddenTextChange(event) {
		const { selection } = this.props;
		let text = event.target.value;
		let answer = this.props.answer;

		text === answer && this.checkAnimate.start();

		let oldSelectionPosition = selection[0];
		let newSelectionPosition = event.target.selectionStart;

		let checkedPosToSet = Math.min(
			this.checkAnimate.checkedUpTo,
			oldSelectionPosition === 0 ? 10000 : oldSelectionPosition,
			newSelectionPosition
		);

		this.checkAnimate.checkedUpTo = checkedPosToSet;

		this.setState({ text: text });
	}

	render() {
		const {
			focused,
			setFocused,
			selection,
			setSelection,
			showingAnswer,
			toggleAnswer,
			showingUI,
		} = this.props;

		return (
			<div>
				{ClueDiv(this.props.clue, this.props.correctCount)}

				<TextArea
					checkUpTo={this.state.checkedUpTo}
					text={this.state.text}
					charType={(char, pos) =>
						this.props.answer[pos] === char ? "green" : "red"
					}
					focused={focused}
					selection={selection}
				/>

				{showingUI && ControlDiv(this.checkAnimate, toggleAnswer)}

				{AnswerReveal(this.props.answer, showingAnswer)}

				<div className="navigationDiv">
					{showingUI && this.props.navigationDiv()}
				</div>

				<p className="bigGap" />

				<HiddenTextarea
					text={this.state.text}
					onChange={this.props.answer && this.onHiddenTextChange}
					onKeyDown={this.shortcut}
					updateSelection={setSelection}
					onChangeFocus={setFocused}
				/>
			</div>
		);
	}
}

function lengthCorrect(text, answer) {
	let correctLength = 0;
	for (let i = 0; i < text.length; i++) {
		if (text[i] !== answer[i]) {
			break;
		} else {
			correctLength = i + 1;
		}
	}
	return correctLength;
}

export const Buttons = (buttonsDescriptor, className) => {
	const buttons = buttonsDescriptor.map((button, index) => (
		<TasButton {...button} key={index} />
	));
	return className ? <div className={className}>{buttons}</div> : buttons;
};

const ControlDiv = (checkAnimate, toggleAnswer) =>
	Buttons(
		[
			{
				text: "Check ⏎",
				onClick: checkAnimate && checkAnimate.start,
			},
			{ text: "Reveal [", onClick: toggleAnswer },
		],
		"controlDiv"
	);

const ClueDiv = (clue, correctCount) => (
	<div className="clueDiv">
		<span className="clue">{clue}</span>

		{CorrectCountText(correctCount)}
	</div>
);

const CorrectCountText = correctCount => (
	<span className="countText" style={{ whiteSpace: "pre-wrap" }}>
		{" " + correctCount + " "}
	</span>
);

const AnswerReveal = (verse, showingAnswer) => (
	<div className="AnswerReveal">
		<p>{showingAnswer && verse}</p>
	</div>
);

export default TypeArea;
