import { useEffect, useReducer, useState } from 'react'
import { Client } from 'board-game-engine'


export const useGameserverConnection = ({
  server,
  multiplayer,
  matchID,
  gameRules,
  gameName,
  boardgameIOGame,
  playerID,
  credentials,
  numPlayers,
  debug,
  enabled = true,
}) => {
  const [_, forceUpdate] = useReducer(x => x + 1, 0)
  const [connection, setConnection] = useState(null)

  useEffect(() => {
    if (
      !gameRules && !boardgameIOGame
        || credentials && !(matchID && enabled && server)
    ) {
      return
    }

    const options = {
      server,
      numPlayers,
      onClientUpdate: () => {
        forceUpdate()
      },
      debug,
      matchID,
      gameRules,
      boardgameIOGame,
      gameName,
      playerID,
      credentials,
      multiplayer
    }

    const newConnection = new Client(options)

    newConnection.connect()

    setConnection(newConnection)

    return () => {
      connection?.client?.stop()
      setConnection(null)
    }
  }, [
      matchID,
      server,
      playerID,
      credentials,
      gameRules,
      boardgameIOGame,
      enabled,
      multiplayer,
    ])

  if (connection) {
    return Object.assign(
      connection,
      connection?.getState?.(),
    )
  } else {
    return {}
  }
}
