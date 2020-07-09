import "./App.css";

import { withStyles } from "@material-ui/core/styles";
import React from "react";

import New from "../pages/New";
import logo from "./tasLogo.png";
import useLocalStorage from "../hooks/useLocalStorage";

const styles = (theme) => ({
	root: {
		backgroundColor: theme.palette.background.paper,
		// width: 500,
	},
});

const AppHeader = (props) => {
	const [, setParsing] = useLocalStorage("parsingVerses", true);
	return (
		<header className="App-header">
			<h3>Type and see</h3>
			<img
				src={logo}
				alt={"tasLogo"}
				style={{ width: "100px", marginLeft: "30px", marginTop: "-10px" }}
				onClick={() => setParsing((old) => !old)}
			/>
			<p />
		</header>
	);
};

const focusTextArea = () => {
	let textarea = document.getElementById("textarea");
	textarea && textarea.focus();
};

const App = (props) => {
	document.title = "Type and see";
	return (
		<div className="App" onClick={focusTextArea}>
			<AppHeader />
			<New />
		</div>
	);
};

export default withStyles(styles)(App);
