import React from "react";
import "./App.css";
import { withStyles } from "@material-ui/core/styles";
import logo from "./tasLogo.png";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import useLocalStorage from "../hooks/useLocalStorage";

import Tas from "../pages/Tas";
import BibleSearch from "../pages/BibleSearch";
import MajorSystem from "../pages/MajorSystem";
import MemOTBooks from "../pages/MemOTBooks";
import MemNTBooks from "../pages/MemNTBooks";
import MemLetters from "../pages/MemLetters";
import Factors from "../pages/Factors";
import Mod from "../pages/Mod";

const styles = (theme) => ({
	root: {
		backgroundColor: theme.palette.background.paper,
		// width: 500,
	},
});

const AppHeader = (props) => {
	const [parsing, setParsing] = useLocalStorage("parsingVerses", true);
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
	const [currentTab, setCurrentTab] = useLocalStorage("tabId", 0);

	return (
		<div className="App" onClick={focusTextArea}>
			<AppHeader />

			{true && (
				<AppBar position="static" className={props.classes.root}>
					<Tabs
						value={currentTab}
						onChange={(event, value) => setCurrentTab(value)}
						indicatorColor="primary"
						textColor="primary"
						centered
						// theme="dark" hmm supposed to be object
					>
						<Tab label="Tas" />
						<Tab label="Letters" />
						<Tab label="OT books" />
						<Tab label="NT books" />
						<Tab label="Major System" />
						<Tab label="Factors" />
						<Tab label="Mod" />
						<Tab label="Search" />
					</Tabs>
				</AppBar>
			)}

			<div className="maxWidthFloat">
				<div className="AppSection">
					{currentTab === 0 && <Tas />}
					{currentTab === 1 && <MemLetters />}
					{currentTab === 2 && <MemOTBooks />}
					{currentTab === 3 && <MemNTBooks />}
					{currentTab === 4 && <MajorSystem />}
					{currentTab === 5 && <Factors />}
					{currentTab === 6 && <Mod />}
					{currentTab === 7 && <BibleSearch text="" />}
				</div>
			</div>
		</div>
	);
};

export default withStyles(styles)(App);
