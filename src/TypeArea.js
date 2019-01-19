import React, { Component } from "react";
// import ReactDOM from "react-dom";
import TasButton from "./components/TasButton";
import TextArea from "./TextArea";
import AnswerReveal from "./AnswerReveal";

const checkBaseTime = 35;
const checkTreacle = 3;
const checkIncrementJump = 2;
const jumpMinimumTime = 1;

const freshClueData = {
	selection: [0, 0, "none"],
	checkedLength: 0,
	checkIncrementTime: checkBaseTime,
	correctLength: 0
};
const freshCountData = {
	text: "",
	answerShowing: false
};

class TypeArea extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showingCursor: false,
			text: " ",
			showingUI: true,
			...freshClueData,
			...freshCountData
		};
		this.textareaRef = React.createRef();
		this.onTextChange = this.onTextChange.bind(this);
		this.charCorrect = this.charCorrect.bind(this);
		this.handleInput = this.handleInput.bind(this);
		this.getCorrectLength = this.getCorrectLength.bind(this);
		this.startSearching = this.startSearching.bind(this);
		this.focusTextArea = this.focusTextArea.bind(this);
		this.incrementCheckedLength = this.incrementCheckedLength.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);
		this.toggleAnswerReveal = this.toggleAnswerReveal.bind(this);
		this.toggleUI = this.toggleUI.bind(this);
		// setTimeout(this.focusTextArea, 1000);
	}
	componentDidMount() {
		if (this.textareaRef.current) {
			// this.node = ReactDOM.findDOMNode(this.textareaRef.current);
			this.node = this.textareaRef.current;
			// Evergreen event listener || IE8 event listener
			const addEvent =
				this.node.addEventListener || this.node.attachEvent;
			addEvent("keypress", this.handleKeyPress, false);

			this.focusTextArea();
		}
	}
	componentWillUnmount() {
		const removeEvent =
			this.node.removeEventListener || this.node.detachEvent;
		// Reduce any memory leaks
		removeEvent("keypress", this.handleKeyPress);
	}
	handleKeyPress(event) {
		if (event.key === "Enter") {
			event.preventDefault();
			this.startSearching();
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
	incrementCheckedLength() {
		let correctLength = this.getCorrectLength();
		let startingCheckedLength = this.state.checkedLength;
		let charsToJump = Math.min(
			Math.ceil(
				(10 + (this.props.answer.length + correctLength) / 2) / 30
			),
			6
		);
		console.log(charsToJump);
		let newCheckedLength = Math.min(
			this.state.checkedLength + charsToJump,
			this.state.text.length
		);
		if (
			// /newCheckedLength === startingCheckedLength ||
			this.props.answer.length === 0 ||
			this.state.text.length === 0
		) {
			return;
		}

		// console.log(startingCheckedLength, correctLength, newCheckedLength, this.state.checkIncrementTime)

		if (startingCheckedLength < correctLength) {
			if (newCheckedLength > correctLength) {
				newCheckedLength = correctLength;
				console.log("switching to slowing down");
			}
			let timeToNextJump =
				this.state.checkIncrementTime - checkIncrementJump;
			this.setState({
				checkedLength: newCheckedLength,
				checkIncrementTime: timeToNextJump
			});
			setTimeout(
				this.incrementCheckedLength,
				Math.max(timeToNextJump, jumpMinimumTime)
			);
			// console.log(charsToJump, newCheckedLength);
			// console.log("timeToNextJump", timeToNextJump, newCheckedLength);
		} else {
			// At the end or slowing down
			if (this.state.text === this.props.answer) {
				setTimeout(this.props.onComplete, 100);
				return;
			}

			let oldIncrementTime = this.state.checkIncrementTime;
			let newIncrementTime =
				this.state.checkIncrementTime +
				checkIncrementJump * checkTreacle;

			if (oldIncrementTime > checkBaseTime + checkIncrementJump + 1) {
				return;
			}

			this.setState({
				checkedLength: this.state.checkedLength + 1,
				checkIncrementTime: newIncrementTime
			});
			setTimeout(
				this.incrementCheckedLength,
				Math.max(newIncrementTime * 5, jumpMinimumTime)
			);
		}
	}
	focusTextArea() {
		this.textareaRef.current.focus({ preventScroll: true });
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
				if (prevState.checkedLength > 0) {
					this.setState(freshClueData, () => this.startSearching());
				} else {
					this.setState(freshClueData);
				}
			}
		}
	}

	onTextChange(event) {
		let text = event.target.value;
		let answer = this.props.answer;
		let oldSelectionPosition = this.state.selection[0];
		if (!answer) {
			return;
		}
		let correctPosition = this.getCorrectLength(text, answer);

		this.setState({ text: text }, function() {
			if (text === answer) {
				this.startSearching();
			} else {
				let newSelectionPosition = this.state.selection[0];

				console.log(
					this.state.checkedLength,
					oldSelectionPosition,
					newSelectionPosition
				);
				let checkedPosToSet = Math.min(
					this.state.checkedLength,
					oldSelectionPosition === 0 ? 10000 : oldSelectionPosition,
					newSelectionPosition
				);
				this.setState(
					{
						checkedLength: checkedPosToSet
					},
					() => {
						if (this.state.checkedLength <= correctPosition) {
							this.setState({
								checkIncrementTime: checkBaseTime
							});
						}
					}
				);
			}
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

	handleInput(event) {
		let start = event.target.selectionStart;
		let end = event.target.selectionEnd;
		let direction = event.target.selectionDirection;
		this.setState({ selection: [start, end, direction] });
	}
	startSearching(event) {
		console.log("start Searching checked: ", this.state.checkedLength);
		this.incrementCheckedLength();
	}

	charCorrect(char, pos) {
		// console.log(this.state.text, pos, char);
		return;
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

					<TextArea
						text={this.state.text}
						onChange={this.onTextChange}
						charCorrect={(char, pos) =>
							this.props.answer[pos] === char
						}
						showingCursor={this.state.showingCursor}
						selection={this.state.selection}
						checkLength={this.state.checkedLength}
						textareaRef={this.textareaRef.current}
					/>
					<div className="controlDiv">
						{this.props.showControlDiv &&
							this.state.showingUI && (
								<div>
									<TasButton
										text="Check ⏎"
										onClick={this.startSearching}
									/>
									<TasButton
										text="Reveal ["
										onClick={this.toggleAnswerReveal}
									/>
								</div>
							)}
					</div>
					{this.AnswerReveal()}
				</div>

				<div className="navigationDiv">
					{this.props.showNavigationDiv &&
						this.state.showingUI && (
							<span>
								{navigationDiv}
								{navigationDiv || (
									<TasButton
										text="Hide UI (Esc)"
										onClick={() =>
											this.setState({
												showingUI: !this.state.showingUI
											})
										}
									/>)}
							</span>
						)
					}
				</div>
				<p className="bigGap" />

				<textarea
					id="textarea"
					ref={this.textareaRef}
					value={this.state.text}
					onChange={this.onTextChange}
					onSelect={this.handleInput}
					onKeyPress={this.handleInput}
					onKeyRelease={this.handleInput}
					onKeyDown={this.handleKeyPress}
					onInput={this.handleInput}
					spellCheck={false}
					onBlur={() => this.setState({showingCursor: false})}
					onFocus={() => this.setState({showingCursor: true})}
					autoFocus={true}
					placeholder={""}
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
	AnswerReveal() {
		return (
			<div className="secondSection">
				<AnswerReveal
					verse={this.props.answer}
					answerShowing={this.state.answerShowing}
				/>
			</div>
		);
	}
}

export default TypeArea;
