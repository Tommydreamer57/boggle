import React, { Component } from 'react';
import AddWord from './AddWord/AddWord';
import WordList from './WordList/WordList';
import RightButtons from './RightButtons/RightButtons';

export default function Right({ data, methods }) {
    const { handleInputChange, onKeyDown, addWord, updatePath, validateWords, resetValidations } = methods;
    const { input, words, validating } = data;
    return (
        <div className="right">
            <AddWord
                input={input}
                handleInputChange={handleInputChange}
                onKeyDown={onKeyDown}
                addWord={addWord}
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

