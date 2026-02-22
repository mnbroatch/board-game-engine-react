import React from 'react'
import Entity from '../entity/entity.js'
import AbstractChoices from '../abstract-choices/abstract-choices.js'
import GameStatus from '../game-status/game-status.js'
import { GameProvider } from "../../contexts/game-context.js";

export default function Game ({ gameConnection }) {
  console.log('555gameConnection', gameConnection)
  const { G } = gameConnection.state

  return (
    <GameProvider
      gameConnection={gameConnection}
      isSpectator
    >
      <div className="game">
        <AbstractChoices />
        <div
          className="shared-board"
          style={{
            width: '100%',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1em',
          }}
        >
          {G.sharedBoard.entities.map((entity, i) => <Entity key={i} entity={entity} />)}
        </div>
        {G.personalBoards && (
          <div className="personal-boards">
            {G.personalBoards.map((board, i) => (
              <div
                key={i}
                className="personal-board"
                style={{
                  width: '100%',
                  display: 'grid',
                  gridAutoFlow: 'column',
                  gridAutoRows: '1fr',
                  gap: '1em',
                }}
              >
                {board.entities.map((entity, j) => (
                  <Entity key={j} entity={entity} />
                ))}
              </div>
            ))}
          </div>
        )}
        <GameStatus gameConnection={gameConnection} />
      </div>
    </GameProvider>
  )
}
