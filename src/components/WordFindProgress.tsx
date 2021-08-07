import { useSelector } from "react-redux";
import { selectGameType } from "../ducks/gameSelectors";
import { selectFoundRefs, selectRefOccurencesToFind } from "../games/FindGame";
import { MiniHint } from "./Hints";

export const WordFindProgress = () => {
  const found = useSelector(selectFoundRefs);
  const toFind = useSelector(selectRefOccurencesToFind);
  const game = useSelector(selectGameType);
  if (game !== "find" || toFind.length === 0) return null;
  if (toFind.length > 10)
    return (
      <>
        {found.length}/{toFind.length}
      </>
    );
  return <MiniHint />;
};
