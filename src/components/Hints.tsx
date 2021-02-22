import React, { FC, FunctionComponent, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { selectBank } from "../ducks/bank";
import { selectGameType } from "../ducks/gameSelectors";
import {
  selectHintType,
  selectRefOccurencesToFind,
  selectFoundRefs,
} from "../games/FindGame";
import { recallAnswer } from "../games/RecallGame";
import { Occurrence } from "../utils/occurences";
import { useSpring, animated } from "react-spring";
import { useResize } from "../hooks/useResize";

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
  const { reff: ref, occurrences } = props;
  const [hovered, setHovered] = useState(false);
  const textRef = useRef<HTMLSpanElement>(null);
  const size = useResize(textRef);
  const height = Math.max(20, size.height) + "px";
  const textHint = useSelector(selectHintType) === "text";
  const bank = useSelector(selectBank);
  const found = useSelector(selectFoundRefs);
  const showRef = textHint ? hovered : !hovered;
  const textStyle = useSpring({
    opacity: showRef ? 0 : 1,
    transform: showRef
      ? "translate(0%, -" + height + ") rotateX(-90deg)"
      : "translate(0%, 0%) rotateX(0deg)",
    display: "inline-block",
  });
  const refStyle = useSpring({
    position: "absolute",
    top: "calc(50% - 10px)",
    opacity: showRef ? 1 : 0,
    transform: showRef
      ? "translate(0%, 0%) rotateX(0deg)"
      : "translate(0%, " + height + ") rotateX(-90deg)",
  });
  return (
    <p
      className="leading-tight mt-3 w-100 relative"
      key={ref}
      style={{ opacity: found.includes(ref) ? 1 : 0.5 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <animated.span style={refStyle}>{ref}</animated.span>
      <animated.span ref={textRef} style={textStyle}>
        <HighlightedHint verse={bank[ref]} occurrences={occurrences} />
      </animated.span>
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
