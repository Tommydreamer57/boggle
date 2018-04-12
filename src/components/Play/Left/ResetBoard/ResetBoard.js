import React from 'react';

export default function ResetBoard({ dimension, resetBoard, handleDimensionChange, onKeyDown, updateBoard }) {
    return (
        <div className="buttons" >
            <button onClick={resetBoard} >RESET BOARD</button>
            <input
                type='number'
                min={3}
                max={9}
                value={dimension}
                onChange={handleDimensionChange}
                onKeyDown={onKeyDown}
            />
            <button onClick={updateBoard} >UPDATE BOARD</button>
        </div>
    )
}
