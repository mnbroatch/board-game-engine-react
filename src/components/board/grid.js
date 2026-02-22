import React from 'react';
import Entity from "../entity/entity.js";

export default function Grid ({ grid }) {
  const { width, height, spaces } = grid.attributes;
  return (
    <div
      className="grid"
      style={{ 
        display: 'inline-grid',
        width: '100%',
        gridTemplateColumns: `repeat(${width}, 1fr)`,
        gridTemplateRows: `repeat(${height}, 1fr)`,
      }}
    >
      {spaces.map((space, index) => {
        return (
          <div
            key={index}
            className="grid__cell"
          >
            <Entity entity={space} />
          </div>
        );
      })}
    </div>
  );
}
