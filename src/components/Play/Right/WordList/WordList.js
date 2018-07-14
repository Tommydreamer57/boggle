import React, { Component } from 'react';

export default function WordList({ path, words, validating, updatePath }) {
    return (
        <div className={`body ${validating ? 'validating' : ''}`} >
            {
                !words.length ?
                    <button className="word" >Your words will show up here...</button>
                    :
                    null
            }
            {
                words.map((word, i) => {
                    let { selected, valid, tested, defined, value } = word;
                    // console.log(selected, valid, tested, defined);
                    return (
                        <button
                            key={`WORD: ${value}`}
                            className={`word ${valid ? 'valid' : 'invalid'} ${selected ? 'selected' : ''} ${defined ? 'defined' : 'undefined'} ${tested ? '' : 'untested'}`}
                            onClick={updatePath.bind(null, word)}
                        >
                            {`${word.value.toUpperCase()} (${word.validations.length})${word.validations.indexOf(path) + 1 ? ` - (${(word.validations.indexOf(path) + 1)})` : ''}`}
                        </button>
                    )
                })
            }
        </div>
    )
}
