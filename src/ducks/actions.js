import { connect } from 'react-redux';

// ACTION TYPES
export const ACTION_TYPES = {
    CLICK_LETTER: "CLICK_LETTER",
    RESET_BOARD: "RESET_BOARD",
    INPUT_WORD: "INPUT_WORD",
    RESET_PATH: "RESET PATH",
    ADD_WORD: "ADD_WORD",
    INPUT_SIZE: "INPUT_SIZE"
};

// ACTION CREATORS
export const actionCreators = (function (ACTION_TYPES) {
    const actionCreators = {};
    function camelCase(SNAKE_CASE) {
        return SNAKE_CASE.toLowerCase().replace(/(_)([a-z])/g, (match, p1, p2) => p2.toUpperCase());
    }
    for (let TYPE in ACTION_TYPES) {
        let type = camelCase(TYPE);
        actionCreators[type] = function (payload) { return { type, payload } }
    }
    return actionCreators;
})(ACTION_TYPES);

export const connectAll = connect(state => state, actionCreators);
