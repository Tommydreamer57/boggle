import React from 'react';

export default function Wait({ enterGame, storeHistory, history }) {
    storeHistory(history);
    return (
        <div className="Wait" >
            <button onClick={enterGame} >START GAME</button>
        </div>
    )
}
