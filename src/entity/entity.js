import React from 'react'
import { useGame } from "../../contexts/game-context.js";
import Grid from '../board/grid.js'
import Space from "../space/space.js";

export default function Entity ({ entity }) {
  const { clickTarget, allClickable } = useGame()
  const isClickable = allClickable.has(entity)
  const attributes = entity.attributes

  switch (attributes.type) {
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
          allClickable.has(entity) && 'entity--clickable',
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
