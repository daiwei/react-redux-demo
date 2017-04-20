import LngLat, { GPSType } from './LngLat'
import { MapOperationType } from './constant';
import $ from 'jquery'
import { map_clear_overlays } from '../../actions';

class InfoWindow {

    constructor() {
        this.show = false;
        this.mouseover = false;
        this.timeout = null;
        this.longTimeout = null;

        this.instance = new google.maps.InfoWindow({
            pixelOffset: new google.maps.Size(0, -3, "px", "px")
        });

        this.instance.close();

        const self = this;
        google.maps.event.addListener(this.instance, 'domready', function(e) {
            self.show = true;
        });

        google.maps.event.addListener(this.instance, 'closeclick', function(e) {
            self.show = false;
            self.timeout = null;
        });
    }

    open(marker, isCar) {
        isCar = isCar || false;
        if (isCar) {
            this.instance.setOptions({
                pixelOffset: new google.maps.Size(0, 6, "px", "px")
            });
        } else {
            this.instance.setOptions({
                pixelOffset: new google.maps.Size(0, -3, "px", "px")
            });
        }

        if (this.mouseover === false) {
            return;
        }
        this.clearTimeout();
        this.instance.open(this.instance, marker);
        this.show = true;
    }

    close() {
        this.instance.close();
    }

    offset() {}

    setContent(content) {
        this.instance.setContent(content);
    }

    setTimeout() {
        if (this.show === false) {
            return;
        }
        const self = this;
        this.timeout = setTimeout(function() {
            if (self.instance) {
                self.instance.close();
                self.show = false;
                self.timeout = null;
            }
        }, 1000);
    }

    clearTimeout() {
        clearTimeout(this.timeout);
        this.timeout = null;
    }

    setLongTimeout(marker) {
        if (this.longtimeout) {
            clearTimeout(this.longtimeout);
        }
        const self = this;
        this.longtimeout = setTimeout(function() {
            google.maps.event.trigger(marker, 'mouseout', {});
            // self.instance.close();
        }, 5000);
    }

}

class ContextMenu {

    constructor(map) {
        this.map = map;
        this.instance = map.instance;
        this.container = map.container;
        this.listeners = [];
        this.contextmenu = null;

        this.genCommonMenu();
        this.regListener();

        window.map_contextmenu_clear = () => {
            const {dispatch} = window._storage_;
            dispatch(map_clear_overlays());
        };
        // window.map_contextmenu_clear = window.map_contextmenu_clear.bind(this.map);
    }

    genCommonMenu() {
        this.contextmenu = document.createElement("div");
        this.contextmenu.style.display = "none";
        this.contextmenu.style.background = "#ffffff";
        this.contextmenu.style.border = "1px solid #8888FF";
        this.contextmenu.innerHTML = "<a href='javascript:map_contextmenu_clear();'><div class='context'>Clear</div></a>";
        this.contextmenu.innerHTML += "<a href='javascript:map_garmin_send_stop_point();'><div class='context'>GarminStopPoint</div></a>";

        document.getElementById(this.container).appendChild(this.contextmenu);
        this.instance.controls[google.maps.ControlPosition.TOP_LEFT].push(this.contextmenu);
    }

    genFenceMenu() {
        this.contextmenu = document.createElement("div");
        this.contextmenu.style.display = "none";
        this.contextmenu.style.background = "#ffffff";
        this.contextmenu.style.border = "1px solid #8888FF";
        this.contextmenu.innerHTML = "<a href='javascript:map_contextmenu_end();'><div class='context'>End</div></a><br/>" +
            "<a href='javascript:map_contextmenu_cancel();'><div class='context'>Cancel</div></a>";

        document.getElementById(this.container).appendChild(this.contextmenu);
        this.instance.controls[google.maps.ControlPosition.TOP_LEFT].push(this.contextmenu);
    }

    regListener() {
        const thiz = this;
        var listener = google.maps.event.addListener(this.instance, 'rightclick', function (e) {
        //   thiz.position = lnglat.Point.from(e.latLng);

          thiz.contextmenu.style.position = "relative";
          thiz.contextmenu.style.left = e.pixel.x + "px";
          thiz.contextmenu.style.top = e.pixel.y + "px";
          thiz.contextmenu.style.width = '100px';
          thiz.contextmenu.style.display = "block";
        });
        this.listeners.push(listener);

        listener = google.maps.event.addDomListener(thiz.contextmenu, 'click', function () {
          thiz.contextmenu.style.display = "none";
        });
        this.listeners.push(listener);

        listener = google.maps.event.addListener(this.instance, 'click', function () {
          thiz.contextmenu.style.display = "none";
        });
        this.listeners.push(listener);

        listener = google.maps.event.addListener(this.instance, 'drag', function () {
          thiz.contextmenu.style.display = "none";
        });
        this.listeners.push(listener);
    }

    refresh(operationType) {
        switch (operationType) {
            case MapOperationType.Normal:
                this.genCommonMenu();
                break;
            case MapOperationType.Fence:
                this.genFenceMenu();
                break;
            default:

        }

        this.regListener();
    }

}

