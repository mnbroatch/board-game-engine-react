import React, { createContext, useContext, useEffect } from 'react';

const GameContext = createContext({
  clickTarget: () => {},
});

// do we need isSpectator
export function GameProvider({ gameConnection, children, isSpectator }) {
  useEffect(() => {
    if (gameConnection.state._stateID === 0) {
      gameConnection.reset()
    }
  }, [gameConnection.state._stateID]);

  return (
    <GameContext.Provider value={{
      clickTarget: target => {
        if (!isSpectator) {
          gameConnection.doStep(target)
        }
      },
      undoStep: () => { gameConnection.undoStep() },
      allClickable: (gameConnection.optimisticWinner || isSpectator)
        ? new Set()
        : gameConnection.allClickable,
      currentMoveTargets: (gameConnection.optimisticWinner || isSpectator)
        ? []
        : gameConnection.moveBuilder.targets,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => useContext(GameContext);
