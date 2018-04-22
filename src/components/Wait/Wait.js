import React from 'react';

export default function Wait({ startGame, registerHistory, history, match, user, joinedGame, joinGame }) {
    const { params } = match;
    if (params.gameid && !joinedGame.board.length) joinGame(params.gameid);
    registerHistory({ history, params });
    return (
        <div className="Wait" >
            <div className="game" >PLAYING AS: {user.name}</div>
            <div className="game" >GAME BELONGS TO: {joinedGame.user && joinedGame.user.name}</div>
            <button onClick={startGame} >START GAME</button>
            {
                joinedGame.players &&
                joinedGame.players.map(player => (<div className="game" >{player.name}</div>))
            }
        </div>
    )
}
