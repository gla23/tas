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

const styles = theme => ({
	root: {
		backgroundColor: theme.palette.background.paper,
		// width: 500,
	},
});

const appHeader = () => (
	<header className="App-header">
		<h3>Type and see</h3>
		<img
			src={logo}
			alt={"tasLogo"}
			style={{ width: "100px", marginLeft: "30px", marginTop: "-10px" }}
		/>
		<p />
	</header>
);

const focusTextArea = () => {
	let textarea = document.getElementById("textarea");
	textarea && textarea.focus();
};

const App = props => {
	document.title = "Type and see";
	const [currentTab, setCurrentTab] = useLocalStorage("tabId", 0);

	return (
		<div className="App" onClick={focusTextArea}>
			{appHeader()}

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
						<Tab label="OT books" />
						<Tab label="Major System" />
						<Tab label="Search" />
					</Tabs>
				</AppBar>
			)}

			<div className="maxWidthFloat">
				<div className="AppSection">
					{currentTab === 0 && <Tas />}
					{currentTab === 1 && <MemOTBooks />}
					{currentTab === 2 && (
						<>
							<MajorSystem />
						</>
					)}
					{currentTab === 3 && (
						<>
							<BibleSearch text="" />
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default withStyles(styles)(App);
