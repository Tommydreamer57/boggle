import React from 'react';
import { Link } from 'react-router-dom';

export default function Modal({ style, className, text, to, type, clicks }) {
    if (!Array.isArray(text)) text = [text];
    if (!Array.isArray(to)) to = [to];
    if (!Array.isArray(clicks)) clicks = [];

    let Wrapper = Link;

    if (type === 'select') Wrapper = props => <p {...props} >{props.children}</p>

    return (
        <button style={style} className={className} >
            <div className="link-shadow" />
            {
                text.map((item, i) => (
                    <Wrapper key={`MODAL BUTTON ${item}`} to={to[i]} onClick={clicks[i] || (() => { })} >
                        {item}
                    </Wrapper>
                ))
            }
        </button >
    )
}