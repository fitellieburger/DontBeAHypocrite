import React, { useEffect, useRef } from "react";
import { useFlyUpUnderTopHalf } from "../hooks/flyUpUnderTop";
import styles from "../styles/LoadingText.module.css";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

export const LoadingText: React.FC<{ 
    isExiting?: boolean; 
    onExitComplete?: () => void }> = ({
  isExiting,
  onExitComplete,
}) => {
  const ref = useFlyUpUnderTopHalf(isExiting, onExitComplete);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!headingRef.current || !paragraphRef.current) return;

    if (isExiting) {
    // When exiting, don't start the looping text animation.
    return;
  }

    // Split heading & paragraph into words
    const headingSplit = new SplitText(headingRef.current, { type: "words" });
    const paragraphSplit = new SplitText(paragraphRef.current, { type: "words" });

    // Wrap each heading word in a fill span
    headingSplit.words.forEach((word) => {
      if (!word.querySelector(`.${styles.fillText}`)) {
        const fillSpan = document.createElement("span");
        fillSpan.className = styles.fillText;
        fillSpan.textContent = word.textContent || "";
        word.textContent = "";
        word.appendChild(fillSpan);
      }
    });

    // Wrap each paragraph word similarly
    paragraphSplit.words.forEach((word) => {
      if (!word.querySelector(`.${styles.fillText}`)) {
        const fillSpan = document.createElement("span");
        fillSpan.className = styles.fillText;
        fillSpan.textContent = word.textContent || "";
        word.textContent = "";
        word.appendChild(fillSpan);
      }
    });

    // Initialize all fills with low opacity
    gsap.set(`.${styles.fillText}`, { opacity: 0.15 });

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.5 });

    // Animate heading words with scale + fill opacity
    headingSplit.words.forEach((word) => {
      const fillSpan = word.querySelector(`.${styles.fillText}`);

      tl.to(
        word,
        {
          scale: 1.15,
          duration: 0.2,
          ease: "back.out(2)",
        },
        ">"
      );

      if (fillSpan) {
        tl.to(
          fillSpan,
          {
            opacity: 1,
            duration: 0.2,
            ease: "back.out(2)",
          },
          "<"
        );
      }

      tl.to(
        word,
        {
          scale: 1,
          duration: 0.15,
          ease: "power1.out",
        }
      );

      if (fillSpan) {
        tl.to(
          fillSpan,
          {
            opacity: 0.15,
            duration: 0.15,
            ease: "power1.out",
          },
          "<"
        );
      }
    });

    // Small pause before paragraph
    tl.to({}, { duration: 0.25 });

    // Animate paragraph words with special effect on "Impact"
    paragraphSplit.words.forEach((word) => {
      const fillSpan = word.querySelector(`.${styles.fillText}`);
      const wordText = fillSpan?.textContent?.toLowerCase() || "";

      if (wordText === "impact") {
        // Special punch + quake + white flash effect timeline for "impact"
        tl.to(
          word,
          {
            scale: 1.8,
            rotation: -20, // rotate clockwise 15 degrees
            transformOrigin: "center center",
            duration: 0.3,
            ease: "back.out(3)",
          },
          ">"
        )
        // Quake effect with small x/y jitters
          .to(
            word,
            {
              x: "-=5",
              y: "+=2",
              transformOrigin: "center center",
              duration: 0.05,
              yoyo: true,
              repeat: 5,
              ease: "rough({ template: none.out, strength: 2, points: 20, taper: 'none', randomize: true, clamp: false })",
            },
            "<"
          )
        // Flash white effect by animating opacity on fillSpan
          .to(
            fillSpan,
            {
              color: "white",
              opacity: 1,
              filter: "brightness(3)",
              duration: 0.15,
              yoyo: true,
              
              ease: "power1.inOut",
            },
            "<"
          )
          // Reset scale, position and rotation smoothly
      .to(word, {
        scale: 1,
        x: 0,
        y: 0,
        rotation: 0,
        duration: 0.3,
        ease: "power1.out",
      }, ">")
      // Reset fillSpan styles
      .to(fillSpan, {
        opacity: 0.15,
        filter: "brightness(1)",
        duration: 0.15,
      }, "<");
      } else {
        // Normal word animation
        tl.to(
          word,
          {
            scale: 1.15,
            duration: 0.2,
            ease: "back.out(2)",
          },
          ">"
        );

        if (fillSpan) {
          tl.to(
            fillSpan,
            {
              opacity: 1,
              duration: 0.2,
              ease: "back.out(2)",
            },
            "<"
          );
        }

        tl.to(
          word,
          {
            scale: 1,
            duration: 0.15,
            ease: "power1.out",
          }
        );

        if (fillSpan) {
          tl.to(
            fillSpan,
            {
              opacity: 0.15,
              duration: 0.15,
              ease: "power1.out",
            },
            "<"
          );
        }
      }
    });

    return () => {
      tl.kill();
      headingSplit.revert();
      paragraphSplit.revert();
    };
  }, [isExiting]);

  return (
    <div className={styles.loadingText} ref={ref}>
      <h3 className={styles.loadingHeading} ref={headingRef}>
        Let's Ask ChatGPT v3.5
      </h3>
      <p className={styles.loadingSubtext} ref={paragraphRef}>
        Looking at Impact over Intent...
      </p>
    </div>
  );
};
