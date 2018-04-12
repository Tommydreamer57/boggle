import React from 'react';
import Letter from './Letter/Letter';

export default function Board({ path, board, handleClick }) {
    return (
        <table id="board" >
            <tbody className="board" >
                {
                    board.map((row, y) => (
                        <tr key={`Row: ${y}`} className="row" >
                            {
                                row.map((letter, x) => (
                                    <Letter key={`Letter: X: ${x}, Y: ${y}`} letter={letter} path={path} handleClick={handleClick} />
                                ))
                            }
                        </tr>
                    ))
                }
            </tbody>
        </table>
    )
}
