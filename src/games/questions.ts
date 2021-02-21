export interface Game {
  // All groups start collapsed
  // each group and sub-group can be played with any game mode?
  //   nah you need to select the default game for the group
  //   and then you can play a different mode from another mix and match screen

  // Could sometimes just be a definition of the range?
  // Then group together (name then needs to be added)
  // So only leafs define the verses
  // And branches can be named

  // All must be playable
  // except when it's just a verse e.g. in a set of random ones
  // no surely the randomers shouldn't be tied to a certain mode
  //    how about we define verse groups separately from the 'workout' creation page?

  // How about 20 random verses but done in order? Then you go through the whole of the book but speedier!
  // Getting all the verses loaded in would be great - then can dip into another book and just study by remembering
  name?: string;
  refRange: string;
}

// Be able to do a context switch and continue from the old state? e.g. click on word to find all of that word in the bits youve learnt

// const games = [
//   {
//     questionIndex: 0,
//     type: "recall",
//     order: "random",
//     setIndexesLeft: [],
//     inOrderCount: 2,
//     inOrderDone: 0,
//   },
// ];

interface Question {
  id: string;
  clue: string;
  answer: string;
  reversible?: boolean;
  // Can add stats for each question
}

interface QueueSection {
  id: string;
  bank: Question[];
  startIndex: number;
  endIndex: number;
}

interface BaseExercise {
  id: string;
}
interface MatchTextExercise extends BaseExercise {
  type: "matchText";
}

type Exercise = MatchTextExercise;
