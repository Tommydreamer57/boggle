import React, { Component } from 'react';
import ResetBoard from './ResetBoard/ResetBoard';
import Board from './Board/Board';
import LeftButtons from './LeftButtons/LeftButtons';

export default function Left({ data, methods }) {
    const { resetBoard, handleDimensionChange, onKeyDown, updateBoard, handleClick, updatePath, addWord } = methods;
    const { dimension, path, board } = data;
    return (
        <div className="left" >
            <ResetBoard
                resetBoard={resetBoard}
                dimension={dimension}
                handleDimensionChange={handleDimensionChange}
                onKeyDown={onKeyDown}
                updateBoard={updateBoard}
            />
            <Board
                board={board}
                path={path}
                handleClick={handleClick}
            />
            <LeftButtons
                updatePath={updatePath}
                addWord={addWord}
            />
        </div>
    )
}

