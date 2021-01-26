export function commonLength(a: string, b: string): number {
  let i = 0;
  while (i < a.length && i < b.length) {
    if (a[i] !== b[i]) return i;
    i++;
  }
  return i;
}
