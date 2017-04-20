import Action from './type';
export { Action };

import API from './api';
export { API };

export function select_user(user) {
    console.log('selectUser');
    return {
        type: Action.NavBar.UserSelected,
        activeUser: user
    }
}

export function map_init() {
    console.log('init');
    return {
        type: Action.Map.Init
    }
}

export function map_destory() {
    console.log('destory');
    return {
        type: Action.Map.Destory
    }
}

export function map_add_marker(args) {
    console.log('addMarker');
    return {
        type: Action.Map.AddMarker,
        args,
    }
}

export function map_clear_overlays(args) {
    console.log('clearOverlays');
    return {
        type: Action.Map.ClearOverlays,
        args,
    }
}

export function status_bar_show() {
    return {
        type: Action.StatusBar.Show,
        visible: true
    }
}

export function status_bar_hide() {
    return {
        type: Action.StatusBar.Hide,
        visible: false
    }
}

export function status_bar_refresh(location) {
    return {
        type: Action.StatusBar.Update,
        visible: true,
        location
    }
}

