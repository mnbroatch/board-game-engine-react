import React from 'react';
import { useGame } from "../../contexts/game-context.js";
import Entity from '../entity/entity.js'

function calculateOptimalCols(numSquares) {
  if (numSquares === 0) return 1;
  
  let bestCols = 1;
  let bestAspectRatio = Infinity;
  
  for (let cols = 1; cols <= numSquares; cols++) {
    const rows = Math.ceil(numSquares / cols);
    const aspectRatio = Math.abs(cols - rows);
    
    if (aspectRatio < bestAspectRatio) {
      bestAspectRatio = aspectRatio;
      bestCols = cols;
    }
  }
  
  return bestCols;
}

export default function Space ({ space }) {
  const { clickTarget, allClickable, currentMoveTargets } = useGame()
  const { entities, entityId } = space.attributes

  const clickable = [...allClickable].map(e => e.entityId).includes(entityId)
  const targeted = currentMoveTargets?.map(e => e.entityId).includes(entityId)

  return (
    <a
      className={[
        'space',
        clickable && 'space--clickable',
        targeted && 'space--targeted'
      ].filter(Boolean).join(' ')}
      onClick={() => clickTarget(space)}
      style={{
        display: 'inline-block',
        flex: '1',
      }}
    >
       <div 
          className="space__entity-grid"
          style={{
            display: 'flex',
            height: '100%',
            width: '100%',
            flexWrap: 'wrap',
          }}
        >
          {Array.from({ length: entities.length }, (_, i) => (
            <div
              className="space__entity-grid__cell"
              style={{
                display: 'inline-block',
              }}
              key={i}
            >
              <Entity entity={entities[i]} />
            </div>
          ))}
          {!entities.length && space.attributes.name}
        </div>
    </a>
  );
}
