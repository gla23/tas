import {
  verb as rootVerb,
  noun as rootNoun,
  adjective as rootAdjective,
} from "wink-lemmatizer";

// const lemmas = qs?.map((question) =>
//   question.answer.replaceAll(/\w+/g, rootWord)
// );

export function rootWord(string: string) {
  const word = string.toLocaleLowerCase();
  const verb = rootVerb(word);
  if (verb !== word) return verb;
  const noun = rootNoun(word);
  if (noun !== word) return noun;
  const adjective = rootAdjective(word);
  if (adjective !== word) return adjective;
  return word;
}
