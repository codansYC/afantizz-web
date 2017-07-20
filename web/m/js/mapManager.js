/**
 * Created by lekuai on 2017/4/20.
 */
var geocoder
var placeSearch
function searchSubway(address,callBack) {

    var distance = 1500
    var houseCoor = [0,0]
    AMap.service('AMap.Geocoder',function(){//回调函数
        //实例化Geocoder
        geocoder = new AMap.Geocoder({
            city: cityCode //城市
        });
        geocoder.getLocation(address, function(status, result) {
            if (status === 'complete' && result.info === 'OK') {
                var loc = result.geocodes[0].location
                var coor = [loc.getLng(), loc.getLat()];
                houseCoor = coor
                AMap.service('AMap.PlaceSearch',function() {//回调函数
                    //分类查询
                    placeSearch = new AMap.PlaceSearch({
                        city: cityCode, //城市
                        type: '地铁'
                    });
                    placeSearch.searchNearBy("", houseCoor, distance, function (status, result, poiList) {
                        if (status === 'complete' && result.info === 'OK') {
                            var pois = result.poiList.pois
                            var subways = handleSubways(pois)
                            var traffic = handleTraffic(pois)
                            callBack(subways,traffic);
                        } else {
                            console.log("查询地铁线路失败")
                            callBack("",'');
                        }
                    });
                });
            }else{
                console.log("获取经纬度失败")
                callBack("",'');
            }
        });
    })

}



/* -------------------------------------------- */

/**用于详情页**/
var trafficSearch   //交通
var subwaySearch    //地铁
var busSearch       //公交
var cateringSearch  //餐饮
var shoppingSearch  //购物

/*********************附近交通、餐饮、购物***********************/
function searchTCS(address,callBack) {

    var distance = 1000
    var houseCoor = [0,0]
    var traffic = ''
    var catering = ''
    var shopping = ''
    var subway = ''
    var bus = ''
    AMap.service('AMap.Geocoder',function(){//回调函数
        //实例化Geocoder
        geocoder = new AMap.Geocoder({
            city: cityCode //城市
        });
        geocoder.getLocation(address, function(status, result) {
            if (status === 'complete' && result.info === 'OK') {
                var loc = result.geocodes[0].location
                coor = [loc.getLng(), loc.getLat()];
                houseCoor = coor
                AMap.service('AMap.PlaceSearch',function() {//回调函数
                    /**
                     * 地铁查询
                     */
                    subwaySearch = new AMap.PlaceSearch({
                        city: cityCode, //城市
                        type: "地铁"
                    });
                    subwaySearch.searchNearBy("", houseCoor, 1500, function (status, result, poiList) {
                        if (status === 'complete' && result.info === 'OK') {
                            var pois = result.poiList.pois
                            subway = handleSubways(pois)
                            traffic = subway
                            if (traffic == '') {
                                traffic = bus
                            } else if (bus != '') {
                                traffic += (";"+bus)
                            }

                            callBack(traffic,catering,shopping);
                        } else {
                            console.log("查询交通设施服务失败")
                            callBack(traffic,catering,shopping);
                        }
                    });
                    /**
                     * 公交查询
                     */
                    busSearch = new AMap.PlaceSearch({
                        city: cityCode, //城市
                        type: "公交"
                    });
                    busSearch.searchNearBy("", houseCoor, 600, function (status, result, poiList) {
                        if (status === 'complete' && result.info === 'OK') {
                            var pois = result.poiList.pois
                            bus = handleBus(pois)
                            if (subway != '') {
                                traffic = subway
                                if (bus != '') {
                                    traffic += (';' + bus)
                                }
                            } else {
                                traffic = bus
                            }
                            callBack(traffic,catering,shopping);
                        } else {
                            console.log("查询交通设施服务失败")
                            callBack(traffic,catering,shopping);
                        }
                    });
                    /**
                     * 餐饮查询
                     */
                    cateringSearch = new AMap.PlaceSearch({
                        city: cityCode, //城市
                        type: "餐饮"
                    });
                    cateringSearch.searchNearBy("", houseCoor, 1000, function (status, result, poiList) {
                        if (status === 'complete' && result.info === 'OK') {
                            var pois = result.poiList.pois
                            catering = handleCateringOrShopping(pois)
                            callBack(traffic,catering,shopping);
                        } else {
                            console.log("查询餐饮服务失败")
                            callBack(traffic,catering,shopping);
                        }
                    });
                    /**
                     * 超市查询
                     */
                    shoppingSearch = new AMap.PlaceSearch({
                        city: cityCode, //城市
                        type: "超市"
                    });
                    shoppingSearch.searchNearBy("", houseCoor, 1000, function (status, result, poiList) {
                        if (status === 'complete' && result.info === 'OK') {
                            var pois = result.poiList.pois
                            shopping = handleCateringOrShopping(pois)
                            callBack(traffic,catering,shopping);
                        } else {
                            console.log("查询购物服务失败")
                            callBack(traffic,catering,shopping);
                        }
                    });
                });
            }else{
                console.log("获取经纬度失败")
                callBack(traffic,catering,shopping);
            }
        });
    })

}

//处理地铁
function handleSubways(pois) {

    var subwayArr = new Array();

    for (var i = 0; i < pois.length; i++) {
        var addressArr = pois[i].address.split(';')
        for (var j=0; j<addressArr.length;j++) {
            var address = addressArr[j]
            if (address.indexOf('号线')>=0 && subwayArr.indexOf(address)<0) {
                if (address.indexOf('在建')<0) {
                    subwayArr.push(addressArr[j])
                }
            }
        }
    }
    subways = subwayArr.join(';')
    return subways
}

//处理交通
function handleTraffic(pois) {

    var trafficArr = new Array();
    for (var i = 0; i < pois.length; i++) {
        // var subwayLine = pois[i].address.replace(';','、')
        var subwaylines = pois[i].address.split(';')
        for (var k = 0; k < subwaylines.length; k++) {
            if (subwaylines.indexOf("在建") > -1) {
                subwaylines.splice(i,1)
            }
        }
        var subwayline = subwaylines.join('、')
        var canPush = true
        for (var j = 0; j < trafficArr.length; j++) {
            if (trafficArr[j].indexOf(subwayLine) > -1) {
                canPush = false
            }
        }
        if (canPush) {
            var desc = '距离' + subwayLine + pois[i].name + pois[i].distance+'米'
            trafficArr.push(desc)
        }
    }
    traffic = trafficArr.join(';')
    return traffic
}

//处理公交
function handleBus(pois) {
    var busArr = new Array();

    for (var i = 0; i < pois.length; i++) {
        var addressArr = pois[i].address.split(';')
        for (var j=0; j<addressArr.length;j++) {
            var address = addressArr[j]
            if (address.indexOf('路')>=0 && busArr.indexOf(address)<0) {
                if (address.indexOf('在建')<0) {
                    busArr.push(addressArr[j])
                }
            }
        }
    }
    bus = busArr.join(';')
    return bus
}

//处理餐饮
function handleCateringOrShopping(pois) {
    var desc = ''
    for (var i = 0; i < pois.length; i++) {
        var poi = pois[i]
        if (desc == '') {
            desc += poi.name
        } else {
            desc += (';'+poi.name)
        }
    }
    return desc
}

function handlePois(pois) {
    var desc = ''
    for (var i = 0; i < pois.length; i++) {
        var poi = pois[i]
        if (desc == '') {
            desc += poi.address
        } else {
            desc += (';'+poi.address)
        }
    }
    return desc
}
