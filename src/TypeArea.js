import React, { Component } from "react";
// import ReactDOM from "react-dom";
import TasButton from "./TasButton";
import TextArea from "./TextArea";
import AnswerReveal from "./AnswerReveal";

const checkBaseTime = 30;
const checkTreacle = 7;
const freshData = {
	text: "",
	selection: [-1, -1, "none"],
	checkLength: 0,
	checkedLength: 0,
	checkIncrementTime: 10,
	correctLength: 0,
	answerShowing: false
};

class TypeArea extends Component {
	constructor(props) {
		super(props);
		this.state = {
			text: "Benny bob",
			showingUI: true,
			...freshData
		};
		console.log("constructing TypeArea");
		this.textareaRef = React.createRef();
		this.onTextChange = this.onTextChange.bind(this);
		this.charCorrect = this.charCorrect.bind(this);
		this.handleInput = this.handleInput.bind(this);
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
		console.log(event);
		if (event.key === "[" || event.key === "Enter") {
			event.preventDefault();
			this.startSearching();
		}
		if (event.key === "]") {
			event.preventDefault();
			this.toggleAnswerReveal();
		};
		if (event.key === "#") {
			event.preventDefault();
			this.toggleUI();
		};
		let shortcutFunction = this.props.shortcutMap.get(event.keyCode);

		if (shortcutFunction) {
			event.preventDefault();
			shortcutFunction(event.keyCode);
		} else {
			let allFunction = this.props.shortcutMap.get("*")
			if (allFunction) {
				allFunction(event.keyCode)
			}
		}
	}
	incrementCheckedLength() {
		let startingPos = this.state.checkedLength;
		let charsToJump = Math.ceil((1 + this.state.checkLength) / 50);
		let newPos = this.state.checkedLength + charsToJump;
		newPos = Math.min(newPos, this.state.text.length);
		if (startingPos < this.state.correctLength) {
			if (newPos > this.state.correctLength) {
				newPos = this.state.correctLength;
			}
			let timeToNextJump = checkBaseTime / (this.state.checkedLength * 4);
			this.setState({
				checkedLength: newPos,
				checkIncrementTime: timeToNextJump
			});
			setTimeout(this.incrementCheckedLength, timeToNextJump);
			// console.log(charsToJump, newPos);
			// console.log("timeToNextJump", timeToNextJump, newPos);
		} else {
			// At the end or slowing down
			if (this.state.text === this.props.answer) {
				setTimeout(() => {
					this.refreshState();
					this.props.onComplete();
				}, 100);
			} else {
				if (
					this.state.correctLength === startingPos &&
					this.state.text.length > 0
				) {
					// Always check 1 char
					this.setState({ checkedLength: startingPos + 1 });
					setTimeout(this.incrementCheckedLength, 10);
				}
				let newIncrementTime =
					this.state.checkIncrementTime * checkTreacle;
				// console.log(newIncrementTime);
				if (newIncrementTime > 800) {
					return;
				}
				this.setState({
					checkedLength: this.state.checkedLength + 1,
					checkIncrementTime: newIncrementTime
				});
				setTimeout(this.incrementCheckedLength, newIncrementTime);
			}
		}
	}
	focusTextArea() {
		this.textareaRef.current.focus({ preventScroll: true });
	}
	toggleAnswerReveal() {
		this.setState({ answerShowing: !this.state.answerShowing });
	}
	toggleUI() {
		this.setState({ showingUI: !this.state.showingUI});
	}
	refreshState() {
		this.setState(freshData)
	}
	onTextChange(event) {
		let text = event.target.value;
		let answer = this.props.answer;
		let oldSelectionPosition = this.state.selection[0];

		if (!answer) {
			return;
		}

		this.setState({ text: text }, function() {
			// Once text has been changed
			let correctLength = 0;
			for (let i = 0; i < text.length; i++) {
				if (text[i] !== answer[i]) {
					break;
				} else {
					correctLength = i + 1;
				}
			}

			if (text === answer) {
				this.setState({ correctLength: correctLength });
				this.startSearching();
			} else {
				let newSelectionPosition = this.state.selection[0];
				let selectionPosToSet = Math.min(
					this.state.checkedLength,
					oldSelectionPosition,
					newSelectionPosition
				);
				this.setState({
					checkedLength: selectionPosToSet,
					checkLength: selectionPosToSet,
					correctLength: correctLength
				});
			}
		});
	}

	handleInput(event) {
		let start = event.target.selectionStart;
		let end = event.target.selectionEnd;
		let direction = event.target.selectionDirection;
		this.setState({ selection: [start, end, direction] });
	}
	startSearching(event) {
		// console.log("setting check to: ", this.state.text.length)
		this.setState(
			{ checkLength: this.state.text.length },
			this.incrementCheckedLength
		);
	}

	charCorrect(char, pos) {
		// console.log(this.state.text, pos, char);
		return;
	}

	render() {
		const tasDivStyle = { marginLeft: "60", marginRight: "60" };
		return (
			<div
				className="Tas"
				style={tasDivStyle}
				onClick={this.focusTextArea}
			>
				<div className="AppSection">
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
							selection={this.state.selection}
							checkLength={this.state.checkedLength}
							textareaRef={this.textareaRef.current}
						/>
						<div className="controlDiv">
							{this.props.showControlDiv && this.state.showingUI && (
								<div>
									<TasButton
										text="Check ["
										onClick={this.startSearching}
									/>
									<TasButton
										text="Reveal ]"
										onClick={this.toggleAnswerReveal}
									/>
								</div>
							)}
						</div>
						{this.AnswerReveal()}
					</div>

					<div className="navigationDiv">
						{
							this.props.showNavigationDiv &&
							this.state.showingUI &&
							this.props.navigationDiv()
						}
					</div>
					<p className="bigGap" />

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
