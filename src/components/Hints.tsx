import React, { FC, FunctionComponent, useState } from "react";
import { useSelector } from "react-redux";
import { selectBank } from "../ducks/bank";
import { selectGameType } from "../ducks/gameSelectors";
import {
  selectHintType,
  selectRefOccurencesToFind,
  selectFoundRefs,
  selectAnswerType,
} from "../games/FindGame";
import { recallAnswer } from "../games/RecallGame";
import { Occurrence } from "../utils/occurences";

export const Hints: FC = () => {
  const type = useSelector(selectGameType);
  if (type === "recall") return <RecallHint />;
  if (type === "find") return <FindHint />;
  return <p>hmm</p>;
};

const RecallHint: FC = () => {
  const answer = useSelector(recallAnswer);
  return <p key={answer}>{answer}</p>;
};

const FindHint: FunctionComponent = () => {
  const refOccurences = useSelector(selectRefOccurencesToFind);
  return (
    <>
      {refOccurences.map(([ref, occurrences]) => (
        <OccurrencesHint key={ref} reff={ref} occurrences={occurrences} />
      ))}
    </>
  );
};

interface OccurrencesHintProps {
  reff: string;
  occurrences: Occurrence[];
}
const OccurrencesHint = (props: OccurrencesHintProps) => {
  const [hovered, setHovered] = useState(false);
  const textHint = useSelector(selectHintType) === "text";
  const bank = useSelector(selectBank);
  const found = useSelector(selectFoundRefs);
  const { reff: ref, occurrences } = props;
  const showText = textHint ? !hovered : hovered;
  return (
    <p
      className="leading-tight mt-3"
      key={ref}
      style={{ opacity: found.includes(ref) ? 1 : 0.5 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span
        style={{
          opacity: showText ? 1 : 0,
          position: textHint ? "inherit" : "absolute",
          display: textHint && !showText ? "none" : "normal",
        }}
      >
        <HighlightedHint verse={bank[ref]} occurrences={occurrences} />
      </span>
      <span style={{ opacity: showText ? 0 : 1 }}>{ref}</span>
    </p>
  );
};

interface HightlightedHintProps {
  verse: string;
  occurrences: Occurrence[];
}
const HighlightedHint: FunctionComponent<HightlightedHintProps> = (props) => {
  const final = props.occurrences[props.occurrences.length - 1];
  return (
    <>
      {props.occurrences.map((occurrence, index, all) => {
        const previous: Occurrence = all[index - 1];
        const start = previous ? previous.index + previous.word.length : 0;
        return (
          <span key={occurrence.ref + start}>
            {props.verse.slice(start, occurrence.index)}
            <span className="animate-pulse" style={{ color: "var(--accent)" }}>
              {occurrence.word}
            </span>
          </span>
        );
      })}
      {props.verse.slice(final.index + final.word.length)}
    </>
  );
};
