import { useRef } from "react";

export function useRAF() {
  const idRef = useRef<number | null>(null);
  const cancelRecent = () => {
    if (idRef.current) window.cancelAnimationFrame(idRef.current);
  };
  const request = (callback: FrameRequestCallback) => {
    cancelRecent();
    idRef.current = window.requestAnimationFrame(callback);
  };
  return [request, cancelRecent];
}
