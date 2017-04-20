const GPSType = {
    WGS84: 0,
    GCJ02: 1
}
export {GPSType};

export default class LngLat {

    constructor(type, lng, lat) {
        this.wgs = null;
        this.gcj = null;
        this.pnt = null;

        var float = null;
        if (typeof(lng) === 'string' && lng.match(/e|E|w|W/) !== null && typeof(lat) === 'string' && lat.match(/n|N|s|S/) !== null) {
            float = LngLat.stand2float(lng, lat);
        }

        if (float) {
            lng = float.lng;
            lat = float.lat;
        } else {
            if (typeof(lng) === 'string') {
                lng = parseFloat(lng);
            }
            if (typeof(lat) === 'string') {
                lat = parseFloat(lat);
            }
        }

        switch (type) {
            case GPSType.WGS84:
                this.wgs = {
                    lng: lng,
                    lat: lat
                };
                this.gcj = LngLat.wgs2gcj(lat, lng);
                break;
            case GPSType.GCJ02:
                this.gcj = {
                    lng: lng,
                    lat: lat
                };
                this.wgs = LngLat.gcj2wgs(lat, lng);
                break;
            default:
                console.log('Error new LngLat.Point()');
                break;
        }
    }

}

LngLat.outOfChina = function(lat, lng) {
    if ((lng < 72.004) || (lng > 137.8347)) {
        return true;
    }
    if ((lat < 0.8293) || (lat > 55.8271)) {
        return true;
    }
    return false;
};

LngLat.transformLat = function(x, y) {
    var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(y * Math.PI) + 40.0 * Math.sin(y / 3.0 * Math.PI)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(y / 12.0 * Math.PI) + 320 * Math.sin(y * Math.PI / 30.0)) * 2.0 / 3.0;
    return ret;
};

LngLat.transformLon = function(x, y) {
    var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(x * Math.PI) + 40.0 * Math.sin(x / 3.0 * Math.PI)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(x / 12.0 * Math.PI) + 300.0 * Math.sin(x / 30.0 * Math.PI)) * 2.0 / 3.0;
    return ret;
};

LngLat.delta = function(lat, lng) {
    var a = 6378245.0;
    var ee = 0.00669342162296594323;
    var dLat = LngLat.transformLat(lng - 105.0, lat - 35.0);
    var dLng = LngLat.transformLon(lng - 105.0, lat - 35.0);
    var radLat = lat / 180.0 * Math.PI;
    var magic = Math.sin(radLat);
    magic = 1 - ee * magic * magic;
    var sqrtMagic = Math.sqrt(magic);
    dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * Math.PI);
    dLng = (dLng * 180.0) / (a / sqrtMagic * Math.cos(radLat) * Math.PI);
    return {"lat": dLat, "lng": dLng};
};

LngLat.wgs2gcj = function(wgsLat, wgsLng) {
    // if (LngLat.outOfChina(wgsLat, wgsLng)) {
    if (!LngLat.inChina(wgsLat, wgsLng)) {
        return {"lat": wgsLat, "lng": wgsLng};
    }
    var d = LngLat.delta(wgsLat, wgsLng);
    return {
        "lat": wgsLat + d.lat,
        "lng": wgsLng + d.lng
    };
};

LngLat.gcj2wgs = function(gcjLat, gcjLng) {
    // if (LngLat.outOfChina(gcjLat, gcjLng)) {
    if (!LngLat.inChina(gcjLat, gcjLng)) {
        return {"lat": gcjLat, "lng": gcjLng};
    }
    var d = LngLat.delta(gcjLat, gcjLng);
    return {
        "lat": gcjLat - d.lat,
        "lng": gcjLng - d.lng
    };
};

LngLat.gcj2wgs_exact = function(gcjLat, gcjLng) {
    var initDelta = 0.01;
    var threshold = 0.000001;
    var dLat = initDelta,
        dLng = initDelta;
    var mLat = gcjLat - dLat,
        mLng = gcjLng - dLng;
    var pLat = gcjLat + dLat,
        pLng = gcjLng + dLng;
    var wgsLat = 0;
    var wgsLng = 0;
    for (var i = 0; i < 30; i++) {
        wgsLat = (mLat + pLat) / 2;
        wgsLng = (mLng + pLng) / 2;
        var tmp = LngLat.wgs2gcj(wgsLat, wgsLng);
        dLat = tmp.lat - gcjLat;
        dLng = tmp.lng - gcjLng;
        if ((Math.abs(dLat) < threshold) && (Math.abs(dLng) < threshold)) {
            return {"lat": wgsLat, "lng": wgsLng};
        }
        if (dLat > 0) {
            pLat = wgsLat;
        } else {
            mLat = wgsLat;
        }
        if (dLng > 0) {
            pLng = wgsLng;
        } else {
            mLng = wgsLng;
        }
    }

    return {"lat": wgsLat, "lng": wgsLng};
};

