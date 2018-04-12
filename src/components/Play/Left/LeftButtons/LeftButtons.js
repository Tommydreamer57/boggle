import React from 'react';

export default function LeftButtons({ updatePath, addWord }) {
    return (
        <div className="buttons" >
            <button onClick={updatePath} >RESET PATH</button>
            {/* <h3>
                {
                    path.map(letter => letter.value.toUpperCase())
                }
            </h3> */}
            <button onClick={addWord} >ADD WORD</button>
        </div>
    )
}
