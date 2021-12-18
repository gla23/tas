import { useEffect } from "react";

export function useKeyPress(
  key: string,
  callback: (() => void) | null | false | undefined
): void {
  useEffect(() => {
    if (!callback) return undefined;
    const handler = (event: KeyboardEvent) => {
      // console.log("hmm", event.key, key);
      if (event.key === key) callback();
    };
    document.body.addEventListener("keyup", handler);
    return () => document.body.removeEventListener("keyup", handler);
  }, [key, callback]);
}
