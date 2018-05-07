import { createStore, combineReducers } from 'redux';
import game from './game';

export default createStore(combineReducers({ game }));
