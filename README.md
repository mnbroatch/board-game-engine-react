# Board Game Engine React

React library for running games built with [board-game-engine](https://www.npmjs.com/package/board-game-engine). Renders shared boards, personal boards, choices, and game status; connects to a game server or runs in single-player mode.

For game rules, state shape, and engine concepts, see the [board-game-engine](https://www.npmjs.com/package/board-game-engine) package.

---

## Install

```bash
npm install board-game-engine-react react
```

---

## API

### `Game`

Root UI component. Renders the current game state (shared board, personal boards, abstract choices, status). Pass a `gameConnection` object from `useGameserverConnection`.

```jsx
import { Game, useGameserverConnection } from 'board-game-engine-react'

function App() {
  const gameConnection = useGameserverConnection({
    server: 'https://your-server.com',
    matchID: 'room-1',
    gameRules: myGameRules,
    credentials: '…',
    playerID: '0',
    numPlayers: 2,
  })

  return (
    <Game
      gameConnection={gameConnection}
      loading={<div>Connecting…</div>}
      isSpectator={false}
    />
  )
}
```

Single-player (no server): omit `server`, `matchID`, and `credentials` and pass `gameRules` and `numPlayers`:

```jsx
const gameConnection = useGameserverConnection({
  gameRules: myGameRules,
  numPlayers: 2,
})
```

| Prop              | Type    | Description |
|-------------------|---------|-------------|
| `gameConnection`  | object  | Connection/state object (e.g. from `useGameserverConnection`). |
| `loading`         | node    | Rendered while there is no game state (e.g. connecting). |
| `isSpectator`     | boolean | If true, disables making moves. |

---

### `useGameserverConnection(options)`

Hook that creates and maintains a connection to a game server (or a local game when no server is configured). Returns an object that includes connection state and methods; pass this object as `gameConnection` to `<Game />`.

| Option            | Type    | Description |
|-------------------|---------|-------------|
| `server`          | string  | Game server URL (required for multiplayer). |
| `matchID`         | string  | Room/match id (required for multiplayer). |
| `credentials`     | string  | Auth credentials for the client (required for multiplayer). |
| `gameRules`       | object  | Game definition from board-game-engine. |
| `boardgameIOGame` | object  | boardgame.io game config (alternative to `gameRules`). |
| `gameName`        | string  | Game name sent to server. |
| `playerID`        | string  | Player id (e.g. `'0'`, `'1'`). |
| `numPlayers`      | number  | Number of players. |
| `multiplayer`     | boolean | Use server multiplayer; omit or false for local/single-player. |
| `debug`           | boolean | Enable debug logging. |
| `enabled`         | boolean | If false, skip connecting (default: `true`). |

---

## Styles

Import the default styles so the game UI looks correct:

```js
import 'board-game-engine-react/dist/board-game-engine-react.css'
```

---

## Further reading

- **[board-game-engine](https://www.npmjs.com/package/board-game-engine)** — Game rules, state, `Client` options, and engine concepts.
