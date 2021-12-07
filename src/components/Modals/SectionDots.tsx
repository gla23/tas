import { useSprings } from "@react-spring/core";
import { animated } from "@react-spring/web";
import { StatePair } from "../../pages/GamePage";

interface SectionDotsProps {
  count: number;
  selectedState: StatePair<number>;
}
export const SectionDots = (props: SectionDotsProps) => {
  const { count, selectedState } = props;
  const [selected, setSelected] = selectedState;
  const height = 12;
  const spacing = height * 2;
  const extraBulgeWidth = 20; //12;
  const dots = new Array(count).fill(null);
  const springs = useSprings(
    count,
    dots.map((_, index) => ({
      from: { opacity: 0, height: "0px", width: "0px" },
      to: {
        opacity: index === selected ? 0.9 : 0.6,
        left: spacing * index + (index > selected ? extraBulgeWidth : 0) + 6,
        height: height + "px",
        width: height + (index === selected ? extraBulgeWidth : 0) + "px",
        borderRadius: height / 2 + "px",
      },
    }))
  );
  return (
    <div
      className="relative inline-block"
      style={{
        height: height + "px",
        width: props.count * spacing + extraBulgeWidth,
      }}
    >
      {springs.map((styles, i) => (
        <animated.div
          onClick={() => setSelected(i)}
          key={i}
          style={{
            ...styles,
            backgroundColor: "#bbb",
            position: "absolute",
          }}
        />
      ))}
    </div>
  );
};
