import React, { Component } from 'react';
import AddWords from './AddWords/AddWords';
import WordList from './WordList/WordList';
import RightButtons from './RightButtons/RightButtons';

export default function Right({ data, methods }) {
    const { handleInputChange, onKeyDown, addWords, updatePath, validateWords, resetValidations } = methods;
    const { input, words, validating } = data;
    return (
        <div className="right">
            <AddWords
                input={input}
                handleInputChange={handleInputChange}
                onKeyDown={onKeyDown}
                addWords={addWords}
            />
            <WordList
                validating={validating}
                words={words}
                updatePath={updatePath}
            />
            <RightButtons
                validateWords={validateWords}
                resetValidations={resetValidations}
            />
        </div>
    )
}

