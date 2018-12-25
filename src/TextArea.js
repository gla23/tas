import React, { Component } from "react";

class TextArea extends Component {
	constructor(props) {
		super(props);
		this.state = {
			cursorOn: true
		};
		this.cursorFlashInterval = setInterval(
			() => this.setState({ cursorOn: !this.state.cursorOn }),
			600
		);
	}
	componentWillUnmount() {
		clearInterval(this.cursorFlashInterval);
	}

	render() {
		const { text, checkLength } = this.props;

		let setOfSpans = [];
		for (let i = 0; i < text.length + 1; i++) {
			let char = text[i] || " ";
			let marked =
				i >= this.props.selection[0] && i < this.props.selection[1];
			let classNames = "char ";

			if (i < checkLength && i !== text.length) {
				classNames += this.props.charCorrect(char, i)
					? "charSuccess "
					: "charDanger ";
			}

			// Cursor
			// Need to make it display on the right side if you've just moved into it on the right like in the other one...
			classNames +=
				this.state.cursorOn &&
				((this.props.selection[0] === this.props.selection[1] &&
					this.props.selection[1] === i) ||
					(this.props.selection[1] === i &&
						this.props.selection[2] === "forward") ||
					(this.props.selection[0] === i &&
						this.props.selection[2] === "backward"))
					? "cursor "
					: "";
			
			setOfSpans.push(
				<span className={classNames} key={i}>
					{marked ? <mark>{char}</mark> : char}
				</span>
			);
		}

		return (
			<p className="TextArea" onClick={this.props.onClick}>
				{setOfSpans}
			</p>
		);
	}
}

export default TextArea;
