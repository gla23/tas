export const loadVerses = fetch("/tas/memory.txt")
	.then((response) => response.text())
	.then((text) =>
		text
			.split("\n")
			.map((verse, index, array) =>
				index % 2 === 0 ? { verse, text: array[index + 1] } : null
			)
			.filter((a) => a)
	);
