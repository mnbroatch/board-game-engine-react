import React from 'react'

export default function GameStatus ({ gameConnection }) {
  const players = gameConnection.client.matchData
  const winner = gameConnection.state.ctx.gameover?.winner
  const draw = gameConnection.state.ctx.gameover?.draw
  let winnerString = ''
  if (draw) {
    winnerString = 'Draw!'
  } else if (players && winner) {
    winnerString = `${players[winner].name} Wins!`
  } else if (winner) {
    winnerString = `Player ${winner} Wins!`
  }
  return gameConnection.state.ctx.gameover && (
    <div className="game-status">
      {winnerString}
    </div>
  )
}
