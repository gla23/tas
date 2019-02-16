import React, { Component } from "react";
import TextArea from "./TextArea";

export default class BibleSearch extends Component {
	constructor(props) {
		super(props);
		this.state = { text: "" };
		this.onTextChange = this.onTextChange.bind(this);
	}

	onTextChange(event) {
		let text = event.target.value;
		this.setState({ text: text });
	}

	render() {
		return (
			<div>
				<p />
				<textarea
					autoFocus
					onChange={this.onTextChange}
					id="textareaBibleSearch"
					rows={1}
				/>

				<TextArea
					text={this.state.text}
					charCorrect={(char, pos) => true}
					showingCursor={false}
					selection={[0, 0]}
					checkLength={this.state.text.length} // this.state.checkedLength
					wrap={"off"}
				/>
			</div>
		);
	}
}
