import React from "react";

interface CloseButtonProps {
  size?: number;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => unknown;
  className?: string;
}

export function CloseButton(props: CloseButtonProps) {
  const width = 2;
  return (
    <button
      className={props.className}
      onClick={props.onClick}
      style={{
        backgroundColor: "transparent",
        borderColor: "transparent",
        height: props.size || 32,
        width: props.size || 32,
        position: "relative",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(125, 125, 125, 0.5)",
          transform: "translate(0%, -50%) rotate(45deg)",
          position: "absolute",
          left: "0px",
          top: "50%",
          height: width,
          width: "100%",
        }}
      />
      <div
        style={{
          backgroundColor: "rgba(125, 125, 125, 0.5)",
          transform: "translate(-50%, 0%) rotate(45deg)",
          position: "absolute",
          left: "50%",
          top: "0px",
          height: "100%",
          width: width,
        }}
      />
    </button>
  );
}
