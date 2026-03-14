// src/index.js
import * as BoardGameEngine2 from "board-game-engine";

// src/components/game/game.js
import React7 from "react";

// src/components/entity/entity.js
import React4 from "react";

// src/contexts/game-context.js
import React, { createContext, useContext, useEffect } from "react";
import { jsx } from "react/jsx-runtime";
var GameContext = createContext({
  clickTarget: () => {
  }
});
function GameProvider({ gameConnection, children, isSpectator }) {
  useEffect(() => {
    if (gameConnection.state._stateID === 0) {
      gameConnection.reset();
    }
  }, [gameConnection.state._stateID]);
  return /* @__PURE__ */ jsx(GameContext.Provider, { value: {
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
var useGame = () => useContext(GameContext);

// src/components/board/grid.js
import React2 from "react";
import { jsx as jsx2 } from "react/jsx-runtime";
function Grid({ grid }) {
  const { width, height, spaces } = grid.attributes;
  return /* @__PURE__ */ jsx2(
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
        return /* @__PURE__ */ jsx2(
          "div",
          {
            className: "grid__cell",
            children: /* @__PURE__ */ jsx2(Entity, { entity: space })
          },
          index
        );
      })
    }
  );
}

// src/components/space/space.js
import React3 from "react";
import { jsx as jsx3, jsxs } from "react/jsx-runtime";
function Space({ space }) {
  const { clickTarget, allClickable, currentMoveTargets } = useGame();
  const { entities, entityId } = space.attributes;
  const clickable = allClickable.has(space);
  const targeted = currentMoveTargets?.map((e) => e.entityId).includes(entityId);
  return /* @__PURE__ */ jsx3(
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
      children: /* @__PURE__ */ jsxs(
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
            Array.from({ length: entities.length }, (_, i) => /* @__PURE__ */ jsx3(
              "div",
              {
                className: "space__entity-grid__cell",
                style: {
                  display: "inline-block"
                },
                children: /* @__PURE__ */ jsx3(Entity, { entity: entities[i] })
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
import { jsx as jsx4, jsxs as jsxs2 } from "react/jsx-runtime";
function Entity({ entity }) {
  const { clickTarget, allClickable } = useGame();
  const isClickable = allClickable.has(entity);
  const attributes = entity.attributes;
  const entityType = attributes.entityType ?? attributes.type;
  switch (entityType) {
    case "Grid":
      return /* @__PURE__ */ jsx4(Grid, { grid: entity, isClickable });
    case "Space":
      return /* @__PURE__ */ jsx4(Space, { space: entity, isClickable });
    default:
      return /* @__PURE__ */ jsx4(
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
          children: entity.rule.displayProperties?.map((property, i) => /* @__PURE__ */ jsxs2("div", { children: [
            property,
            ": ",
            entity.attributes[property]?.toString()
          ] }, i))
        }
      );
  }
}

// src/components/abstract-choices/abstract-choices.js
import React5 from "react";
import { jsx as jsx5, jsxs as jsxs3 } from "react/jsx-runtime";
function AbstractChoices() {
  const { clickTarget, allClickable, undoStep, currentMoveTargets } = useGame();
  const abstractChoices = [...allClickable].filter((c) => c.abstract);
  return /* @__PURE__ */ jsxs3("div", { style: { position: "relative" }, children: [
    /* @__PURE__ */ jsx5(
      "button",
      {
        style: { visibility: "hidden" },
        className: "button button--style-b button--x-small abstract-choices__choice",
        children: "Spacer"
      }
    ),
    /* @__PURE__ */ jsxs3(
      "div",
      {
        style: {
          position: "absolute",
          top: 0,
          width: "100%"
        },
        children: [
          !!currentMoveTargets.length && /* @__PURE__ */ jsx5(
            "button",
            {
              className: "button button--style-c button--x-small abstract-choices__choice abstract-choices__choice--undo",
              onClick: undoStep,
              children: "Undo"
            }
          ),
          abstractChoices.map((choice, i) => /* @__PURE__ */ jsx5(
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
import React6 from "react";
import { jsx as jsx6 } from "react/jsx-runtime";
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
  return gameConnection.state.ctx.gameover && /* @__PURE__ */ jsx6("div", { className: "game-status", children: winnerString });
}

// src/components/game/game.js
import { jsx as jsx7, jsxs as jsxs4 } from "react/jsx-runtime";
function Game({ gameConnection, loading, isSpectator }) {
  const G = gameConnection?.state?.G;
  return G ? /* @__PURE__ */ jsx7(
    GameProvider,
    {
      gameConnection,
      isSpectator,
      children: /* @__PURE__ */ jsxs4("div", { className: "game", children: [
        /* @__PURE__ */ jsx7(AbstractChoices, {}),
        /* @__PURE__ */ jsx7(
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
            children: G.sharedBoard.entities.map((entity, i) => /* @__PURE__ */ jsx7(Entity, { entity }, i))
          }
        ),
        G.personalBoards && /* @__PURE__ */ jsx7("div", { className: "personal-boards", children: G.personalBoards.map((board, i) => /* @__PURE__ */ jsx7(
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
            children: board.entities.map((entity, j) => /* @__PURE__ */ jsx7(Entity, { entity }, j))
          },
          i
        )) }),
        /* @__PURE__ */ jsx7(GameStatus, { gameConnection })
      ] })
    }
  ) : loading;
}

// src/use-gameserver-connection.js
import { useEffect as useEffect2, useReducer, useState } from "react";
import * as BoardGameEngine from "board-game-engine";
var Client2 = BoardGameEngine.Client;
var useGameserverConnection = ({
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
  enabled = true
}) => {
  const [_, forceUpdate] = useReducer((x) => x + 1, 0);
  const [connection, setConnection] = useState(null);
  useEffect2(() => {
    if (!gameRules && !boardgameIOGame || !singlePlayer && (!gameId || !clientToken || !enabled || !server)) return;
    const options = {
      server,
      numPlayers,
      onClientUpdate: () => {
        forceUpdate();
      },
      debug,
      gameId,
      gameRules,
      boardgameIOGame,
      gameName,
      boardgamePlayerID,
      clientToken,
      singlePlayer
    };
    const newConnection = new Client2(options);
    newConnection.connect();
    setConnection(newConnection);
    return () => {
      connection?.client?.stop();
      setConnection(null);
    };
  }, [gameId, boardgamePlayerID, clientToken, gameRules, boardgameIOGame, enabled]);
  if (connection) {
    return Object.assign(
      connection,
      connection?.getState?.()
    );
  } else {
    return {};
  }
};

// src/index.js
var Client4 = BoardGameEngine2.Client;
export {
  Client4 as Client,
  Game,
  useGameserverConnection
};
