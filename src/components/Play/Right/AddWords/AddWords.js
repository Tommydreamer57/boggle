import React, { Component } from 'react';

export default function AddWords(props) {
    return (
        <div className="header" >
            {/* <h3>ADD WORDS HERE</h3> */}
            <input
                placeholder="Type a word here..."
                value={props.input}
                onChange={props.handleInputChange}
                onKeyDown={props.onKeyDown}
            />
            <button onClick={props.addWords} >ADD WORD</button>
        </div>
    )
}
