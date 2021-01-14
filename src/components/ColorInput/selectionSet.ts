function binaryFindIndex<T>(
  array: T[],
  callback: (elem: T, index?: number, array?: T[]) => number
) {
  let left = 0;
  let right = array.length - 1;
  while (left < right) {
    // Using bitwise or instead of Math.floor as it is slightly faster
    const mid = ((right + left) / 2) | 0;
    const direction = callback(array[mid], mid, array);
    if (direction === 0) return mid;
    if (direction < 0) {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }
  return left;
}

const mouseDirection = (
  event: MouseEvent | React.MouseEvent,
  span: ChildNode
) => {
  const rect = (span as HTMLElement).getBoundingClientRect();
  const { top, bottom, left, right } = rect;
  const { clientX: x, clientY: y } = event;
  if (y < top || (y < bottom && x < left)) return -1;
  if (y >= bottom || (y > top && x >= right)) return 1;
  return 0;
};
export function childIndex(
  event: MouseEvent | React.MouseEvent,
  paragraphRef: React.RefObject<HTMLParagraphElement>
): number {
  const p = paragraphRef.current;
  if (!p) return 0;
  const spans = Array.from(p.childNodes).filter(
    (elem) => elem instanceof HTMLSpanElement
  );
  if (mouseDirection(event, spans[spans.length - 1]) === 1)
    return spans.length - 1;
  const index = true
    ? binaryFindIndex(spans, (elem) => mouseDirection(event, elem))
    : spans.findIndex((span, i) => {
        return mouseDirection(event, span) <= 0;
      });
  const side = clickSide(spans[index], event);
  return index + side;
}

function clickSide(
  span: ChildNode,
  event: React.MouseEvent | MouseEvent
): 0 | 1 {
  if (!(span instanceof HTMLSpanElement)) return 0;
  const { top, right, width } = span.getBoundingClientRect();
  const { clientX: x, clientY: y } = event;
  return x >= right - width / 2 && x < right && y > top ? 1 : 0;
}
