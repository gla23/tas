import { useEffect, useRef, useState } from "react";

type SandboxRef = React.MutableRefObject<{ [key: string]: any }>;
interface UseTweenSettings {
  precision?: number;
  tweener?: Tweener;
  doneCheck?: DoneCheck;
  onChange?: OnChange;
  onEnd?: OnChange;
}
interface Tweener {
  (
    previousTween: number,
    value: number,
    dTime: number,
    ref: SandboxRef
  ): number;
}
interface DoneCheck {
  (previousTween: number, value: number, ref: SandboxRef): boolean;
}
interface OnChange {
  (newValue: number, ref: SandboxRef, setTween: (value: number) => void): void;
}

const atRest: DoneCheck = (tween, value, ref) =>
  Math.abs(tween - value) < 0.01 && Math.abs(ref.current.velocity) < 0.01;
const reset: OnChange = (newValue, ref, setTween) => {
  if (newValue < ref.current.tween) {
    setTween(newValue);
    ref.current.tween = newValue;
    ref.current.velocity = 0;
  }
};
function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
const springTweener: (stiffness: number, damping: number) => Tweener = (
  stiffness,
  damping
) => (tween, value, dTime, ref) => {
  const v = ref.current.velocity || 0;
  const dV = (value - tween) * dTime * stiffness * 0.00001;
  const velocity =
    (v + dV) * Math.pow(1 - clamp(damping / 100, 0, 1), dTime / 16);
  ref.current.velocity = velocity;
  return tween + velocity * dTime;
};
export function spring(
  stiffness: number = 12,
  damping: number = 12
): UseTweenSettings {
  return {
    tweener: springTweener(stiffness, damping),
    doneCheck: atRest,
  };
}
const approachTween: Tweener = (tween, value, dTime) =>
  tween + (value - tween) * 0.01 * dTime;
const approachCheck: DoneCheck = (tween, value) =>
  Math.abs(tween - value) < 0.1;
export const approach: UseTweenSettings = {
  tweener: approachTween,
  doneCheck: approachCheck,
};
export const forwardApproach: UseTweenSettings = {
  tweener: (tween, value, dTime) =>
    tween > value ? value : tween + (value - tween) * 0.01 * dTime,
};
export const wobbly: UseTweenSettings = spring(12, 12);
export const overShoot: UseTweenSettings = {
  tweener: (tween, value, dTime, ref) => {
    const stiffness = tween < value ? 4 : 0;
    const damping = tween < value ? 1 : 0.9;
    const v = ref.current.velocity || 0;
    const dV = (value - tween) * dTime * stiffness * 0.00001;
    const velocity = (v + dV) * damping;
    const newTween = tween + velocity * dTime;
    if (tween < value && newTween >= value) {
      ref.current.velocity = Math.min(velocity / 5, 0.05);
      return value;
    }
    ref.current.velocity = velocity;
    return newTween;
  },
  doneCheck: (tween, value, ref) =>
    tween >= value && Math.abs(ref.current.velocity) < 0.01,
  onChange: reset,
};

export function useTween(value: number, settings: UseTweenSettings) {
  const {
    tweener = approachTween,
    doneCheck = approachCheck,
    onChange,
    onEnd,
  } = settings;

  const [tween, setTweenState] = useState(value);
  function setTween(value: number) {
    setTweenState(value);
    ref.current.tween = value;
  }
  const ref = useRef({
    animating: false,
    id: 0,
    value,
    tween,
    time: 0,
    tweener,
    doneCheck,
  });

  useEffect(() => {
    onChange && onChange(value, ref, setTween);
    ref.current.value = value;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  useEffect(() => {
    ref.current.tweener = tweener;
  }, [tweener]);
  useEffect(() => {
    ref.current.doneCheck = doneCheck;
  }, [doneCheck]);

  useEffect(() => {
    if (ref.current.animating || doneCheck(tween, value, ref)) return undefined;

    ref.current.animating = true;
    const callback: FrameRequestCallback = (currentTime) => {
      const { value, tween, time, tweener, doneCheck } = ref.current;
      const dTime = time ? currentTime - time : 16;
      ref.current.time = currentTime;
      if (!doneCheck(tween, value, ref)) {
        setTween(tweener(tween, value, dTime, ref));
        window.requestAnimationFrame(callback);
      } else {
        if (Math.abs(value - tween) < 0.05) setTween(value);
        onEnd && onEnd(value, ref, setTween);
        ref.current.animating = false;
        ref.current.time = 0;
      }
    };
    ref.current.id = window.requestAnimationFrame(callback);
  });

  useEffect(
    () => () => {
      const { id } = ref.current;
      if (id) window.cancelAnimationFrame(id);
    },
    []
  );
  return tween;
}
