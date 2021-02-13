import { useDispatch } from "react-redux";
import { toggleDark, useDark } from "./ducks/settings";

export function DarkModeButton(props: { size: number }) {
  const dispatch = useDispatch();
  const dark = useDark();
  return (
    <button
      className="float-right text-3xl"
      style={{ width: props.size, height: props.size }}
      onClick={(e) => dispatch(toggleDark())}
    >
      {dark ? "🌙" : "☀️"}
    </button>
  );
}
