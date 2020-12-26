import { useState, useEffect } from "react";

export function useAwait<T>(promise: Promise<T>) {
  const [state, setState] = useState<T | null>(null);
  useEffect(() => {
    promise.then(setState);
  }, [promise]);
  return state;
}
