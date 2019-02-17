import React, { Component } from "react";

const checkBaseTime = 35;
const checkTreacle = 3;
const checkIncrementJump = 2;
const jumpMinimumTime = 1;

class CheckAnimate extends Component {
	constructor(props) {
		super(props);

		this.state = {
			checkedUpTo: props.checkUpTo,
			checkIncrementTime: checkBaseTime,
		};

		this.incrementCheckLength = this.incrementCheckLength.bind(this);
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.checkUpTo < prevProps.checkUpTo) {
			this.setState({
				checkedUpTo: this.props.checkUpTo,
				checkIncrementTime: checkBaseTime,
			});
		}
		if (!prevProps.checking && this.props.checking) {
			console.log("checking now");
			this.incrementCheckLength();
		}
	}

	incrementCheckLength() {
		let startingCheckLength = this.state.checkedUpTo;
		let checkUpTo = this.props.checkUpTo;
		let end = this.props.end;
		let charsToJump = Math.min(Math.ceil((1 + (checkUpTo + end)) / 60), 6);
		let newCheckLength = this.state.checkedUpTo + charsToJump;

		console.log(this.state);

		if (startingCheckLength < checkUpTo) {
			if (newCheckLength > checkUpTo) {
				newCheckLength = checkUpTo;
				// console.log("switching to slowing down");
			}
			let timeToNextJump = this.state.checkIncrementTime - checkIncrementJump;
			this.setState({
				checkedUpTo: newCheckLength,
				checkIncrementTime: timeToNextJump,
			});
			setTimeout(
				this.incrementCheckLength,
				Math.max(timeToNextJump, jumpMinimumTime)
			);
		} else {
			// At the end or slowing down
			if (this.state.checkedUpTo === end) {
				this.props.onReachEnd();
			}

			let oldIncrementTime = this.state.checkIncrementTime;
			let newIncrementTime =
				this.state.checkIncrementTime + checkIncrementJump * checkTreacle;

			if (oldIncrementTime > checkBaseTime + checkIncrementJump + 1) {
				return;
			}

			this.setState({
				checkedUpTo: this.state.checkedUpTo + 1,
				checkIncrementTime: newIncrementTime,
			});
			setTimeout(
				this.incrementCheckLength,
				Math.max(newIncrementTime * 5, jumpMinimumTime)
			);
		}
	}

	render() {
		return (
			<div>
				{React.cloneElement(this.props.children, {
					checkUpTo: this.state.checkedUpTo,
				})}
			</div>
		);
	}
}

export default CheckAnimate;
