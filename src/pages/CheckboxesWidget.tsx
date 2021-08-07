import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectOccurencesByRoot } from "../ducks/bank";
import { finishQuestion } from "../ducks/game";
import { chooseDecentWord, WordOccurence } from "../games/FindGame";
import { Occurrence } from "../utils/occurrences";

const generateOptions = (
  occurences: { [root: string]: Occurrence[] },
  exclude: string[] = []
) => {
  const options: WordOccurence[] = [];
  for (let i = 0; i < 10; i++) {
    const occurence = chooseDecentWord(occurences, exclude);
    options.push(occurence);
    exclude.push(occurence.root);
  }
  return options;
};

export const CheckboxesWidget = () => {
  const dispatch = useDispatch();
  const occurences = useSelector(selectOccurencesByRoot);
  const [chosen, setChosen] = useState<string[]>([]);
  const [options, setOptions] = useState(() => generateOptions(occurences));

  return (
    <div className="text-lg">
      {options.map((option, index) => {
        const key = option.root + index;
        return (
          <div key={key}>
            <input
              id={key}
              type="checkbox"
              checked={chosen.includes(option.root)}
              onChange={(e) =>
                setChosen((old) =>
                  chosen.includes(option.root)
                    ? chosen.filter((thing) => thing !== option.root)
                    : [...chosen, option.root]
                )
              }
            />
            <label className="ml-2" htmlFor={key}>
              {option.root} ({option.count})
            </label>
          </div>
        );
      })}

      <div className="float-right">
        <button
          className="w-28 mt-4 ml-2 border"
          onClick={() =>
            setOptions(generateOptions(occurences, chosen.slice()))
          }
        >
          Pick more
        </button>
        <button
          className="w-28 mt-4 ml-2 border"
          onClick={() => dispatch(finishQuestion(chosen))}
        >
          Start
        </button>
      </div>
      <div className="mt-4">
        {chosen.map((word, index) => (
          <span key={word}>
            {word}
            {index !== chosen.length - 1 ? ", " : " "}
          </span>
        ))}
      </div>
    </div>
  );
};
