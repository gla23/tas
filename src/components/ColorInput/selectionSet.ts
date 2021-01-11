function clickSide(e: React.MouseEvent): 0 | 1 {
  const mouseX = e.clientX;
  const elementRect = (e.target as HTMLElement).getBoundingClientRect();
  const elementCenter = elementRect.x + elementRect.width / 2;
  return mouseX < elementCenter ? 0 : 1;
}
export const setCursor = (
  e: React.MouseEvent,
  ref: React.RefObject<any>,
  index: number
) => {
  if (!ref.current) return;
  const clickedIndex = index + clickSide(e);
  ref.current.selectionStart = clickedIndex;
  ref.current.selectionEnd = clickedIndex;
  ref.current.selectionDirection = "none";
};
