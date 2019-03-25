import React, { useState, useEffect } from "react";

const TextArea = props => {
	const [cursorOn, setCursorOn] = useState(true);
	useEffect(() => {
		let cursorFlashInterval = setInterval(() => setCursorOn(!cursorOn), 600);
		return () => clearInterval(cursorFlashInterval);
	});

	const { text, checkUpTo, selection } = props;
	let charType;
	let setOfSpans = [];

	for (let i = 0; i < text.length + 1; i++) {
		let char = text[i] || " ";
		let marked = i >= selection[0] && i < selection[1];
		let classNames = "char ";

		if (i < checkUpTo && i !== text.length && props.charType) {
			charType = props.charType(char, i);
			charType &&
				(classNames +=
					"char" + charType[0].toUpperCase() + charType.slice(1) + " ");
		}

		// Cursor
		// Need to make it display on the right side if you've just moved into it on the right like in the other one...
		cursorOn &&
			props.showingCursor &&
			(classNames +=
				(selection[0] === selection[1] && selection[1] === i) ||
				(selection[1] === i && selection[2] === "forward") ||
				(selection[0] === i && selection[2] === "backward")
					? "cursor "
					: "");

		setOfSpans.push(
			<span className={classNames} key={i}>
				{marked ? <mark>{char}</mark> : char}
			</span>
		);
	}

	return (
		<p className="TextArea" onClick={props.onClick}>
			{setOfSpans}
		</p>
	);
};

export default TextArea;
