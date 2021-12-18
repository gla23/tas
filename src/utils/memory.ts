export interface MemoryBank {
  [index: string]: string;
}

export const memory: Promise<MemoryBank> = fetch("/memory.txt")
  .then((response) => response.text())
  .then((text) =>
    text.split("\n").reduce((acc: MemoryBank, line, i, lines) => {
      if (i % 2 === 0) acc[line] = lines[i + 1];
      return acc;
    }, {})
  );
