import React, { Component } from 'react';
import ResetBoard from './ResetBoard/ResetBoard';
import Board from './Board/Board';
import LeftButtons from './LeftButtons/LeftButtons';

export default function Left({ data, methods }) {
    const { resetBoard, handleDimensionChange, onKeyDown, updateBoard, handleClick, updatePath, addWords } = methods;
    const { dimension, path, board, gameid, startTime } = data;
    return (
        <div className="left" >
            <ResetBoard
                gameid={gameid}
                resetBoard={resetBoard}
                dimension={dimension}
                handleDimensionChange={handleDimensionChange}
                onKeyDown={onKeyDown}
                updateBoard={updateBoard}
                startTime={startTime}
            />
            <Board
                board={board}
                path={path}
                handleClick={handleClick}
            />
            <LeftButtons
                updatePath={updatePath}
                addWords={addWords}
            />
        </div>
    )
}

