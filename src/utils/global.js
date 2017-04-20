import './global.css'
import { map_init } from '../actions'


window._storage_ = {
    dispatch: null,
    onMapLoaded: () => { window._storage_.dispatch(map_init()) },
    loginUser: {
        "uname": "name",
        "nickname": "nickname",
        "id": 2,
        "isEnabled": 1,
        "lastLoginIP": null,
        "lastLoginTime": null,
        "registerTime": "2016-05-26 02:08:01",
        "type": 1,
    },
};

window.concat = (function () {
    // concat arr1 and arr2 without duplication.
    const concat_ = function (arr1, arr2) {
        for (var i = arr2.length - 1; i >= 0; i--) {
            if (arr2[i] === undefined || arr2[i] === null) {
                continue;
            }
            arr1.indexOf(arr2[i]) === -1 ? arr1.push(arr2[i]) : 0;
        }
    };

    // concat arbitrary arrays.
    // Instead of alter supplied arrays, return a new one.
    return function (arr) {
        var result = arr.slice();
        for (var i = arguments.length - 1; i >= 1; i--) {
            concat_(result, arguments[i]);
        }
        return result;
    };
}());


