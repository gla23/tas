import React from "react";

class AnswerReveal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			size: props.verseShowing
		};
	}
	render() {
		return (
			<div className="AnswerReveal">
				<p>{this.props.answerShowing && this.props.verse}</p>	
			</div>
		)
	}
}

export default AnswerReveal;