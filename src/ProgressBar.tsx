import React, { useRef } from "react";
import { useResize } from "./hooks/useResize";

export function ProgressBar(
  props: React.PropsWithChildren<{
    style?: React.CSSProperties;
    className?: string;
    complete: number;
  }>
) {
  const barRef = useRef<HTMLDivElement>(null);
  const size = useResize(barRef);

  const complete = Math.max(0, Math.min(1, props.complete));
  const fullWidth = size.width;
  const minWidth = 45;
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
        }}
      >
        {props.children}
      </div>
    </div>
  );
}
