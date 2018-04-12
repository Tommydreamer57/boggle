import React from 'react';

export default function User({ user, handleUserChange }) {

    return (
        <div className="user" >
            <input value={user.name} placeholder="Please enter your name" onChange={handleUserChange.bind(null, 'name')} />
        </div >
    )
}