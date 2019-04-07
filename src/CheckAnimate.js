const baseTime = 35;
const checkTreacle = 3;
const timeIncrease = 2;
const jumpMinimumTime = 1;

class CheckAnimate {
	constructor(answerSize, update, onReachEnd) {
		this.end = answerSize;
		this.incrementTime = baseTime;
		this.onReachEnd = onReachEnd;
		this.start = this.start.bind(this);
		this.increment = this.increment.bind(this);
		this.update = update;
		this.checkedUpTo = 0;
	}

	get checkedUpTo() {
		return this._checkedUpTo;
	}
	set checkedUpTo(val) {
		this.update(val);
		this._checkedUpTo = val;
	}

	start() {
		this.incrementTimer = setTimeout(
			() => this.increment(),
			this.incrementTime
		);
	}
	stop() {
		this.incrementTimer && clearTimeout(this.incrementTimer);
	}

	increment() {
		let { checkUpTo, end, incrementTime } = this;
		let checkStart = this.checkedUpTo;
		let charsToJump = Math.ceil((59 + checkUpTo * 4 + end) / 60);
		charsToJump = Math.min(charsToJump, 6);
		let checkNew = checkStart + charsToJump;

		if (checkStart < checkUpTo) {
			if (checkNew > checkUpTo) {
				checkNew = checkUpTo;
				// console.log("switching to slowing down");
			}
			this.incrementTime -= timeIncrease;
			this.checkedUpTo = checkNew;
			this.incrementTimer = setTimeout(
				this.increment,
				Math.max(incrementTime, jumpMinimumTime)
			);
		} else {
			// At the end or slowing down
			console.log("checkStart", checkStart, "end", end);
			if (checkStart === end) {
				this.onReachEnd
					? this.onReachEnd()
					: console.log("no onReachEnd function");
			}

			let oldIncrementTime = this.incrementTime;
			let newIncrementTime = oldIncrementTime + timeIncrease * checkTreacle;

			if (oldIncrementTime > baseTime + timeIncrease + 1) {
				// this.incrementTime = baseTime;
				return;
			}

			this.checkedUpTo += 1;
			this.incrementTime = newIncrementTime;
			this.incrementTimer = setTimeout(
				this.increment,
				Math.max(newIncrementTime * 5, jumpMinimumTime)
			);
		}
		this.update(this.checkedUpTo);
	}
}

export default CheckAnimate;
