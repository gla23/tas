const before = (event: MouseEvent | React.MouseEvent) => (rect: DOMRect) => {
  const { clientX: x, clientY: y } = event;
  return (
    y < rect.y || (x < rect.x + rect.width / 2 && y < rect.y + rect.height)
  );
};
export function childIndex(
  event: MouseEvent | React.MouseEvent,
  paragraphRef: React.RefObject<HTMLParagraphElement>
): number {
  const p = paragraphRef.current;
  if (!p) return 0;
  const rects = Array.from(p.childNodes)
    .filter((elem) => elem instanceof HTMLSpanElement)
    .map((span) => (span as HTMLSpanElement).getBoundingClientRect());
  if (!before(event)(rects[rects.length - 1])) return rects.length;
  return rects.findIndex(before(event));
}
