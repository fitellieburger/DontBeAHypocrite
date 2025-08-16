import React, { useState, useEffect } from "react";
import styles from "../styles/ZipForm.module.css";

interface ZipFormProps {
  zipCode: string;
  setZipCode: (value: string) => void;
  onSubmit: () => void;
  isReady: boolean;
  disabled?: boolean;
}

const ZipForm: React.FC<ZipFormProps> = ({
  zipCode,
  setZipCode,
  onSubmit,
  isReady,
  disabled,
}) => {
  const [error, setError] = useState("");
  const [slideActive, setSlideActive] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);


  useEffect(() => {
    const timer = setTimeout(() => setSlideActive(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // only numbers
    setZipCode(value);
    if (value.length === 5) {
      setError("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFadeOut(true);
    if (zipCode.length === 5) {
      onSubmit();
    } else {
      setError("Please enter a valid 5-digit ZIP code.");
    }
  };

  return (
    <form
      className={`${styles.zipForm} 
                  ${slideActive ? styles.slideInRightActive : ""} 
                  ${fadeOut ? styles.fadeSlideUp : ""}`}
      onSubmit={handleSubmit}
    >
      <input
        id="zipInput"
        type="text"
        placeholder="Enter ZIP Code"
        value={zipCode}
        onChange={handleChange}
        maxLength={5}
        disabled={!isReady}
      />
      <button type="submit" disabled={disabled}>
        Submit
      </button>
      {error && <p className={styles.errorText}>{error}</p>}
    </form>
  );
};

export default ZipForm;
