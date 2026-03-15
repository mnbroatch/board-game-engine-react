import React from 'react'
import { Game, useGameserverConnection } from '../src/index'
import ticTacToe from './tic-tac-toe.json'
import { ErrorBoundary } from 'react-error-boundary'
import './styles.css'

export default {
  title: 'Game',
  component: Game,
  className: 'board-game-engine-react',
  args: {
    gameRules: JSON.stringify(ticTacToe, null, 2),
    numPlayers: 2,
    isSpectator: false,
  },
  argTypes: {
    gameRules: { control: 'text' },
    numPlayers: { control: 'number' },
    isSpectator: { control: 'boolean' },
  },
}

const parseGameRules = (gameRules, fallback) => {
  if (typeof gameRules !== 'string') return gameRules
  try {
    return JSON.parse(gameRules || '{}')
  } catch {
    return fallback
  }
}

const fallbackRender = ({ error }) => <div>Invalid Game Rules {error}</div>

const Template = ({ gameRules, numPlayers, loading, isSpectator }) => {
  const rules = parseGameRules(gameRules, ticTacToe)
  const gameConnection = useGameserverConnection({
    gameRules: rules,
    numPlayers,
  })

  return (
    <div className="story">
      <ErrorBoundary resetKeys={[gameRules, numPlayers]} fallbackRender={fallbackRender}>
        <Game
          gameConnection={gameConnection}
          loading={loading}
          isSpectator={isSpectator}
        />
      </ErrorBoundary>
    </div>
  )
}

export const Basic = Template.bind({})

export const WithLoading = (args) => (
  <Template
    {...args}
    loading={<div className="story-loading">Loading game…</div>}
  />
)
WithLoading.args = {
  gameRules: JSON.stringify(ticTacToe, null, 2),
  numPlayers: 2,
}

export const Spectator = Template.bind({})
Spectator.args = {
  gameRules: JSON.stringify(ticTacToe, null, 2),
  numPlayers: 2,
  isSpectator: true,
}
