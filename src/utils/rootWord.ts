import {
  verb as rootVerb,
  noun as rootNoun,
  adjective as rootAdjective,
} from "wink-lemmatizer";

const fixes: { [word: string]: string } = {
  pass: "pass",
  james: "james",
  prayer: "pray",
  lampstands: "lampstand",
};

// Adverbs?
// sternly -> stern?

// Nouns?
// prayer -> pray?
// harvester -> harvest?

export function rootWord(string: string) {
  const word = string.toLocaleLowerCase();
  if (fixes[word]) return fixes[word];
  const verb = rootVerb(word);
  if (verb !== word) return verb;
  const noun = rootNoun(word);
  if (noun !== word) return noun;
  const adjective = rootAdjective(word);
  if (adjective !== word) return adjective;
  return word;
}
