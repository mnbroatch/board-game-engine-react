import React, { useState, useCallback } from 'react'
import { createRoot } from 'react-dom/client'
import '../dist/board-game-engine-react.css'
import { Game, useGameserverConnection } from 'board-game-engine-react'

const GAME_OPTIONS = [
  { value: 'tic-tac-toe', label: 'Tic Tac Toe' },
  { value: 'connect-four', label: 'Connect Four' },
  { value: 'reversi', label: 'Reversi' },
  { value: 'eights', label: 'Crazy Eights' },
  { value: 'checkers', label: 'Checkers' },
]

function Harness () {
  const [gameKey, setGameKey] = useState('tic-tac-toe')
  const [numPlayers, setNumPlayers] = useState(2)
  const [gameRules, setGameRules] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const startGame = useCallback(async () => {
    setError(null)
    setLoading(true)
    try {
      const res = await fetch(`/games/${gameKey}.json`)
      if (!res.ok) throw new Error(res.statusText)
      const rules = await res.json()
      const n = Number(numPlayers) || rules.numPlayers || rules.maxPlayers || 2
      setGameRules(JSON.stringify(rules))
      setNumPlayers(n)
    } catch (err) {
      setError(err.message || String(err))
      setGameRules(null)
    } finally {
      setLoading(false)
    }
  }, [gameKey, numPlayers])

  const connection = useGameserverConnection({
    singlePlayer: true,
    gameRules: gameRules || '',
    gameName: gameKey,
    numPlayers,
    enabled: !!gameRules,
  })

  const hasState = connection?.getState?.()

  return (
    <div className="harness" data-testid="harness">
      <h1 data-testid="harness-title">Board Game Engine React</h1>
      <div className="harness__controls">
        <label>
          Game
          <select
            id="game-select"
            data-testid="game-select"
            value={gameKey}
            onChange={(e) => { setGameKey(e.target.value); setGameRules(null) }}
          >
            {GAME_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </label>
        <label>
          Players
          <input
            id="players-input"
            data-testid="players-input"
            type="number"
            min={1}
            max={6}
            value={numPlayers}
            onChange={(e) => setNumPlayers(Number(e.target.value) || 2)}
          />
        </label>
        <button
          id="start-btn"
          data-testid="start-btn"
          type="button"
          onClick={startGame}
          disabled={loading}
        >
          {loading ? 'Loading…' : 'Start / Reset Game'}
        </button>
      </div>
      {error && <p data-testid="harness-error" role="alert">{error}</p>}
      <div className="harness__game" data-testid="harness-game">
        <Game
          gameConnection={hasState ? connection : null}
          loading={gameRules && !hasState ? 'Starting…' : null}
          isSpectator={false}
        />
      </div>
    </div>
  )
}

const root = document.getElementById('root')
createRoot(root).render(<Harness />)
