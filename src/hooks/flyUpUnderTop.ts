import { useEffect, useRef } from "react";
import gsap from "gsap";

export function useFlyUpUnderTopHalf(isExiting?: boolean, onExitComplete?: () => void) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    if (isExiting) {
      // Exit animation triggered on isExiting = true
      gsap.to(ref.current, {
        y: -270,
        opacity: 0,
        duration: 0.6,
        ease: "power3.in",
        onComplete: onExitComplete,
      });
    } else {
      // Enter animation on mount or when isExiting becomes false
      gsap.fromTo(
        ref.current,
        { y: 1200, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
      );
    }
  }, [isExiting, onExitComplete]);

  return ref;
}
