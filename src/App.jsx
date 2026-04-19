import React, { useState } from "react";
import "./App.css";
import Row from "./Row.jsx";

const App = () => {
  const targetWord = "REACT";
  const maxAttempts = 6;

  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [isGameOver, setIsGameOver] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState(maxAttempts);
  const [gameResult, setGameResult] = useState(null);
  const handleInputChange = (event) => {
    setCurrentGuess(event.target.value.toUpperCase());
  };
  const handleGuess = () => {
    if (currentGuess.length !== 5) return;
    const updatedGuesses = [...guesses, currentGuess];
    setGuesses(updatedGuesses);
    if (currentGuess === targetWord) {
      setGameResult("win");
      setIsGameOver(true);
    } else if (updatedGuesses.length === maxAttempts) {
      setGameResult("lose");
      setIsGameOver(true);
    }
    setRemainingAttempts((prev) => prev - 1);
    setCurrentGuess("");
  };
  const reset = () => {
    setGuesses([]);
    setCurrentGuess("");
    setIsGameOver(false);
    setRemainingAttempts(maxAttempts);
    setGameResult(null);
  };
  return (
    <div className="main-container">
      <h1>Wordle</h1>
      <p className={`attempts ${remainingAttempts <= 3 ? "warning" : ""}`}>
        You have {remainingAttempts} attempts remaining!
      </p>
      {guesses.map((guess, index) => (
        <Row key={index} guess={guess} targetWord={targetWord} />
      ))}
      {!isGameOver && (
        <>
          <input
            onKeyDown={(e) => {
              if (e.key === "Enter") handleGuess();
            }}
            value={currentGuess}
            onChange={handleInputChange}
            maxLength={targetWord.length}
            placeholder="Enter your guess"
            disabled={isGameOver}
          />
          <button
            className="guess-button"
            onClick={handleGuess}
            disabled={currentGuess.length !== 5}
          >
            Guess
          </button>{" "}
        </>
      )}
      {gameResult === "win" && <h2 className="win">You Win 🎉</h2>}
      {gameResult === "lose" && (
        <h2 className="lose">You Lost 😢 - Word was {targetWord}</h2>
      )}
      {isGameOver && (
        <button className="reset-button" onClick={reset}>
          Restart 🤔
        </button>
      )}
    </div>
  );
};

export default App;
