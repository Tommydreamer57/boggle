import { ACTION_TYPES as AT } from './actions';

// INITIAL STATE
const initialGame = {

}

// REDUCER
export default function reduce(game = initialGame, action) {
    console.log(game);
    console.log(action);
    switch (action.type) {
        case AT.CLICK_LETTER:
            return { ...game };
            break;
        case AT.RESET_BOARD:
            return { ...game };
            break;
        case AT.INPUT_WORD:
            return { ...game };
            break;
        case AT.RESET_PATH:
            return { ...game };
            break;
        case AT.ADD_WORD:
            return { ...game };
            break;
        case AT.INPUT_SIZE:
            return { ...game };
            break;
        default:
            return { ...game };
    }
}
