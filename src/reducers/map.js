import { Action } from '../actions'


const initialState = {
    action: null,
}

export default (state = initialState, action) => {
    if (Object.values(Action.Map).indexOf(action.type) >= 0) {
        return {
            ...state,
            action: {
                func: action.type,
                args: action.args
            }
        };
    } else {
        return state;
    }
};
