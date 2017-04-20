import './utils/global';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'
import { createLogger } from 'redux-logger';
import ReactContainer from './containers/tracking';
import appReducers from './reducers';

const logger = createLogger();

let store = createStore(
    appReducers,
    applyMiddleware(logger)
);
window._storage_.dispatch = store.dispatch;

ReactDOM.render(
    <Provider store={store}>
        <ReactContainer />
    </Provider>,
    document.getElementById('root')
);
