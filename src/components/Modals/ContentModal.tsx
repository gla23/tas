import { useSpring } from "@react-spring/core";
import React, { useState } from "react";
import { animated } from "react-spring";
import { Modal } from "./Modal";
import { SectionDots } from "./SectionDots";
import arrow from "../../images/arrow.png";
import { useKeyPress } from "../../hooks/useKeypress";

export type Renderable =
  | Exclude<React.ReactNode, undefined | React.ReactElement>
  | JSX.Element;

interface ContentModalProps {
  content: Renderable[];
  close: () => void;
  isOpen?: boolean;
  width: number;
  height: number;
}

export const ContentModal = (props: ContentModalProps) => {
  const { width, height, content } = props;
  const [selected, setSelected] = useState(0);
  const increaseIndex = (increace: number) =>
    setSelected(Math.min(content.length - 1, Math.max(0, selected + increace)));
  const paddingTop = 24;
  const dotsHeight = 32;
  const arrowWidth = 36;
  const arrowStyle: React.CSSProperties = {
    flex: arrowWidth + "px 0 0",
    textAlign: "center",
    color: "#bbbbbb",
    userSelect: "none",
    position: "relative",
  };
  const left = () => increaseIndex(-1);
  const right = () => increaseIndex(1);
  useKeyPress("Escape", props.isOpen && props.close);
  useKeyPress("ArrowLeft", props.isOpen && left);
  useKeyPress("ArrowRight", props.isOpen && right);

  const spring = useSpring({ tab: selected });

  return (
    <Modal isOpen={props.isOpen} close={props.close}>
      <div
        style={{
          display: "flex",
        }}
      >
        <animated.div
          style={{ ...arrowStyle, opacity: spring.tab.to((v) => v) }}
          onClick={left}
        >
          <img
            style={{
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%) rotate(180deg)",
              filter: "brightness(3)",
            }}
            alt="Previous section arrow"
            src={arrow}
          />
        </animated.div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width,
            height,
            paddingTop,
          }}
        >
          <div
            style={{
              flex: "200px 1 1",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {content.map((page, index) => (
              <animated.div
                key={index}
                style={{
                  height: height - paddingTop - dotsHeight,
                  width: width - 2 * arrowWidth,
                  overflowY: index === selected ? "auto" : "hidden",
                  position: "absolute",
                  transform: spring.tab.to(
                    (tab) => `translateX(${(index - tab) * width}px)`
                  ),
                }}
              >
                {page}
              </animated.div>
            ))}
          </div>
          <div
            style={{
              flex: dotsHeight + "px 0 0",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <SectionDots
              selectedState={[selected, setSelected]}
              count={content.length}
            />
          </div>
        </div>
        <animated.div
          style={{
            ...arrowStyle,
            opacity: spring.tab.to((v) => content.length - 1 - v),
          }}
          onClick={right}
        >
          <img
            style={{
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%)",
              filter: "brightness(3)",
            }}
            alt="Next section arrow"
            src={arrow}
          />
        </animated.div>
      </div>
    </Modal>
  );
};
