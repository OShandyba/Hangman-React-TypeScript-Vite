import { useCallback, useEffect, useState } from "react"
import { HangmanDrawing } from "./HangmanDrawing"
import { HangmanWord } from "./HangmanWord"
import { Keyboard } from "./Keyboard"
import words from "./wordList.json"

function getWord() {
  return words[Math.floor(Math.random() * words.length)]

}

function App() {
  const [worldToGuess, setWorldToGuess] = useState(getWord)
  const [guessedLetters, setGuessedLetters] = useState<string[]>([])

  const incorrectLetters = guessedLetters.filter(letter => !worldToGuess.includes(letter))

  console.log(worldToGuess)

  const isLoser = incorrectLetters.length >= 6
  const isWinner = worldToGuess.split("").every(letter => guessedLetters.includes(letter))

  const addGuessedLetter = useCallback((letter: string) => {
    if (guessedLetters.includes(letter) || isLoser || isWinner) return

    setGuessedLetters(currentLetters => [...currentLetters, letter])
  }, [guessedLetters, isLoser, isWinner])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key

      if (!key.match(/^[a-z]$/)) return

      e.preventDefault()
      addGuessedLetter(key)
    }

    document.addEventListener('keypress', handler)
    return () => {
      document.removeEventListener('keypress', handler)
    }
  }, [guessedLetters])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key

      if (key !== 'Enter') return

      e.preventDefault()
      setGuessedLetters([])
      setWorldToGuess(getWord())
    }

    document.addEventListener('keypress', handler)
    return () => {
      document.removeEventListener('keypress', handler)
    }
  }, [])

  return (
    <div style={{
      background: 'linear-gradient(to top left, #ffccff 29%, #cc99ff 99%)',
      maxWidth: '800px',
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem',
      padding: '30px',
      margin: '0 auto',
      alignItems: 'center'
    }}>
      <div style={{
        fontSize: '2rem',
        textAlign: 'center'
      }}>
        {isWinner && "Winner! - Refresh to try again"}
        {isLoser && "Nice Try - Refresh to try again"}
      </div>
      <HangmanDrawing numberOfGuesses={incorrectLetters.length} />
      <HangmanWord
        reveal={isLoser}
        guessedLetters={guessedLetters}
        wordToGuess={worldToGuess} />
      <div style={{ alignSelf: 'stretch' }}>
        <Keyboard
          disabled={isWinner || isLoser}
          activeLetters={guessedLetters.filter(letter =>
            worldToGuess.includes(letter))}
          inactiveLetters={incorrectLetters}
          addGuessedLetter={addGuessedLetter} />
      </div>
    </div>
  )
}

export default App
