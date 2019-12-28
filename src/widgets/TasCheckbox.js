import React from "react";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

export default props => (
	<FormControlLabel
		control={
			<Checkbox
				// variant="outlined"
				checked={props.checked}
				color="primary"
				onChange={(event, value) => props.onChange(value)}
				style={{ marginRight: "-5px" }}
			>
				{props.children}
			</Checkbox>
		}
		label={props.label}
	/>
);
