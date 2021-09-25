import { useEffect, useState } from "react";
import ReactDOM from "react-dom";

interface ModalProps {
  children: React.ReactNode | string;
  title?: React.ReactNode | string;
  close: () => void;
  open?: boolean;
}
export const Modal = (props: ModalProps) => {
  const [tween, setTween] = useState(0);
  useEffect(() => {
    setTween(1);
  }, [props.open]);
  // This is why react-spring is worth using?
  const transition = "0.2s all";
  const modalRoot = document.querySelector("#modalRoot");
  if (!modalRoot) return "failed to find modalRoot" as unknown as JSX.Element;
  return ReactDOM.createPortal(
    <>
      <div
        style={{
          position: "fixed",
          top: "0px",
          left: "0px",
          width: "100vw",
          height: "100vh",
          backgroundColor: "black",
          opacity: 0.4 * tween * tween * tween,
          transition,
        }}
        onClick={() => props.close()}
      ></div>
      <div
        className="duration-500 bg-white text-black dark:bg-gray-700 dark:text-white"
        style={{
          // boxShadow: "0px 8px 40px -8px",
          position: "fixed",
          maxWidth: "80vw",
          minWidth: "min(80vw, 500px)",
          margin: "auto",
          minHeight: "240px",
          top: `calc(-${50 * (1 - tween) * (1 - tween)}vh + 32px)`,
          left: "50vw",
          transform: "translateX(-50%)",
          borderRadius: "8px",
          transition,
        }}
      >
        {props.title && (
          <div
            style={{
              display: "flex",
              height: 80,
              padding: 28,
              borderBottom: "solid grey 1px",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h1>{props.title}</h1>
            <button style={{ fontSize: 24 }} onClick={props.close}>
              ×
            </button>
          </div>
        )}
        {props.children}
      </div>
    </>,
    modalRoot
  );
};
