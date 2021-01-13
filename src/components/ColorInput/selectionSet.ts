function clickSide(e: React.MouseEvent): 0 | 1 {
  const mouseX = e.clientX;
  const elementRect = (e.target as HTMLElement).getBoundingClientRect();
  const elementCenter = elementRect.x + elementRect.width / 2;
  return mouseX < elementCenter ? 0 : 1;
}
function childIndex(e: React.MouseEvent): number {
  const clicked = e.target;
  const p = e.currentTarget as HTMLParagraphElement;
  return clicked === p
    ? p.childElementCount
    : clicked instanceof HTMLSpanElement
    ? Array.prototype.indexOf.call(p.children, clicked)
    : 0;
}
export function clickedIndex(e: React.MouseEvent) {
  return childIndex(e) + clickSide(e);
}
