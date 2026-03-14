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

Root UI component. Renders the current game state (shared board, personal boards, abstract choices, status). Wrap with a provider that supplies `gameConnection`.

```jsx
import { Game, useGameserverConnection } from 'board-game-engine-react'

function App() {
  const gameConnection = useGameserverConnection({
    server: 'https://your-server.com',
    gameId: 'room-1',
    gameRules: myGameRules,
    clientToken: '…',
    // …other options
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

| Prop              | Type    | Description |
|-------------------|---------|-------------|
| `gameConnection`  | object  | Connection/state object (e.g. from `useGameserverConnection`). |
| `loading`        | node   | Rendered while there is no game state (e.g. connecting). |
| `isSpectator`    | boolean | If true, disables making moves. |

---

### `useGameserverConnection(options)`

Hook that creates and maintains a connection to a game server. Returns an object that includes connection state and methods; pass this object as `gameConnection` to `<Game />`.

| Option              | Type    | Description |
|---------------------|---------|-------------|
| `server`            | string  | Game server URL (required unless `singlePlayer`). |
| `gameId`            | string  | Room/game id (required unless `singlePlayer`). |
| `clientToken`       | string  | Auth token for the client (required unless `singlePlayer`). |
| `gameRules`         | object  | Game definition from board-game-engine (for server-driven games). |
| `boardgameIOGame`   | object  | boardgame.io game config (alternative to `gameRules`). |
| `gameName`          | string  | Game name sent to server. |
| `boardgamePlayerID` | string  | Player id (e.g. `'0'`, `'1'`). |
| `numPlayers`        | number  | Number of players. |
| `debug`             | boolean | Enable debug logging. |
| `singlePlayer`      | boolean | If true, run locally without a server (default: `false`). |
| `enabled`           | boolean | If false, skip connecting (default: `true`). |

---

## Styles

Import the default styles so the game UI looks correct:

```js
import 'board-game-engine-react/dist/board-game-engine-react.css'
```

---

## Further reading

- **[board-game-engine](https://www.npmjs.com/package/board-game-engine)** — Game rules, state, `Client` options, and engine concepts.