//    LngLat.distance = function(latA, lngA, latB, lngB) {
LngLat.distance = function(pnt0, pnt1) {
    var latA = pnt0.wgs.lat;
    var lngA = pnt0.wgs.lng;
    var latB = pnt1.wgs.lat;
    var lngB = pnt1.wgs.lng;

    var earthR = 6371000;
    var x = Math.cos(latA * Math.PI / 180) * Math.cos(latB * Math.PI / 180) * Math.cos((lngA - lngB) * Math.PI / 180);
    var y = Math.sin(latA * Math.PI / 180) * Math.sin(latB * Math.PI / 180);
    var s = x + y;
    if (s > 1) {
        s = 1;
    }
    if (s < -1) {
        s = -1;
    }
    var alpha = Math.acos(s);
    var distance = alpha * earthR;
    return distance;
};

LngLat.toFloat = function(degree, division, flag) {
    division = division || 0;

    if (typeof degree === "string") {
        degree = parseFloat(degree);
    }
    if (typeof division === "string") {
        division = parseFloat(division);
    }

    var sign = 1;
    if (flag && (flag.toLowerCase() === 's' || flag.toLowerCase() === 'w')) {
        sign = -1;
    }
    return sign * (degree + (division / 60));
};

LngLat.toStand = function(lng, lat) {
    var stand = {};
    if (lng < 0) {
        stand.lng = Math.abs(lng) + 'W';
    } else {
        stand.lng = lng + 'E';
    }

    if (lat < 0) {
        stand.lat = Math.abs(lat) + 'S';
    } else {
        stand.lat = lat + 'N';
    }
    return stand;
};

LngLat.stand2float = function(lng, lat) {
    var float = {};
    if (lng[lng.length - 1].toLocaleUpperCase() === 'w') {
        float.lng = parseFloat(lng) * -1;
    } else {
        float.lng = parseFloat(lng);
    }

    if (lat[lat.length - 1].toLocaleUpperCase() === 's') {
        float.lat = parseFloat(lat) * -1;
    } else {
        float.lat = parseFloat(lat);
    }
    return float;
};

LngLat.checkPolygon = function(points) {
    var arr = new Array();
    arr = [];
    arr = arr.concat(points);
    arr.push(points[0]);

    var flag = false;
    for (var i = 0; i < arr.length - 2; i++) {
        var ax = arr[i].wgs.lng,
            ay = arr[i].wgs.lat,
            bx = arr[i + 1].wgs.lng,
            by = arr[i + 1].wgs.lat;

        for (var j = i + 2; j < arr.length - 1; j++) {
            flag = false;
            var cx = arr[j].wgs.lng,
                cy = arr[j].wgs.lat,
                dx = arr[j + 1].wgs.lng,
                dy = arr[j + 1].wgs.lat;

            if (cx == bx && cy == by) {
                continue;
            } else if (ax == dx && ay == dy) {
                continue;
            }

            var area_abc = (ax - cx) * (by - cy) - (ay - cy) * (bx - cx);
            var area_abd = (ax - dx) * (by - dy) - (ay - dy) * (bx - dx);
            if (area_abc * area_abd >= 0) {
                flag = true;
            }

            var area_cda = (cx - ax) * (dy - ay) - (cy - ay) * (dx - ax);
            var area_cdb = area_cda + area_abc - area_abd;
            if (area_cda * area_cdb >= 0) {
                flag = true;
            }

            if (flag === false) {
                return false;
            }
        }
    }

    return true;
};



function Rectangle(latitude1, longitude1, latitude2, longitude2) {
    this.west = Math.min(longitude1, longitude2);
    this.north = Math.max(latitude1, latitude2);
    this.east = Math.max(longitude1, longitude2);
    this.south = Math.min(latitude1, latitude2);
}

Rectangle.prototype.inRectangle = function(latitude, longitude) {
    return this.west <= longitude && this.east >= longitude && this.north >= latitude && this.south <= latitude;
};

const region = [
    new Rectangle(49.220400, 79.446200, 42.889900, 96.330000),
    new Rectangle(54.141500, 109.687200, 39.374200, 135.000200),
    new Rectangle(42.889900, 73.124600, 29.529700, 124.143255),
    new Rectangle(29.529700, 82.968400, 26.718600, 97.035200),
    new Rectangle(29.529700, 97.025300, 20.414096, 124.367395),
    new Rectangle(20.414096, 107.975793, 17.871542, 111.744104)
];

const exclude = [
    new Rectangle(25.398623, 119.921265, 21.785006, 122.497559),
    new Rectangle(22.284000, 101.865200, 20.098800, 106.665000),
    new Rectangle(21.542200, 106.452500, 20.487800, 108.051000),
    new Rectangle(55.817500, 109.032300, 50.325700, 119.127000),
    new Rectangle(55.817500, 127.456800, 49.557400, 137.022700),
    new Rectangle(44.892200, 131.266200, 42.569200, 137.022700)
];

LngLat.inChina = function(latitude, longitude) {
    for (var i = 0; i < region.length; i++) {
        if (region[i].inRectangle(latitude, longitude)) {
            for (var j = 0; j < exclude.length; j++) {
                if (exclude[j].inRectangle(latitude, longitude)) {
                    return false;
                }
            }
            return true;
        }
    }
    return false;
}
