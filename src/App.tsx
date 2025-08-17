import { useEffect, useState, useRef } from "react";
import "./styles/App.css";
import { stances } from "./data/stances";
import type { Representative } from "./types/Representative";

import { PageTitle } from "./components/PageTitle";
import { PersistentStance } from "./components/PersistentStance";
import ZipForm from "./components/ZipCodeForm";
import { ResultsPage } from "./components/ResultsPage";
import { LoadingText } from "./components/LoadingText";
import { Rules } from "./components/Rules";

import { useRulesTitleScrollAnimation } from "./hooks/scrollAnimation.ts";

function App() {
  // Theme (red or blue)
  const [themeColor, setThemeColor] = useState<"red" | "blue">("red");

  // Initial userflow
  const rulesRef = useRef<HTMLDivElement>(null!);
  const titleRef = useRef<HTMLDivElement>(null!);
  const bottomHalfRef = useRef<HTMLDivElement>(null!);

  useRulesTitleScrollAnimation(rulesRef, titleRef, bottomHalfRef);

  // Stance & swiping
  const [selectedStance, setSelectedStance] = useState(stances[0]);
  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState("");

  // Flow control
  const [stage, setStage] = useState<"intro" | "zipForm" | "loading" | "results">("intro");
  const [slideOut, setSlideOut] = useState(false);
  const [loadingExiting, setLoadingExiting] = useState(false);
  const [, setResultsEntering] = useState(false);

  // Zip code state
  const [zipCode, setZipCode] = useState("");
  const [zipReady, setZipReady] = useState(false);
  const [zipSubmitted, setZipSubmitted] = useState(false);

  // Loading and data
  const [, setIsLoading] = useState(false);
  const [withYouReps, setWithYouReps] = useState<Representative[]>([]);
  const [againstYouReps, setAgainstYouReps] = useState<Representative[]>([]);

  // On mount, randomize theme and stance
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
  }
    window.scrollTo(0, 0);
    
    const colors: ("red" | "blue")[] = ["red", "blue"];
    setThemeColor(colors[Math.floor(Math.random() * colors.length)]);
    setSelectedStance(stances[Math.floor(Math.random() * stances.length)]);
  }, []);

  // Swipe to new stance
  function handleSwipeNewStance() {
    setSwipeDirection("left");
    setIsSwiping(true);

    setTimeout(() => {
      setSelectedStance(stances[Math.floor(Math.random() * stances.length)]);
      setSwipeDirection("right");
      setIsSwiping(true);

      setTimeout(() => {
        setIsSwiping(false);
        setSwipeDirection("");
      }, 300);
    }, 300);
  }

  // Agree button: slide out intro buttons, show zip form
  function handleAgree() {
    setSlideOut(true);

    setTimeout(() => {
      setStage("zipForm");
      setZipReady(true);
      setSlideOut(false);
    }, 500);
  }

  // On ZIP form submit
  async function handleZipSubmit() {
    if (zipCode.length !== 5) {
      alert("Please enter a valid 5-digit ZIP code.");
      return;
    }

    
    
    // Delay switching to loading stage until after fade animation finishes
  setTimeout(() => {
    setZipSubmitted(true);
    setStage("loading");
    setIsLoading(true);
  }, 500); // match ZipForm fadeSlideUp duration

    try {
      const stanceText = `${selectedStance.part1} ${selectedStance.part2}`;

      const res = await fetch('https://backend-199865761495.us-central1.run.app/analyze-votes', // <-- add path
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ zipCode, stance: stanceText }),
  
         });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to fetch");

      setWithYouReps(data.withYou || []);
      setAgainstYouReps(data.againstYou || []);
      setLoadingExiting(true);

      setTimeout(() => {
        setStage("results");
        
      }, 1500);
    } 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    catch (error) {
      alert("Failed to load representatives. Try again.");
      setIsLoading(false);
      setZipSubmitted(false);
      setLoadingExiting(false);
    }
  }

  return (
    <div className="app-container">

      {/* Top half with rules and title */}
      <div className={`top-half ${themeColor}`} style={{ position: "relative", overflow: "hidden" }}>
  <div ref={rulesRef} className="rules">  
    <Rules />
  </div>
  <div ref={titleRef} className="title">
    <PageTitle />
  </div>
</div>

      <div className={`bottom-half ${themeColor === "red" ? "blue" : "red"}`}>
        <div ref={bottomHalfRef}
        className="slide-wrapper">
          <PersistentStance
            part1={selectedStance.part1}
            part2={selectedStance.part2}
            isSwiping={isSwiping}
            swipeDirection={swipeDirection}
          />

          {/* Intro: Agree buttons */}
          {stage === "intro" && (
            <div className={`hero-group ${slideOut ? "slide-left-out" : ""}`}>
              <div className="agree-buttons">
                <button onClick={handleAgree}>This Changes My Vote</button>
                <button onClick={handleSwipeNewStance}>
                  This Would Not Change My Vote
                </button>
              </div>
            </div>
          )}

          {/* ZIP form */}
          {stage === "zipForm" && !zipSubmitted && (
            <ZipForm
              zipCode={zipCode}
              setZipCode={setZipCode}
              onSubmit={handleZipSubmit}
              isReady={zipReady}
              disabled={zipCode.length !== 5}
            />
          )}

          {/* Loading */}
{stage === "loading" && (
  <LoadingText
    isExiting={loadingExiting}
    onExitComplete={() => {
      setStage("results");
      setIsLoading(false);
      setLoadingExiting(false);
      setResultsEntering(true); // start results fly-in animation
    }}
  />
)}

          {/* Results */}
{stage === "results" && (
  <ResultsPage
    withYouReps={withYouReps}
    againstYouReps={againstYouReps}
    isExiting={false} // can add exiting logic if needed
  />
)}
        </div>

        <footer className="app-footer">
          <p>© 2025 Don’t Be a Hypocrite</p>
          <p>Your Values, Your Government</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
