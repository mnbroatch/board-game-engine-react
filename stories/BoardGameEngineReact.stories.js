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
  },
  argTypes: {
    gameRules: {
      control: 'text'
    },
    numPlayers: {
      control: 'number'
    }
  }
}

const Template = ({ gameRules, numPlayers }) => {
  const gameConnection = useGameserverConnection({
    gameRules,
    singlePlayer: true,
    numPlayers,
  })

  return (
    <div className="story">
      <ErrorBoundary
        resetKeys={[gameRules, numPlayers]}
        fallbackRender={({ error }) => {
          return (
            <div>
              Invalid Game Rules {error}
            </div>
          )
        }}
      >
        <Game gameConnection={gameConnection} />
      </ErrorBoundary>
    </div>
  )
}

export const Basic = Template.bind({})
