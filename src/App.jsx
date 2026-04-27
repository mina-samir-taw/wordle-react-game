import React, { useState,useEffect} from "react";
import "./App.css";
import Row from "./Row.jsx";

const App = () => {
  const maxAttempts = 6;
  const [targetWord,setTargetWord] = useState("")
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [isGameOver, setIsGameOver] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState(maxAttempts);
  const [gameResult, setGameResult] = useState(null);
  const [usedLetters , setUsedLetters] = useState({});
  const fetchWord = async () => {
    setLoading(true);
    setError(null);
    try {
    const res = await fetch("https://api.datamuse.com/words?sp=?????");
    if(!res.ok){
      throw new Error("API Failed");
    }
    const data = await res.json();
    const word = data[Math.floor(Math.random()* data.length)]?.word || "REACT";
    setTargetWord(word.toUpperCase());
  } catch (err){
    console.log(err);
    const fallbackWords = ["REACT", "SMART", "PLANE", "SCORE"];
    const random =
      fallbackWords[Math.floor(Math.random() * fallbackWords.length)];

    setTargetWord(random);
    setError("API failed → using offline word");
  }finally{
    setLoading(false);
  }
};
useEffect(()=>{
  fetchWord();
},[]);
  const handleInputChange = (event) => {
    setCurrentGuess(event.target.value.toUpperCase());
  };
  const handleGuess = () => {
    if (currentGuess.length !== 5) return;
    if (guesses.includes(currentGuess)){
      alert("You already guessed this word!");
      return;
    }
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
    const newUsed = {...usedLetters};
    currentGuess.split("").forEach((letter,index)=>{
      if (letter === targetWord[index]){
        newUsed[letter] = "correct";
      }else if(targetWord.includes(letter)){
        if (newUsed[letter] !== "correct"){
          newUsed[letter] = "present";
        }
      }else{
        if(!newUsed[letter]){
          newUsed[letter] = "absent";
        }
      }
    });
    setUsedLetters(newUsed);
    setCurrentGuess("");
  };
  const reset = () => {
    setGuesses([]);
    setCurrentGuess("");
    setIsGameOver(false);
    setRemainingAttempts(maxAttempts);
    setGameResult(null);
    fetchWord();
    setUsedLetters({});
  };
  if (loading) return <h2>Loading...{loading}</h2>;
  if(error) return <p style={{ color: "orange" }}>{error}</p>;
  return (
    <div className="main-container">
      <h1>Wordle</h1>
      {error && <p style={{ color: "orange" }}>{error}</p>}
      <p className={`attempts ${remainingAttempts <= 3 ? "warning" : ""}`}>
        You have {remainingAttempts} attempts remaining!
      </p>
      {guesses.map((guess, index) => (
        <Row key={index} guess={guess} targetWord={targetWord} />
      ))}
      {error ? <p>{error}</p>
      :
      !isGameOver && (
        <>
          <input
            onKeyDown={(e) => {
              if (e.key === "Enter") handleGuess();
            }}
            value={currentGuess}
            onChange={handleInputChange}
            maxLength={5}
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
      <div className="keyboard">
      {Object.keys(usedLetters).map((letter)=>(
        <span key={letter} className={`key ${usedLetters[letter]}`}>
          {letter}
        </span>
      ))}
      </div>
    </div>
  );
};

export default App;
