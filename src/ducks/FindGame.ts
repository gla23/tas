type ID = string;

export interface FindGame {
  type: "find";
  found: ID[];
}
