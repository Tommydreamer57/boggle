import React from 'react';

export default function Letter({ path, letter, handleClick }) {
    const { coordinates } = letter;
    let index = path.path.indexOf(letter) + 1;
    let last = path.endOfPath === letter;
    let used = path.path.includes(letter) && !last;
    let available = path.endOfPath.adjacentLetterObjects.includes(letter) && !used;
    return (
        <td className="cell" onClick={handleClick.bind(null, coordinates)} >
            <div className={`letter ${used ? 'used' : ''} ${available ? 'available' : ''} ${last ? 'last' : ''}`} >
                <div className="circle" >
                    {letter.value}
                    {
                        index ?
                            <div className="index" >{index}</div>
                            :
                            null
                    }
                </div>
            </div>
        </td>
    )
}
