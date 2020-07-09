import { AppBar, Tab, Tabs } from "@material-ui/core";
import React from "react";

import BibleSearch from "./BibleSearch";
import Factors from "./Factors";
import MajorSystem from "./MajorSystem";
import MemLetters from "./MemLetters";
import MemNTBooks from "./MemNTBooks";
import MemOTBooks from "./MemOTBooks";
import Tas from "./Tas";
import useLocalStorage from "../hooks/useLocalStorage";

const TasTabs = (props) => {
	document.title = "Type and see";
	const [currentTab, setCurrentTab] = useLocalStorage("tabId", 0);

	return (
		<>
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
					<Tab label="Search" />
					<Tab label="Factors" />
				</Tabs>
			</AppBar>

			<div className="maxWidthFloat">
				<div className="AppSection">
					{currentTab === 0 && <Tas />}
					{currentTab === 1 && <MemLetters />}
					{currentTab === 2 && <MemOTBooks />}
					{currentTab === 3 && <MemNTBooks />}
					{currentTab === 4 && <MajorSystem />}
					{currentTab === 5 && <BibleSearch text="" />}
					{currentTab === 6 && <Factors />}
				</div>
			</div>
		</>
	);
};

export { TasTabs };
