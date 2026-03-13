import React from 'react'
import { useGame } from "../../contexts/game-context.js";
import Grid from '../board/grid.js'
import Space from "../space/space.js";

function sameEntity (a, b) {
  const idA = a.entityId ?? a.attributes?.entityId
  const idB = b.entityId ?? b.attributes?.entityId
  return idA != null && idB != null && idA === idB
}

export default function Entity ({ entity }) {
  const { clickTarget, allClickable } = useGame()
  const isClickable = [...allClickable].some(c => sameEntity(c, entity))
  const attributes = entity.attributes
  const entityType = attributes.entityType ?? attributes.type

  switch (entityType) {
    case 'Grid':
      return <Grid grid={entity} isClickable={isClickable} />
    case 'Space':
      return <Space space={entity} isClickable={isClickable} />
    default:
      return <div
        onClick={(e) => {
          if (isClickable) {
            e.stopPropagation()
            clickTarget(entity)
          }
        }}
        className={[
          'entity',
          attributes.player && `player-${attributes.player}`,
          isClickable && 'entity--clickable',
        ].filter(Boolean).join(' ')}
      >
        {entity.rule.displayProperties?.map((property, i) => (
          <div key={i}>
            {property}: {(entity.attributes[property])?.toString()}
          </div>
        ))}
      </div>
  }
}
