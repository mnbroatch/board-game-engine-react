import React from 'react'
import { useGame } from "../contexts/game-context.js";

export default function AbstractChoices () {
  const { clickTarget, allClickable, undoStep, currentMoveTargets } = useGame()

  const abstractChoices = [...allClickable].filter(c => c.abstract)

  // spacer assumes only one row of choices.
  // could save and store biggest height instead?
  return (
    <div style={{ position: 'relative' }}>
      <button
        style={{visibility: 'hidden'}}
        className="button button--style-b button--x-small abstract-choices__choice"
      >
        Spacer
      </button>
      <div
        style={{
          position: 'absolute',
          top: 0,
          width: '100%',
        }}>
        {!!currentMoveTargets.length && (
          <button
            className="button button--style-c button--x-small abstract-choices__choice abstract-choices__choice--undo"
            onClick={undoStep}
          >
            Undo
          </button>
        )}
        {abstractChoices.map((choice, i) => (
          <button
            key={i}
            className="button button--style-b button--x-small abstract-choices__choice"
            onClick={() => clickTarget(choice)}
          >
            {choice.value}
          </button>
        ))}
      </div>
    </div>
  )
}
