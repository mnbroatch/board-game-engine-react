import { useEffect, useReducer, useState } from 'react'
import * as BoardGameEngine from 'board-game-engine'
console.log('BoardGameEngine', BoardGameEngine)
const Client = BoardGameEngine.Client


export const useGameserverConnection = ({
  server,
  gameId,
  gameRules,
  gameName,
  boardgameIOGame,
  boardgamePlayerID,
  clientToken,
  numPlayers,
  debug,
  singlePlayer = false,
  enabled = true,
}) => {
  const [_, forceUpdate] = useReducer(x => x + 1, 0)
  const [connection, setConnection] = useState(null)

  useEffect(() => {
    if (!gameRules && !boardgameIOGame || !singlePlayer && (!gameId || !clientToken || !enabled || !server)) return

    const options = {
      server,
      numPlayers,
      onClientUpdate: () => {
        forceUpdate()
      },
      debug,
      gameId,
      gameRules,
      boardgameIOGame,
      gameName,
      boardgamePlayerID,
      clientToken,
      singlePlayer,
    }

    const newConnection = new Client(options)

    newConnection.connect()

    setConnection(newConnection)

    return () => {
      connection?.client?.stop()
      setConnection(null)
    }
  }, [gameId, boardgamePlayerID, clientToken, gameRules, boardgameIOGame, enabled])

  if (connection) {
    return Object.assign(
      connection,
      connection?.getState?.(),
    )
  } else {
    return {}
  }
}
