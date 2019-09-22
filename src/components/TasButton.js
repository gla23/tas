import React from "react";
import Button from "@material-ui/core/Button";

export default props => (
	<Button
		variant="outlined"
		color="primary"
		onClick={props.onClick}
		style={{ marginRight: "10px" }}
	>
		{props.text}
		{props.children}
	</Button>
);
