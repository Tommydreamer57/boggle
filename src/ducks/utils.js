
export function createActions(ACTION_TYPES) {
    const actionCreators = {};
    function camelCase(SNAKE_CASE) {
        return SNAKE_CASE.toLowerCase().replace(/(_)([a-z])/g, (match, p1, p2) => p2.toUpperCase());
    }
    for (let TYPE in ACTION_TYPES) {
        let type = camelCase(TYPE);
        actionCreators[type] = function (payload) { return { type, payload } }
    }
    return actionCreators;
}

export default {};
