import React from "react";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";

export default props => (
	<RadioGroup
		aria-label={props.name}
		name={props.name}
		value={props.value}
		onChange={(event, value) => props.onChange(value)}
		row
	>
		{props.options.map((option, index) => {
			return (
				<FormControlLabel
					key={index}
					value={option.value}
					control={<Radio color="primary" />}
					label={option.label}
				/>
			);
		})}
		{props.children}
	</RadioGroup>
);
