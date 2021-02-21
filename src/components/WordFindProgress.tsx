import { useSelector } from "react-redux";
import { selectGameType } from "../ducks/gameSelectors";
import { selectFoundRefs, selectRefOccurencesToFind } from "../games/FindGame";

export const WordFindProgress = () => {
  const found = useSelector(selectFoundRefs);
  const toFind = useSelector(selectRefOccurencesToFind);
  const game = useSelector(selectGameType);
  if (game !== "find" || toFind.length === 0) return null;
  return (
    <>
      {found.length}/{toFind.length}
    </>
  );
};
