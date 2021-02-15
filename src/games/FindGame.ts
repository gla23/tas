type ID = string;

export interface FindGame {
  type: "find";
  found: ID[];
}

// Object.entries(occurencesByRoot(bank))
//   .filter(
//     ([root, occurences]) => occurences.length > 1 && occurences.length < 5
//   )
//   .forEach(([root, occurences]) => console.log(root, occurences));
