import { useEffect, useState } from "react";

export function useCountUp(target, duration = 600) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let start = null;
    let frame;

    function step(timestamp) {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setValue(Math.round(progress * target));
      if (progress < 1) {
        frame = requestAnimationFrame(step);
      }
    }

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
}
