/**
 * Created by lekuai on 17/2/1.
 */

var distance = 1500  //m
var geocoder
var map
var houseCoor = [116.480983, 40.0958]
var houseMaker
var placeSearch

$(function () {

    AMap.service('AMap.Geocoder',function(){//回调函数
        //实例化Geocoder
        geocoder = new AMap.Geocoder({
            city: cityCode//城市，默认：“全国”
        });
    });

    //关键字查询
    $.fn.keywordSearch = function (kw) {
        placeSearch.searchNearBy(kw, houseCoor, distance, function (status, result) {
            if (status === 'complete' && result.info === 'OK') {
                //TODO : 解析返回结果,如果设置了map和panel，api将帮助完成点标注和列表
            } else {
                console.log("关键字搜索失败")
            }
        });
    };

    //类别附近搜索
    $.fn.searchNearByType = function (type) {
        placeSearch.setType(type);
        placeSearch.searchNearBy("", houseCoor, distance, function (status, result) {
            if (status === 'complete' && result.info === 'OK') {
                //TODO : 解析返回结果,如果设置了map和panel，api将帮助完成点标注和列表
            } else {
                console.log("关键字搜索失败")
            }
        });
    };

});

function startLocating(address) {
    geocoder.getLocation(address, function(status, result) {

        var coor = [116.480983, 40.0958]
        if (status === 'complete' && result.info === 'OK') {
            //TODO:获得了有效经纬度，可以做一些展示工作
            //比如在获得的经纬度上打上一个Marker
            var loc = result.geocodes[0].location
            coor = [loc.getLng(), loc.getLat()];
            houseCoor = coor
        }else{
            //获取经纬度失败
            console.log("获取经纬度失败")
        }
        map = new AMap.Map('map-container',{
            resizeEnable: true,
            zoom: 15,
            center: coor
        });
        AMap.plugin(['AMap.ToolBar','AMap.Scale','AMap.OverView'],
            function(){
                map.addControl(new AMap.ToolBar());
                map.addControl(new AMap.Scale());
            });

        houseMaker = new AMap.Marker({
            position: coor,
            title: "房源地址",
            map: map,
            icon: "/images/location.png"
        });

        //search

        AMap.service('AMap.PlaceSearch',function(){//回调函数
            //分类查询
            placeSearch = new AMap.PlaceSearch({
                city: cityCode, //城市
                map: map,
                panel: "res-lst"
            });
            placeSearch.setType("交通设施服务")
            placeSearch.searchNearBy("", houseCoor, distance, function(status, result) {
                if (status === 'complete' && result.info === 'OK') {
                    //TODO : 解析返回结果,如果设置了map和panel，api将帮助完成点标注和列表
                } else {
                    console.log("查询周边交通设施服务失败")
                }
            });

        })
    });
}

var subways = ''
var traffic = ''
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
        var subwayLines = pois[i].address.split(';')
        for (var k = 0; k < subwayLines.length; k++) {
            if (subwayLines[k].indexOf("在建") > -1) {
                subwayLines.splice(k,1)
            }
        }
        var subwayLine = subwayLines.join('、')
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
