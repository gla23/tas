import { parse } from "./verseCode";

test("get NT book", () => {
	const { history } = parse("a");
	const book = history[0];
	expect(book.index).toBe(1);
	expect(book.testament).toBe("n");
});

test("get OT book", () => {
	const { history } = parse("gen");
	const book = history[0];
	expect(book.index).toBe(1);
	expect(book.testament).toBe("o");
});
