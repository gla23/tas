import React from "react";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
export default function(props) {
	return (

		<FormControlLabel
          control={
            <Checkbox
            	// variant="outlined"
            	checked={props.checked}
            	color="primary"
            	onChange={props.onClick}
            	style={{marginRight: "-10px"}}
            >
            	{props.children}
            </Checkbox>
          }
          label={props.text}
        />
	)
};