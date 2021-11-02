import { useTransition } from "@react-spring/core";
import { animated } from "@react-spring/web";
import React, { useState } from "react";

const original = [
  { name: "Jeff" },
  { name: "Bob" },
  { name: "Harry" },
  { name: "Fred" },
];
export const Thing = () => {
  const [people, setPeople] = useState(original);
  const [scale, setScale] = useState(1);
  // const styles = useSpring({
  //   // delay: 1000,
  //   from: { scaleX: 0 },
  //   to: { scaleX: scale, display: "inline-block" },
  // });
  const transition = useTransition(people, {
    from: { opacity: 0, height: 0 },
    enter: { opacity: 1, height: 24 },
    leave: { opacity: 0, height: 0 },
  });

  return (
    <>
      <button onClick={() => setPeople((p) => [{ name: "Boggo" }, ...p])}>
        add
      </button>
      <br />
      <button onClick={() => setPeople((p) => p.slice(1))}>remove</button>
      <br />
      <button onClick={() => setPeople(original)}>reset</button>
      <br />
      <button
        onClick={() => setPeople((p) => [{ name: "Boggo" }, ...p.slice(1)])}
      >
        replace
      </button>
      <br />
      <br />

      {transition((style, item) => {
        return <animated.div style={style}>{item.name}</animated.div>;
      })}
      <br />
      <input
        type="text"
        value={scale}
        onChange={(e) => setScale(Number(e.target.value))}
      />
    </>
  );
};
