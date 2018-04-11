import React from 'react';

export default function RightButtons({ validateWords, resetValidations }) {
    return (
        <div className="right-buttons" >
            <button onClick={validateWords} >VALIDATE WORDS</button>
            <button onClick={resetValidations} >RESET VALIDATIONS</button>
        </div>
    )
}
