import { useRef } from "react";

export function useRAF() {
  const dragIdRef = useRef<number | null>(null);
  const cancelRecent = () => {
    if (dragIdRef.current) window.cancelAnimationFrame(dragIdRef.current);
  };
  const request = (callback: FrameRequestCallback) => {
    cancelRecent();
    dragIdRef.current = window.requestAnimationFrame(callback);
  };
  return [request, cancelRecent];
}
