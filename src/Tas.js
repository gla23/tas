import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

class Tas extends Component {

	beep() {
		alert('hi')
	}

	render() {
		return (
			<div>
				<p>Tas ~~</p>

				<Button variant="outlined" color="primary" onClick={this.beep}>
					Hello World
				</Button>
			</div>
		);
	}
}

export default Tas;
