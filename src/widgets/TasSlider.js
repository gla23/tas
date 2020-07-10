import React, { useEffect } from "react";
import { Slider } from "@material-ui/core";
import { clamp } from "../hooks/useQuestions";

export default (props) => {
	const {
		width = "600px",
		value,
		marks = [],
		markSelected,
		valueLabelFormat = (v) => v,
		min,
		max,
		track,
	} = props;

	const showLabel = markSelected ? "off" : props.valueLabelDisplay ?? "auto";
	const valueArray = Array.isArray(props.value) ? value : [value];
	const myMarks = marks.slice();

	if (markSelected)
		valueArray.forEach((value) => {
			const alreadyThere = myMarks.some((mark) => mark.value === value);
			if (!alreadyThere)
				myMarks.push({
					value,
					label: valueLabelFormat(value),
				});
		});

	useEffect(() => {
		if (Array.isArray(value)) {
			if (value.some((value) => value > max || value < min))
				props.onChange(value.map((v) => clamp(v, min, max)));
		} else {
			if (value < min) props.onChange(min);
			if (value > max) props.onChange(max);
		}
	});

	return (
		<Slider
			min={min}
			max={max}
			value={value}
			valueLabelFormat={valueLabelFormat}
			valueLabelDisplay={showLabel}
			track={track}
			marks={myMarks}
			onChange={(event, value) => props.onChange(value)}
			style={{ width }}
		/>
	);
};
