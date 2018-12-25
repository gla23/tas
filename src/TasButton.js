import React from "react";
import Button from "@material-ui/core/Button";
export default function(props) {
	return (
		<Button
			variant="outlined"
			color="primary"
			onClick={props.onClick}
			style={{marginRight: "10px"}}
		>
			{props.text}
			{props.children}
		</Button>
	)
};