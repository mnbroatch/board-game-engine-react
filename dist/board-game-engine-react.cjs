var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.js
var index_exports = {};
__export(index_exports, {
  Client: () => import_board_game_engine2.Client,
  Game: () => Game,
  gameFactory: () => import_board_game_engine2.gameFactory,
  useGameserverConnection: () => useGameserverConnection
});
module.exports = __toCommonJS(index_exports);
var import_board_game_engine2 = require("board-game-engine");

// src/components/game/game.js
var import_react7 = __toESM(require("react"));

// src/components/entity/entity.js
var import_react4 = __toESM(require("react"));

// src/contexts/game-context.js
var import_react = __toESM(require("react"));
var import_jsx_runtime = require("react/jsx-runtime");
var GameContext = (0, import_react.createContext)({
  clickTarget: () => {
  }
});
function GameProvider({ gameConnection, children, isSpectator }) {
  (0, import_react.useEffect)(() => {
    if (gameConnection.state._stateID === 0) {
      gameConnection.reset();
    }
  }, [gameConnection.state._stateID]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameContext.Provider, { value: {
    clickTarget: (target) => {
      if (!isSpectator) {
        gameConnection.doStep(target);
      }
    },
    undoStep: () => {
      gameConnection.undoStep();
    },
    allClickable: gameConnection.optimisticWinner || isSpectator ? /* @__PURE__ */ new Set() : gameConnection.allClickable,
    currentMoveTargets: gameConnection.optimisticWinner || isSpectator ? [] : gameConnection.moveBuilder.targets
  }, children });
}
var useGame = () => (0, import_react.useContext)(GameContext);

// src/components/board/grid.js
var import_react2 = __toESM(require("react"));
var import_jsx_runtime2 = require("react/jsx-runtime");
function Grid({ grid }) {
  const { width, height, spaces } = grid.attributes;
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    "div",
    {
      className: "grid",
      style: {
        display: "inline-grid",
        width: "100%",
        gridTemplateColumns: `repeat(${width}, 1fr)`,
        gridTemplateRows: `repeat(${height}, 1fr)`
      },
      children: spaces.map((space, index) => {
        return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "div",
          {
            className: "grid__cell",
            children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Entity, { entity: space })
          },
          index
        );
      })
    }
  );
}

// src/components/space/space.js
var import_react3 = __toESM(require("react"));
var import_jsx_runtime3 = require("react/jsx-runtime");
function Space({ space }) {
  const { clickTarget, allClickable, currentMoveTargets } = useGame();
  const { entities, entityId } = space.attributes;
  const clickable = allClickable.has(space);
  const targeted = currentMoveTargets?.map((e) => e.entityId).includes(entityId);
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
    "a",
    {
      className: [
        "space",
        clickable && "space--clickable",
        targeted && "space--targeted"
      ].filter(Boolean).join(" "),
      onClick: () => clickTarget(space),
      style: {
        display: "inline-block",
        flex: "1"
      },
      children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
        "div",
        {
          className: "space__entity-grid",
          style: {
            display: "flex",
            height: "100%",
            width: "100%",
            flexWrap: "wrap"
          },
          children: [
            Array.from({ length: entities.length }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
              "div",
              {
                className: "space__entity-grid__cell",
                style: {
                  display: "inline-block"
                },
                children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Entity, { entity: entities[i] })
              },
              i
            )),
            !entities.length && space.attributes.name
          ]
        }
      )
    }
  );
}

// src/components/entity/entity.js
var import_jsx_runtime4 = require("react/jsx-runtime");
function Entity({ entity }) {
  const { clickTarget, allClickable } = useGame();
  const isClickable = allClickable.has(entity);
  const attributes = entity.attributes;
  const entityType = attributes.entityType ?? attributes.type;
  switch (entityType) {
    case "Grid":
      return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Grid, { grid: entity, isClickable });
    case "Space":
      return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Space, { space: entity, isClickable });
    default:
      return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
        "div",
        {
          onClick: (e) => {
            if (isClickable) {
              e.stopPropagation();
              clickTarget(entity);
            }
          },
          className: [
            "entity",
            attributes.player && `player-${attributes.player}`,
            isClickable && "entity--clickable"
          ].filter(Boolean).join(" "),
          children: entity.rule.displayProperties?.map((property, i) => /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { children: [
            property,
            ": ",
            entity.attributes[property]?.toString()
          ] }, i))
        }
      );
  }
}

