import {
  verb as rootVerb,
  noun as rootNoun,
  adjective as rootAdjective,
} from "wink-lemmatizer";

const fixes: { [word: string]: string } = {
  pass: "pass",
  james: "james",
};

// Adverbs?
// sternly -> stern?

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
