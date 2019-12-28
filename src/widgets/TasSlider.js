import React from "react";
import { Slider } from "@material-ui/core";

export default props => {
	const width = props.width || "600px";
	return (
		<Slider
			min={props.min}
			max={props.max}
			value={props.value}
			valueLabelDisplay={props.valueLabelDisplay}
			valueLabelFormat={props.valueLabelFormat}
			onChange={(event, value) => props.onChange(value)}
			style={{ width }}
		/>
	);
};
