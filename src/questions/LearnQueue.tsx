import React, { useEffect, useState } from "react";
import { memory, MemoryBank } from "./memory";

export const App = () => {
  const [bank, setBank] = useState<MemoryBank | null>(null);
  useEffect(() => {
    memory.then(setBank);
  }, []);

  return <pre>{JSON.stringify(bank, null, 2)}</pre>;
};
