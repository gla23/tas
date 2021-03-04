import React, { PropsWithChildren, useRef, useState } from "react";
import { useSpring, animated } from "react-spring";
import { useResize } from "../hooks/useResize";

export const HoverReveal = (
  props: PropsWithChildren<{
    reverse?: boolean;
    back?: React.ReactNode;
    debug?: boolean;
  }>
) => {
  const { debug, reverse, back } = props;
  const [hovered, setHovered] = useState(false);
  const outerRef = useRef<HTMLSpanElement>(null);
  const outerSize = useResize(outerRef);
  const height = Math.max(20, outerSize.height) / 2 + "px";
  const showBack = reverse ? !hovered : hovered;
  const frontStyle = useSpring({
    opacity: showBack ? 0 : 1,
    transform: showBack
      ? "translate(0%, -" + height + ") rotateX(-90deg)"
      : "translate(0%, 0%) rotateX(0deg)",
    display: "inline-block",
  });
  const backStyle = useSpring({
    position: "absolute",
    height: outerSize.height,
    opacity: showBack ? 1 : 0,
    transform: showBack
      ? "translate(0%, 0%) rotateX(0deg)"
      : "translate(0%, " + height + ") rotateX(-90deg)",
  });
  return (
    <span
      ref={outerRef}
      style={{
        position: "relative",
        display: "inline-block",
      }}
      onMouseEnter={() => !debug && setHovered(true)}
      onMouseLeave={() => !debug && setHovered(false)}
      onClick={() => debug && setHovered((a) => !a)}
    >
      <animated.span style={backStyle}>{back ?? null}</animated.span>
      <animated.span style={frontStyle}>{props.children}</animated.span>
    </span>
  );
};
