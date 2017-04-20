import { Action } from '../actions'


const { loginUser } = window._storage_


const initialState = {
    user: loginUser,
    location: null,
}

export default (state = initialState, action) => {
    switch (action.type) {
    case Action.NavBar.UserSelected:
        return {
            ...state,
            user: action.user
        };

    case Action.StatusBar.Update:
        return {
            ...state,
            location: action.location
        };

    default:
        return state;
    }
};
