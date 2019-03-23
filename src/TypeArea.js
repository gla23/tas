import React, { Component } from "react";
import TasButton from "./components/TasButton";
import TextArea from "./TextArea";
import HiddenTextarea from "./components/HiddenTextarea";
import CheckAnimate from "./CheckAnimate";

const freshClueData = {
	selection: [0, 0, "none"],
	checkUpTo: 0,
	checking: false,
	correctLength: 0,
};
function updateSelection(event) {
	let start = event.target.selectionStart;
	let end = event.target.selectionEnd;
	let direction = event.target.selectionDirection;
	this.setState({ selection: [start, end, direction] });
}

const freshCountData = {
	text: "",
	answerShowing: false,
};

class TypeArea extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showingCursor: false,
			text: " ",
			showingUI: true,
			...freshClueData,
			...freshCountData,
		};
		this.updateSelection = updateSelection.bind(this);
		let setShowingCursor = function(value) {
			this.setState({ showingCursor: value });
		};
		this.setShowingCursor = setShowingCursor.bind(this);
		this.onHiddenTextChange = this.onHiddenTextChange.bind(this);
		this.setNewCheckAnimate();

		this.focusTextArea = this.focusTextArea.bind(this);
		this.shortcut = this.shortcut.bind(this);
		this.toggleAnswerReveal = this.toggleAnswerReveal.bind(this);
		this.toggleUI = this.toggleUI.bind(this);
	}
	updateCheckedUpTo(val) {
		this.setState({ checkedUpTo: val });
	}
	ifCorrectComplete() {
		console.log("completing");
		this.state.text === this.props.answer &&
			setTimeout(this.props.onComplete, 100);
	}

	setNewCheckAnimate = () => {
		if (this.props.answer) {
			this.checkAnimate = new CheckAnimate(
				this.props.answer.length,
				this.updateCheckedUpTo.bind(this),
				this.ifCorrectComplete.bind(this)
			);
		}
	};
	shortcut(event) {
		if (event.key === "Enter") {
			event.preventDefault();
			this.checkAnimate.start();
		}
		if (event.key === "[") {
			event.preventDefault();
			this.toggleAnswerReveal();
		}
		if (event.key === "#" || event.key === "Escape") {
			event.preventDefault();
			this.toggleUI();
		}
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

	focusTextArea() {
		// this.textareaRef.current.focus({ preventScroll: true });
	}
	toggleAnswerReveal() {
		this.setState({ answerShowing: !this.state.answerShowing });
	}
	toggleUI() {
		this.setState({ showingUI: !this.state.showingUI });
	}

	refreshState(keepText = false) {
		if (keepText) {
			this.setState(freshClueData);
		} else {
			this.setState({ ...freshClueData, ...freshCountData });
		}
	}
	componentDidUpdate(prevProps, prevState) {
		if (prevProps.correctCount !== this.props.correctCount) {
			this.setState({ ...freshClueData, ...freshCountData });
		} else {
			if (prevProps.clue !== this.props.clue) {
				this.setNewCheckAnimate();
				this.setState(freshClueData);
				this.checkAnimate.checkUpTo = 0;
				if (this.checkAnimate.checkUpTo > 0) {
					this.checkAnimate.start();
				} else {
				}
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
		let text = event.target.value;
		let answer = this.props.answer;
		if (!answer) {
			return;
		}

		text === answer && this.checkAnimate.start();
		let correctPosition = lengthCorrect(text, answer);
		let oldSelectionPosition = this.state.selection[0];
		this.setState({ text: text }, function() {
			let newSelectionPosition = this.state.selection[0];
			let checkedPosToSet = Math.min(
				this.checkAnimate.checkedUpTo,
				oldSelectionPosition === 0 ? 10000 : oldSelectionPosition,
				newSelectionPosition
			);
			// console.log(
			// 	oldSelectionPosition,
			// 	newSelectionPosition,
			// 	checkedPosToSet,
			// 	this.checkAnimate.checkedUpTo
			// );
			this.checkAnimate.checkedUpTo = checkedPosToSet;
		});
	}

	render() {
		return (
			<div onClick={this.focusTextArea}>
				<div className="preNavigation">
					{ClueDiv(this.props.clue, this.props.correctCount)}

					<TextArea
						checkUpTo={this.state.checkedUpTo}
						text={this.state.text}
						charCorrect={(char, pos) => this.props.answer[pos] === char}
						showingCursor={this.state.showingCursor}
						selection={this.state.selection}
					/>

					{this.props.showControlDiv &&
						this.state.showingUI &&
						Buttons("controlDiv", [
							{
								text: "Check ⏎",
								onClick: this.checkAnimate && this.checkAnimate.start,
							},
							{ text: "Reveal [", onClick: this.toggleAnswerReveal },
						])}

					{AnswerReveal(this.props.anwer, this.state.answerShowing)}
				</div>

				<div className="navigationDiv">
					{this.props.showNavigationDiv &&
						this.state.showingUI &&
						this.props.navigationDiv()}
				</div>

				<p className="bigGap" />

				<HiddenTextarea
					text={this.state.text}
					onChange={this.onHiddenTextChange}
					onKeyDown={this.shortcut}
					updateSelection={this.updateSelection}
					onChangeFocus={this.setShowingCursor}
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

const Buttons = (className, buttons) => (
	<div className={className}>
		{buttons.map((button, index) => (
			<TasButton {...button} key={index} />
		))}
	</div>
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

const AnswerReveal = (verse, answerShowing) => (
	<div className="AnswerReveal">
		<p>{answerShowing && verse}</p>
	</div>
);

export default TypeArea;
