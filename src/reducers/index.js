import { combineReducers } from 'redux';
import view from './view'
import modal from './modal'
import map from './map'

const appReducers = combineReducers({
    view,
    modal,
    map
});

export default appReducers;
