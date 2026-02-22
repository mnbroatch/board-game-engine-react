(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.BoardGameEngineReact = {}, global.React));
})(this, (function (exports, React) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

  const GameContext = /*#__PURE__*/React.createContext({
    clickTarget: () => {}
  });

  // do we need isSpectator
  function GameProvider({
    gameConnection,
    children,
    isSpectator
  }) {
    React.useEffect(() => {
      if (gameConnection.state._stateID === 0) {
        gameConnection.reset();
      }
    }, [gameConnection.state._stateID]);
    return /*#__PURE__*/React__default["default"].createElement(GameContext.Provider, {
      value: {
        clickTarget: target => {
          if (!isSpectator) {
            gameConnection.doStep(target);
          }
        },
        undoStep: () => {
          gameConnection.undoStep();
        },
        allClickable: gameConnection.optimisticWinner || isSpectator ? new Set() : gameConnection.allClickable,
        currentMoveTargets: gameConnection.optimisticWinner || isSpectator ? [] : gameConnection.moveBuilder.targets
      }
    }, children);
  }
  const useGame = () => React.useContext(GameContext);

  function Grid({
    grid
  }) {
    const {
      width,
      height,
      spaces
    } = grid.attributes;
    return /*#__PURE__*/React__default["default"].createElement("div", {
      className: "grid",
      style: {
        display: 'inline-grid',
        width: '100%',
        gridTemplateColumns: `repeat(${width}, 1fr)`,
        gridTemplateRows: `repeat(${height}, 1fr)`
      }
    }, spaces.map((space, index) => {
      return /*#__PURE__*/React__default["default"].createElement("div", {
        key: index,
        className: "grid__cell"
      }, /*#__PURE__*/React__default["default"].createElement(Entity, {
        entity: space
      }));
    }));
  }

  function Space({
    space
  }) {
    const {
      clickTarget,
      allClickable,
      currentMoveTargets
    } = useGame();
    const {
      entities,
      entityId
    } = space.attributes;
    const clickable = [...allClickable].map(e => e.entityId).includes(entityId);
    const targeted = currentMoveTargets?.map(e => e.entityId).includes(entityId);
    return /*#__PURE__*/React__default["default"].createElement("a", {
      className: ['space', clickable && 'space--clickable', targeted && 'space--targeted'].filter(Boolean).join(' '),
      onClick: () => clickTarget(space),
      style: {
        display: 'inline-block',
        flex: '1'
      }
    }, /*#__PURE__*/React__default["default"].createElement("div", {
      className: "space__entity-grid",
      style: {
        display: 'flex',
        height: '100%',
        width: '100%',
        flexWrap: 'wrap'
      }
    }, Array.from({
      length: entities.length
    }, (_, i) => /*#__PURE__*/React__default["default"].createElement("div", {
      className: "space__entity-grid__cell",
      style: {
        display: 'inline-block'
      },
      key: i
    }, /*#__PURE__*/React__default["default"].createElement(Entity, {
      entity: entities[i]
    }))), !entities.length && space.attributes.name));
  }

  function Entity({
    entity
  }) {
    const {
      clickTarget,
      allClickable
    } = useGame();
    const isClickable = allClickable.has(entity);
    const attributes = entity.attributes;
    switch (attributes.type) {
      case 'Grid':
        return /*#__PURE__*/React__default["default"].createElement(Grid, {
          grid: entity,
          isClickable: isClickable
        });
      case 'Space':
        return /*#__PURE__*/React__default["default"].createElement(Space, {
          space: entity,
          isClickable: isClickable
        });
      default:
        return /*#__PURE__*/React__default["default"].createElement("div", {
          onClick: e => {
            if (isClickable) {
              e.stopPropagation();
              clickTarget(entity);
            }
          },
          className: ['entity', attributes.player && `player-${attributes.player}`, allClickable.has(entity) && 'entity--clickable'].filter(Boolean).join(' ')
        }, entity.rule.displayProperties?.map((property, i) => /*#__PURE__*/React__default["default"].createElement("div", {
          key: i
        }, property, ": ", entity.attributes[property]?.toString())));
    }
  }

  function AbstractChoices() {
    const {
      clickTarget,
      allClickable,
      undoStep,
      currentMoveTargets
    } = useGame();
    const abstractChoices = [...allClickable].filter(c => c.abstract);

    // spacer assumes only one row of choices.
    // could save and store biggest height instead?
    return /*#__PURE__*/React__default["default"].createElement("div", {
      style: {
        position: 'relative'
      }
    }, /*#__PURE__*/React__default["default"].createElement("button", {
      style: {
        visibility: 'hidden'
      },
      className: "button button--style-b button--x-small abstract-choices__choice"
    }, "Spacer"), /*#__PURE__*/React__default["default"].createElement("div", {
      style: {
        position: 'absolute',
        top: 0,
        width: '100%'
      }
    }, !!currentMoveTargets.length && /*#__PURE__*/React__default["default"].createElement("button", {
      className: "button button--style-c button--x-small abstract-choices__choice abstract-choices__choice--undo",
      onClick: undoStep
    }, "Undo"), abstractChoices.map((choice, i) => /*#__PURE__*/React__default["default"].createElement("button", {
      key: i,
      className: "button button--style-b button--x-small abstract-choices__choice",
      onClick: () => clickTarget(choice)
    }, choice.value))));
  }

  function GameStatus({
    gameConnection
  }) {
    const players = gameConnection.client.matchData;
    const winner = gameConnection.state.ctx.gameover?.winner;
    const draw = gameConnection.state.ctx.gameover?.draw;
    let winnerString = '';
    if (draw) {
      winnerString = 'Draw!';
    } else if (players && winner) {
      winnerString = `${players[winner].name} Wins!`;
    } else if (winner) {
      winnerString = `Player ${winner} Wins!`;
    }
    return gameConnection.state.ctx.gameover && /*#__PURE__*/React__default["default"].createElement("div", {
      className: "game-status"
    }, winnerString);
  }

  function Game({
    gameConnection,
    loading,
    isSpectator
  }) {
    const G = gameConnection?.getState?.().state.G;
    return G ? /*#__PURE__*/React__default["default"].createElement(GameProvider, {
      gameConnection: gameConnection,
      isSpectator: isSpectator
    }, /*#__PURE__*/React__default["default"].createElement("div", {
      className: "game"
    }, /*#__PURE__*/React__default["default"].createElement(AbstractChoices, null), /*#__PURE__*/React__default["default"].createElement("div", {
      className: "shared-board",
      style: {
        width: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '1em'
      }
    }, G.sharedBoard.entities.map((entity, i) => /*#__PURE__*/React__default["default"].createElement(Entity, {
      key: i,
      entity: entity
    }))), G.personalBoards && /*#__PURE__*/React__default["default"].createElement("div", {
      className: "personal-boards"
    }, G.personalBoards.map((board, i) => /*#__PURE__*/React__default["default"].createElement("div", {
      key: i,
      className: "personal-board",
      style: {
        width: '100%',
        display: 'grid',
        gridAutoFlow: 'column',
        gridAutoRows: '1fr',
        gap: '1em'
      }
    }, board.entities.map((entity, j) => /*#__PURE__*/React__default["default"].createElement(Entity, {
      key: j,
      entity: entity
    }))))), /*#__PURE__*/React__default["default"].createElement(GameStatus, {
      gameConnection: gameConnection
    }))) : loading;
  }

  exports.Game = Game;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
