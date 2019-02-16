import React from "react";


export default props => (
	<textarea
		id="textarea"
		value={props.text}
		onChange={props.onChange}

		onSelect={props.updateSelection}
		onKeyPress={props.updateSelection}
		onKeyUp={props.updateSelection}
		onInput={props.updateSelection}

		onKeyDown={props.onKeyDown}
		spellCheck={false}
		onFocus={() => props.onChangeFocus(true)}
		onBlur={() => props.onChangeFocus(false)}
		
		autoFocus={true}
		placeholder={""}
	/>
);
