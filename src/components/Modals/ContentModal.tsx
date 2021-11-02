import { useSpring } from "@react-spring/core";
import React, { useState } from "react";
import { animated } from "react-spring";
import { Modal } from "./Modal";
import { SectionDots } from "./SectionDots";

export type Renderable =
  | Exclude<React.ReactNode, undefined | React.ReactElement>
  | JSX.Element;

interface ContentModalProps {
  content: Renderable[];
  close: () => void;
  open?: boolean;
  width: number;
  height: number;
}

export const ContentModal = (props: ContentModalProps) => {
  // Add arrows left and right?
  // Add overflow for long text
  const { width, height, content } = props;

  const [selected, setSelected] = useState(0);
  const increaseIndex = (increace: number) =>
    setSelected(Math.min(content.length - 1, Math.max(0, selected + increace)));

  const arrowStyle: React.CSSProperties = {
    flex: "36px 0 0",
    lineHeight: height + "px",
    textAlign: "center",
    color: "#bbbbbb",
    userSelect: "none",
  };
  const spring = useSpring({ tab: selected });
  return (
    <Modal open={props.open} close={props.close}>
      <div
        style={{
          display: "flex",
        }}
      >
        <div style={arrowStyle} onClick={() => increaseIndex(-1)}>
          {"<"}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width,
            height,
            paddingTop: 24,
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
                  position: "absolute",
                  // x: spring.tab.to((tab) => (index - tab) * width),
                  transform: spring.tab.to(
                    (tab) => `translateX(${(index - tab) * width}px)`
                  ),
                  // opacity: spring.tab.to((tab) => 1 - Math.abs(tab - index)),
                }}
              >
                {page}
              </animated.div>
            ))}
          </div>
          <div style={{ flex: "36px 0 0" }}>
            <div style={{ width: content.length * 24, margin: "auto" }}>
              <SectionDots
                selectedState={[selected, setSelected]}
                count={content.length}
              />
            </div>
          </div>
        </div>
        <div style={arrowStyle} onClick={() => increaseIndex(1)}>
          {">"}
        </div>
      </div>
    </Modal>
  );
};
