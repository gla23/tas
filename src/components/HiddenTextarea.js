import React from "react";

export default props => {
	const nothing = () => "why";

	const selectionArrayFromEvent = event => [
		event.target.selectionStart,
		event.target.selectionEnd,
		event.target.selectionDirection,
	];

	const updateSelection = event =>
		props.updateSelection
			? props.updateSelection(selectionArrayFromEvent(event))
			: nothing;

	return (
		<textarea
			id="textarea"
			value={props.text}
			onChange={props.onChange || nothing}
			onSelect={updateSelection}
			onKeyPress={updateSelection}
			onKeyUp={updateSelection}
			onInput={updateSelection}
			onKeyDown={props.onKeyDown}
			spellCheck={false}
			onFocus={props.onChangeFocus ? () => props.onChangeFocus(true) : nothing}
			onBlur={props.onChangeFocus ? () => props.onChangeFocus(false) : nothing}
			autoFocus={true}
			placeholder={""}
		/>
	);
};