export default class GoogleMap {

    constructor(canvas) {
        this.container = canvas;
        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDnPngknbculw_Z1SBbx2-hdyLWuZqzARE&libraries=places,drawing&callback=window._storage_.onMapLoaded';
        if ($("#" + this.container).length) {
            $("#" + this.container).append(script);
        }

        this.overlays = []
    }

    init() {
        this.instance = new google.maps.Map(document.getElementById(this.container), {
            center: new google.maps.LatLng(34.037087, 103.805178),
            zoom: 4,
            mapTypeControl: true,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                position: google.maps.ControlPosition.TOP_RIGHT
            },
            zoomControl: true,
            zoomControlOptions: {
                position: google.maps.ControlPosition.TOP_RIGHT
            },
            scaleControl: true,

        });

        this.infoWindow = new InfoWindow();
        // this.geocoder = new google.maps.Geocoder;

        this.drawingManager = new google.maps.drawing.DrawingManager();
        this.drawingManager.setMap(this.instance);
        this.drawingManager.setOptions({
            drawingControl: false
        });

        this.contextMenu = new ContextMenu(this);
    }

    static toLngLat(gLnglat) {
        return new LngLat(GPSType.GCJ02, gLnglat.lng(), gLnglat.lat());
    }

    static fromLngLat(lnglat) {
        if (!window["google"] || !google.maps || !google.maps.LatLng) {
            return null;
        }

        return new google.maps.LatLng(lnglat.gcj.lat, lnglat.gcj.lng);
    }

    setOperation(operationType) {
        this.operationType = operationType;
        this.contextMenu.refresh(operationType);
    }

    addCar(lnglat, option) {
        if (lnglat.wgs.lat == 0 && lnglat.wgs.lng == 0) {
            return;
        }

        var seq = 0;
        option = option || {};
        if (option.seq) {
            seq = option.seq;
        }
        if (option.online === false) {
            seq = STATUS_OFFLINE;
        }
        if (option.info != undefined) {
            if (option.info.speed <= 0 && option.online === true) {
                seq = STATUS_STOP;
            }
        }
        if (!window["google"] || !google.maps) {
            return;
        }

        var marker = new google.maps.Marker({position: GoogleMap.fromLngLat(lnglat), map: this.instance, icon: './images/car0.png'});

        let self = this;
        let cs = [];

        google.maps.event.addListener(marker, 'mouseover', function(e) {
            self.infoWindow.mouseover = true;
            self.regeocoder(lnglat, function(address) {
                    var html = '<div>' + address
                    html = html + '</div>';
                    self.infoWindow.setContent(html);
                    self.infoWindow.open(marker, true);
                    self.infoWindow.setLongTimeout(marker);
            });
        });

        google.maps.event.addListener(marker, 'mouseout', function() {
            self.infoWindow.mouseover = false;
            self.infoWindow.setTimeout();
        });

        // this.instance.addOverlay(marker);

        this.addoverlay(marker);
        return marker;
    }

    addPoint(lnglat) {
        // var marker = new RichMarker({
        //     position: pnt.to(),
        //     flat: true,
        //     content: TP.browser === 'mobile'
        //         ? '<i class="iconfont24 ' + color + '">&#x3434;</i>'
        //         : '<i class="iconfont8 ' + color + '">&#x3434;</i>'
        // });

        // if (option.garminOperation) {
        let image = {
            url: 'images/point.png',
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(7.5, 7.5),
            scaledSize: new google.maps.Size(15, 15),
            // origin: new google.maps.Point(0, 0),
            // anchor: new google.maps.Point(0, 32)
        };
        let marker = new google.maps.Marker({
                position: GoogleMap.fromLngLat(lnglat),
                icon: image
            });
            // if (!option.garminOperation.mileage && !option.garminOperation.mileage && !option.garminOperation.accstatus) {
            //     marker = new google.maps.Marker({
            //         position: GoogleMap.fromLngLat(lnglat),
            //         icon: "./images/point.png"
            //     });
            // }
        // } else {
        //     google.maps.event.addListener(marker, 'mouseover', function(e) {
        //         self.setContent('<i class="iconfont16 ' + color + '">&#x3434;</i>');
        //         self.infoWindow.setLongTimeout(this);
        //     });
        //
        //     google.maps.event.addListener(marker, 'mouseout', function(e) {
        //         self.setContent('<i class="iconfont8 ' + color + '">&#x3434;</i>');
        //     });
        // }

        // marker.setAnchor(RichMarkerPosition.MIDDLE);

        var cs = [];

        const self = this;
        google.maps.event.addListener(marker, 'mouseover', function(e) {
            self.infoWindow.mouseover = true;
            self.regeocoder(lnglat, function(address) {
                var html = '<div>' + address
                // var html = '<div onmouseover="window.openMarkerIwG();" onmouseout="window.closeMarkerIwG();">' + cs.join('<br/>') + '<br/>' + i18n.Address + ': ' + address + '</div>';
                self.infoWindow.setContent(html);
                self.infoWindow.open(marker, true);
                self.infoWindow.setLongTimeout(marker);
            });
        });

        google.maps.event.addListener(marker, 'mouseout', function() {
            self.infoWindow.mouseover = false;
            self.infoWindow.setTimeout();
        });

        this.addoverlay(marker);

        return marker;
    }

    addPoints(pnts, option) {
        var color = "";
        option = option || {};
        //if (option.seq !== null && option.seq !== undefined) {
        //  color = "color" + option.seq;
        //}
        option.seq = option.seq || 0;
        color = "color" + option.seq;

        if (!window["google"] || !google.maps) {
            return;
        }

        if (pnts instanceof Array === false) {
            pnts = [pnts];
        }

        var markers = new Array();
        for (var i in pnts) {
            if (pnts[i].wgs.lat == 0 && pnts[i].wgs.lng == 0) {
                continue;
            }
            markers.push(this.addPoint(pnts[i]));
        }

        return markers;
    }

    addCircle(center, radius) {
        if (!window["google"] || !google.maps) {
            return;
        }

        var circleOptions = {
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FFCCCC',
            fillOpacity: 0.35,
            center: GoogleMap.fromLngLat(center),
            radius: radius
        };

        var circle = new google.maps.Circle(circleOptions);
        this.addoverlay(circle);
    }

    addPolyline(pnts, option) {
        var argv = [];
        for (var i in pnts) {
            if (pnts[i].wgs.lat == 0 && pnts[i].wgs.lng == 0) {
                continue;
            }
            argv.push(GoogleMap.fromLngLat(pnts[i]));
        }

        option = option || {};
        option.color = option.color || "#c404ff";

        if (!window["google"] || !google.maps) {
            return;
        }

        var polyline = new google.maps.Polyline({path: argv, geodesic: true, strokeColor: option.color, strokeOpacity: 1.0, strokeWeight: 4});

        this.addoverlay(polyline);
        return polyline;
    }

    addRectangle(pntA, pntB) {
        if (!window["google"] || !google.maps) {
            return;
        }

        var aPoint = GoogleMap.fromLngLat(pntA),
            bPoint = GoogleMap.fromLngLat(pntB),
            pnts = new Array();
        pnts.push(aPoint);
        pnts.push(new google.maps.LatLng(bPoint.lat(), aPoint.lng()));
        pnts.push(bPoint);
        pnts.push(new google.maps.LatLng(aPoint.lat(), bPoint.lng()));
        let retangle = new  google.maps.Polygon({path: pnts, strokeColor: "#F00", strokeWeight: 2});

        this.addoverlay(retangle);
    }

    regeocoder(pnt, cb) {
        if (!window["google"] || !google.maps) {
            return;
        }

        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({
            'latLng': GoogleMap.fromLngLat(pnt)
        }, function(results, status) {
            if (results && results[0]) {
                var address = results[0].formatted_address;
                cb(address);
            }
        });
    }

    center(pnt) {
        if (pnt.wgs.lat == 0 && pnt.wgs.lng == 0) {
            return;
        }
        this.instance.setCenter(GoogleMap.fromLngLat(pnt));
        this.instance.setZoom(14);
    }

    fitview(argv) {
        if (!window["google"] || !google.maps) {
            return;
        }

        if (argv) {
            if (argv.length) {
                var bounds = new google.maps.LatLngBounds();
                for (var i in argv) {
                    bounds.extend(GoogleMap.fromLngLat(argv[i]));
                }
                this.instance.fitBounds(bounds);
                this.instance.setZoom(14); //TODO
            } else {
                var bounds = this.instance.getBounds();
                if (bounds && !bounds.contains(GoogleMap.fromLngLat(argv))) {
                    //this.instance.setCenter(argv.to());
                    this.center(argv);
                }
            }
        } else {}
    }

    distance(pnt0, pnt1) {
        return LngLat.distance(pnt0, pnt1);
    }

    addoverlay(ol) {
        this.overlays.push(ol);
        ol.setMap(this.instance);
    }

    clearoverlays() {
        for (var i in this.overlays) {
            this.overlays[i].setMap(null);
        }
        this.overlays = [];
    }


    drawCircle(option, callback) {
        console.log('drawCircle');
        const self = this;
        self.drawingManager.setOptions({
            drawingMode: google.maps.drawing.OverlayType.CIRCLE,
            drawingControl: false,
            circleOptions: option
        });
        google.maps.event.addListener(this.drawingManager, 'circlecomplete', function(circle) {
            self.drawingManager.setMap(null);
            callback(GoogleMap.toLngLat(circle.getCenter()), circle.getRadius());
        });
    }

    drawRectangle() {

    }


    remove(overlay) {
        if (!overlay) {
            return;
        }
        if (overlay.setMap) {
            overlay.setMap(null);
        } else {
            overlay[0].onRemove();
        }
    }

}