// src/components/abstract-choices/abstract-choices.js
var import_react5 = __toESM(require("react"));
var import_jsx_runtime5 = require("react/jsx-runtime");
function AbstractChoices() {
  const { clickTarget, allClickable, undoStep, currentMoveTargets } = useGame();
  const abstractChoices = [...allClickable].filter((c) => c.abstract);
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { style: { position: "relative" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
      "button",
      {
        style: { visibility: "hidden" },
        className: "button button--style-b button--x-small abstract-choices__choice",
        children: "Spacer"
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
      "div",
      {
        style: {
          position: "absolute",
          top: 0,
          width: "100%"
        },
        children: [
          !!currentMoveTargets.length && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
            "button",
            {
              className: "button button--style-c button--x-small abstract-choices__choice abstract-choices__choice--undo",
              onClick: undoStep,
              children: "Undo"
            }
          ),
          abstractChoices.map((choice, i) => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
            "button",
            {
              className: "button button--style-b button--x-small abstract-choices__choice",
              onClick: () => clickTarget(choice),
              children: choice.value
            },
            i
          ))
        ]
      }
    )
  ] });
}

// src/components/game-status/game-status.js
var import_react6 = __toESM(require("react"));
var import_jsx_runtime6 = require("react/jsx-runtime");
function GameStatus({ gameConnection }) {
  const players = gameConnection.client.matchData;
  const winner = gameConnection.state.ctx.gameover?.winner;
  const draw = gameConnection.state.ctx.gameover?.draw;
  let winnerString = "";
  if (draw) {
    winnerString = "Draw!";
  } else if (players && winner) {
    winnerString = `${players[winner].name} Wins!`;
  } else if (winner) {
    winnerString = `Player ${winner} Wins!`;
  }
  return gameConnection.state.ctx.gameover && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "game-status", children: winnerString });
}

// src/components/game/game.js
var import_jsx_runtime7 = require("react/jsx-runtime");
function Game({ gameConnection, loading, isSpectator }) {
  const G = gameConnection?.state?.G;
  return G ? /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
    GameProvider,
    {
      gameConnection,
      isSpectator,
      children: /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "game", children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(AbstractChoices, {}),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
          "div",
          {
            className: "shared-board",
            style: {
              width: "100%",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
              gap: "1em"
            },
            children: G.sharedBoard.entities.map((entity, i) => /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(Entity, { entity }, i))
          }
        ),
        G.personalBoards && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "personal-boards", children: G.personalBoards.map((board, i) => /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
          "div",
          {
            className: "personal-board",
            style: {
              width: "100%",
              display: "grid",
              gridAutoFlow: "column",
              gridAutoRows: "1fr",
              gap: "1em"
            },
            children: board.entities.map((entity, j) => /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(Entity, { entity }, j))
          },
          i
        )) }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(GameStatus, { gameConnection })
      ] })
    }
  ) : loading;
}

// src/use-gameserver-connection.js
var import_react8 = require("react");
var import_board_game_engine = require("board-game-engine");
var useGameserverConnection = ({
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
  enabled = true
}) => {
  const [_, forceUpdate] = (0, import_react8.useReducer)((x) => x + 1, 0);
  const [connection, setConnection] = (0, import_react8.useState)(null);
  (0, import_react8.useEffect)(() => {
    if (!gameRules && !boardgameIOGame || credentials && !(matchID && enabled && server)) {
      return;
    }
    const options = {
      server,
      numPlayers,
      onClientUpdate: () => {
        forceUpdate();
      },
      debug,
      matchID,
      gameRules,
      boardgameIOGame,
      gameName,
      playerID,
      credentials,
      multiplayer
    };
    const newConnection = new import_board_game_engine.Client(options);
    newConnection.connect();
    setConnection(newConnection);
    return () => {
      connection?.client?.stop();
      setConnection(null);
    };
  }, [
    matchID,
    server,
    playerID,
    credentials,
    gameRules,
    boardgameIOGame,
    enabled,
    multiplayer
  ]);
  if (connection) {
    return Object.assign(
      connection,
      connection?.getState?.()
    );
  } else {
    return {};
  }
};
