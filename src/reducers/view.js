import { Action } from '../actions'


const initialState = {
    statusBarVisible: false,
}

export default (state = initialState, action) => {
    switch (action.type) {
    case Action.StatusBar.Show:
    case Action.StatusBar.Update:
        return {
            ...state,
            statusBarVisible: true,
        }

    case Action.StatusBar.Hide:
        return {
            ...state,
            statusBarVisible: false,
        }

    default:
        return state;
    }
};
