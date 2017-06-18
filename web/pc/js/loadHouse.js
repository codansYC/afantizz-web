/**
 * Created by lekuai on 17/1/4.
 */
$(function () {

    //动态添加房源列表中的li标签
    var insertOneHouse = function() {
        var oLi = $("<li></li>");
        var oHouseInfoDiv = $("<div></div>");
        oHouseInfoDiv.addClass("house-info");
        oLi.append(oHouseInfoDiv);
        var oPicPanelDiv = $("<div></div>");
        oPicPanelDiv.addClass("pic-panel");
        oHouseInfoDiv.append(oPicPanelDiv);
        var oA = $("<a href='#'></a>");
        oPicPanelDiv.append(oA);
        var oImg =  $("<img src='http://cdn1.dooioo.com/fetch/vp/fy/gi/20151016/a52a8367-a136-40de-ad34-94480bcdccd4.jpg_600x450.jpg' alt=''>");
        oA.append(oImg);
        var oIntro = $("<div></div>");
        oHouseInfoDiv.append(oIntro);
        oIntro.addClass("house-intro");
        var oTitleDiv = $("<div>整租｜2室1厅1卫</div>");
        oTitleDiv.addClass("house-style");
        var oPlaceDiv = $("<div>浦东－交大嘉园</div>");
        oPlaceDiv.addClass("house-address");
        var oTimeDiv = $("<div>到期时间：<span>2017-1-21</span></div>");
        oTimeDiv.addClass("expiration-time");
        var oSubwayDiv = $("<div></div>");
        oSubwayDiv.addClass("near-subway");
        oSubwayDiv.append($("<div>11号线</div>"));
        var oPriceDiv = $("<div>6800元/月</div>");
        oPriceDiv.addClass("price");
        oIntro.append(oTitleDiv,oPlaceDiv,oTimeDiv,oSubwayDiv,oPriceDiv);
        $(".house_list").append(oLi);
    };

    var insertLotHouse = function (count) {
        for (var i=0; i<count;i++) {
            insertOneHouse();
        }
    };

    insertLotHouse(20);






});



