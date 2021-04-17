import React, { useRef } from "react";
import { useDispatch } from "react-redux";
import { finishGame } from "../ducks/navigation";
import { useResize } from "../hooks/useResize";

export function ProgressBar(
  props: React.PropsWithChildren<{
    style?: React.CSSProperties;
    className?: string;
    complete: number;
  }>
) {
  const dispatch = useDispatch();
  const barRef = useRef<HTMLDivElement>(null);
  const childrenSpanRef = useRef<HTMLDivElement>(null);

  const barSize = useResize(barRef);
  const childrenSize = useResize(childrenSpanRef);
  const fullWidth = barSize.width;
  const childWidth = childrenSize.width ? childrenSize.width : 0;
  const minWidth = Math.max(70, childWidth + 30);

  const complete = Math.max(0, Math.min(1, props.complete));

  const width = minWidth + complete * (fullWidth - minWidth);
  return (
    <div
      ref={barRef}
      className={props.className}
      style={{
        backgroundColor: "rgba(125, 125, 125, .2)",
        borderRadius: 9999,
        maxHeight: 16,
        ...props.style,
      }}
    >
      <div
        style={{
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
          color: "#fff",
          backgroundColor: "var(--accent)",
          borderRadius: "9999px",
          transition: "ease 1s",
          width,
          maxHeight: "inherit",
          verticalAlign: "middle",
        }}
        onTransitionEnd={() => {
          if (complete >= 1) dispatch(finishGame());
        }}
      >
        <span ref={childrenSpanRef} className="flex">
          {props.children}
        </span>
      </div>
    </div>
  );
}
