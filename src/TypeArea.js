import React, { Component } from "react";
import TasButton from "./components/TasButton";
import TextArea from "./TextArea";
import AnswerReveal from "./AnswerReveal";
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

		this.getCorrectLength = this.getCorrectLength.bind(this);
		this.focusTextArea = this.focusTextArea.bind(this);
		this.shortcut = this.shortcut.bind(this);
		this.toggleAnswerReveal = this.toggleAnswerReveal.bind(this);
		this.toggleUI = this.toggleUI.bind(this);
	}

	shortcut(event) {
		if (event.key === "Enter") {
			event.preventDefault();
			this.setState({ checking: true });
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
				if (prevState.checkUpTo > 0) {
					this.setState({ ...freshClueData, checking: true });
				} else {
					this.setState(freshClueData);
				}
			}
		}
	}

	onHiddenTextChange(event) {
		let text = event.target.value;
		let answer = this.props.answer;
		if (!answer) {
			return;
		}
		this.setState({ checking: text === answer });
		let correctPosition = this.getCorrectLength(text, answer);
		let oldSelectionPosition = this.state.selection[0];
		this.setState({ text: text }, function() {
			let newSelectionPosition = this.state.selection[0];
			let checkedPosToSet = Math.min(
				this.state.checkUpTo,
				oldSelectionPosition === 0 ? 10000 : oldSelectionPosition,
				newSelectionPosition
			);
			console.log(
				oldSelectionPosition,
				newSelectionPosition,
				checkedPosToSet,
				this.state.checkUpTo
			);
			this.setState({
				checkUpTo: checkedPosToSet,
			});
		});
	}
	getCorrectLength(text = this.state.text, answer = this.props.answer) {
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

	render() {
		const navigationDiv = this.props.navigationDiv();
		return (
			<div onClick={this.focusTextArea}>
				<div className="preNavigation">
					<div className="clueDiv">
						<span className="clue">{this.props.clue}</span>

						{this.correctCountText()}
					</div>

					<CheckAnimate
						checkUpTo={this.getCorrectLength()}
						checking={this.state.checking}
						end={this.state.text.length}
						onReachEnd={() =>
							this.state.text === this.props.answer &&
							setTimeout(this.props.onComplete, 100)
						}
					>
						<TextArea
							text={this.state.text}
							charCorrect={(char, pos) => this.props.answer[pos] === char}
							showingCursor={this.state.showingCursor}
							selection={this.state.selection}
						/>
					</CheckAnimate>

					<div className="controlDiv">
						{this.props.showControlDiv && this.state.showingUI && (
							<div>
								<TasButton
									text="Check ⏎"
									onClick={() => this.setState({ checking: true })}
								/>
								<TasButton text="Reveal [" onClick={this.toggleAnswerReveal} />
							</div>
						)}
					</div>
					<div className="secondSection">
						<AnswerReveal
							verse={this.props.answer}
							answerShowing={this.state.answerShowing}
						/>
					</div>
				</div>

				<div className="navigationDiv">
					{this.props.showNavigationDiv && this.state.showingUI && (
						<span>
							{navigationDiv}
							{navigationDiv || (
								<TasButton
									text="Hide UI (Esc)"
									onClick={() =>
										this.setState({
											showingUI: !this.state.showingUI,
										})
									}
								/>
							)}
						</span>
					)}
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
	correctCountText() {
		return (
			<span className="countText" style={{ whiteSpace: "pre-wrap" }}>
				{" " + this.props.correctCount + " "}
			</span>
		);
	}
}

export default TypeArea;
