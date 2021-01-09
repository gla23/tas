import { useState, useEffect } from "react";
import ResizeObserver from "resize-observer-polyfill";

export const useResize = (myRef: React.RefObject<HTMLElement>) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const element = myRef.current;

  useEffect(() => {
    if (!element) return;
    const handleResize = () => setDimensions(element?.getBoundingClientRect());
    const observer = new ResizeObserver(handleResize);
    observer.observe(element);
    return () => {
      observer.unobserve(element);
    };
  }, [element]);

  return dimensions;
};
