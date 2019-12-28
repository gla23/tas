import { parseVerse } from "./verseCodeParsing";

test("adds 1 + 2 to equal 3", () => {
	expect(1 + 2).toBe(3);
});

test("Parsing", () => {
	expect(parseVerse("abc")).toBe("Matthew 2:3");
});

