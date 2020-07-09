// FSA makes a transition on an input
enum StateType {
	start = "start",
	book = "book",
	chapter = "chapter",
	verse = "verse",
}

enum InputType {
	book = "book",
	chapter = "chapter",
	verse = "verse",
	hyphen = "hyphen",
	whitespace = "whitespace",
}

const stateTransitions = {
	start: {
		whitespace: "start",
		book: "book",
	},
	book: {
		whitespace: "book",
		chapter: "chapter",
	},
	chapter: {
		whitespace: "chapter",
		verse: "verse",
	},
};

type Input = {
	type: InputType;
	string: string;
};
type State = {
	history: Input[];
	type: StateType;
};

const initialState = {
	history: [],
	state: StateType.start,
	position: 0,
};

// export const parse = (code: string) => {
// 	const nextInput = (state: State) => {
// 		const { type } = state;
// 		const transitions = stateTransitions[type];
// 		const availableTypes = Object.keys(transitions);

// 		// const;
// 	};
// };
