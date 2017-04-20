import React, {Component} from 'react';
import { Action } from '../../actions';
import GoogleMap from './GoogleMap';
import LngLat, {GPSType} from './LngLat';
import {MapOperationType} from './constant';


/**********************************************************
 * Fence
 **********************************************************/
class Fence {

    constructor(map, type, callback) {
        this.map = map;
        this.type = type;
        this.callback = callback;
        this.points = new Array();
        this.listener = null;

        map.clearoverlays();
        this.map.setOperation(MapOperationType.Fence);
    }

    draw() {
        const self = this;
        this.map.drawCircle({
            fillColor: '#FF99FF',
            fillOpacity: 0.5,
            strokeColor: "#FF33FF",
            strokeWeight: 2,
            clickable: false,
            zIndex: 1,
            editable: false
        }, (center, radius) => {
            console.log(center, radius);
            self.end();
        });
    }

    end() {
        this.callback();
    }

    cancel() {}

}


/**********************************************************
 * ReactMap @Component
 **********************************************************/
export default class ReactMap extends Component {

    constructor(props) {
        super(props);
        this.state = {};

        this.map = null;
        this.timer = null;
        this.operationType = MapOperationType.Normal;

        this.followingMode = false;

        this.actions = {};
        this.actions[Action.Map.Init] = () => {
            this.map.init();
        };

        this.actions[Action.Map.Destory] = () => {};

        this.actions[Action.Map.AddMarker] = (lnglat) => {
            // // this.map.addCar(lnglat);
            // // this.map.addPoint(lnglat);
            // // this.map.addCircle(lnglat, 100);
            //
            // let lnglat2 = new LngLat(GPSType.GCJ02, 118.79278, 32.04155);
            // let lnglat3 = new LngLat(GPSType.GCJ02, 118.79278, 32.05155);
            // // this.map.addPolyline([lnglat, lnglat2, lnglat3]);
            // // this.map.addPoints([lnglat, lnglat2, lnglat3]);
            // this.map.addRectangle(lnglat, lnglat3);
            // // this.map.fitview([lnglat, lnglat2, lnglat3]);
            // this.map.center(lnglat);
            // console.log(this.map.distance(lnglat, lnglat3));
            //
            // const self = this;
            // setTimeout(() => {
            //     self.map.clearoverlays()
            // }, 3000);
            //
            // this.map.setOperation(MapOperationType.Fence);
        };

        this.actions[Action.Map.ClearOverlays] = () => {
            clearInterval(this.timer)
            this.map.clearoverlays();
        }

    }

    componentDidUpdate() {
        console.log('ReactMap.componentDidUpdate')
        const { action } = this.props;
        if (action && this.actions[action.func])
            this.actions[action.func](action.args);
        else
            console.log("unknow func");
    }

    componentDidMount() {
        this.map = new GoogleMap('map');

    }

    render() {
        return null;
    }
}
