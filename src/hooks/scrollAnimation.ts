import { useEffect, useState } from "react";
import gsap from "gsap";

export function useRulesTitleScrollAnimation(
  rulesRef: React.RefObject<HTMLElement>,
  titleRef: React.RefObject<HTMLElement>,
  bottomHalfRef: React.RefObject<HTMLElement>,
  threshold = 100
) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!rulesRef.current || !titleRef.current || !bottomHalfRef.current) return;

    // Initial positions
    gsap.set(rulesRef.current, { y: 0 });
    gsap.set(titleRef.current, { y: "100%" });
    gsap.set(bottomHalfRef.current, { y: 150 }); // example offset

    const onScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > threshold && !scrolled) {
        setScrolled(true);
        gsap.to(rulesRef.current, { y: "-100%", duration: 0.5, ease: "power2.inOut" });
        gsap.to(titleRef.current, { y: "0%", duration: 0.5, ease: "power2.inOut" });
        gsap.to(bottomHalfRef.current, { y: 0, duration: 0.5, ease: "power2.inOut" });
      } else if (scrollY <= threshold && scrolled) {
        setScrolled(false);
        gsap.to(rulesRef.current, { y: "0%", duration: 0.5, ease: "power2.inOut" });
        gsap.to(titleRef.current, { y: "100%", duration: 0.5, ease: "power2.inOut" });
        gsap.to(bottomHalfRef.current, { y: 150, duration: 0.5, ease: "power2.inOut" });
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [rulesRef, titleRef, bottomHalfRef, scrolled, threshold]);
}
