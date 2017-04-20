const Action = {
    Map: {
        Init: '',
        Destory: '',
        AddMarker: '',
        ClearOverlays: '',
    },
    StatusBar: {
        Update: '',
        Show: '',
        Hide: '',
    },
    NavBar: {
        UserSelected: '',
    },
}

const _Action = Action;
Object.keys(_Action).forEach(category => {
    Object.keys(_Action[category]).forEach(actionType => {
        _Action[category][actionType] = category + '.' + actionType;
    });
});

export default Action