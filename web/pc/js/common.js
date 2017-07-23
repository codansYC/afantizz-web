/**
 * Created by lekuai on 17/2/2.
 */
var pro = true;
var cityCode = "021" //城市编码,目前只服务上海
var basicUrl = pro ? "http://afantizz.com/" : "http://localhost:8000/"
var imageUrl = pro ? "http://afantizz.com/" : "http://localhost:8000/"

$(function () {
    //验证手机号是否输入正确
    $.fn.phoneIsValid = function (phone) {
        var pattern = /^(((1[3|4|5|7|8|9]{1}[0-9]{1}))[0-9]{8})$/
        return pattern.test(phone)
    };

    //验证验证码格式是否正确
    $.fn.codeIsValid = function (code) {
        var pattern = /^([0-9]{6})$/
        return pattern.test(code)
    };

});

//处理页面传参
function getParams(key) {
    var keyList = [];
    var valueList = [];
    var hrefStr = decodeURIComponent(window.location.href);
    var strArray = hrefStr.split("?");
    var paramStr = strArray[1];
    if ((paramStr != null) && (paramStr != null)) {
        var paramArray = paramStr.split("&");
        for (var i=0; i<paramArray.length; i++) {
            var param = paramArray[i];
            valueList.push(param.substr(param.indexOf("=")+1));
            keyList.push(param.substr(0,param.indexOf("=")));
        }
        for (var j=0; j<keyList.length; j++) {
            if (key == keyList[j]) {

                return valueList[j];
            }
        }
    }
    return null;
}

//获取主要路径
function getMainPath() {
    var hrefStr = decodeURIComponent(window.location.href);
    var strArray = hrefStr.split("?");
    var paramStr = strArray[0];
    return paramStr
}

//退出登录

//展示登录信息
function showLoginInfo(no) {
    
    if ($(".login-info").length > 0) { return }
    var loginInfo = $("<div class='login-info'></div>");
    var wrap = $(".header_wrap");
    wrap.append(loginInfo);
    var wrapH = wrap.height();
    var iconContainer = $("<div></div>");
    iconContainer.css("line-height",wrapH+"px");
    var headIcon = $("<img src='/images/head-icon.png' alt=''/>");
    iconContainer.append(headIcon);
    loginInfo.append(iconContainer);
    var loginNum = $("<div style='font-size: 12px;'></div>");
    loginNum.text(no);
    loginNum.css("line-height",wrapH+"px");
    loginInfo.append(loginNum);
    //调整图片的margin-top
    var imgH = 22//headIcon.height();
    var imgMarginTop = (wrapH - imgH) / 2;
    headIcon.css({
        "margin-top": imgMarginTop+"px",
        "margin-left": "30px",
        "height": imgH+"px"
    });
}

//移除登录信息
function removeLoginInfo() {
    if ($("#login-info").length > 0) {
        $("#login-info").remove();
    }

}

//添加footer

function showFooter() {
    var footer = $("<div class='footer'></div>");
    var footerWrap = $("<div class='foot-wrap'></div>");
    footer.append(footerWrap);
    footerWrap.append($("<p>网络经营许可证 蜀ICP备17018294号</p>"));
    footerWrap.append($("<p>© Copyright©2017 阿凡提转租Afantizz.com版权所有</p>"));
    $("body").append(footer);
}

//添加举报列表
function showAccusationList(target) {
    removeAccusationList();
    //获取target的位置以及size
    var top = target.offset().top;
    var left = target.offset().left;
    var width = target.outerWidth();
    var height = target.outerHeight();
    var ul = $("<ul class='accusationList'></ul>");
    ul.css({
        "list-style": "none",
        "position": "absolute",
        "top": top + height + 5 + "px",
        "left": left - 60 + width / 2  + "px",
        "padding": "6px 0",
        "background-color": "black",
        "border-radius": "4px",
        "width": "120px",
        "box-sizing": "border-box",
        'opacity': '.7',
        'filter': 'alpha(opacity=70)',
    });
    var falseLi = $("<li style='line-height: 25px; font-size: 13px; padding: 0 6px; width: 106px;'></li>");
    var falseA = $("<a href='javascript:' style='color: #cdcdcd;text-align: center; width: 100%; display: block;'>虚假房源</a>");
    falseLi.append(falseA);
    var agencyLi = $("<li style='line-height: 25px; font-size: 13px; padding: 0 6px;'></li>");
    var agencyA = $("<a href='javascript:' style='color: #cdcdcd;text-align: center; width: 100%; display: block;'>中介房源</a>");
    agencyLi.append(agencyA);
    var infoErrorLi = $("<li style='line-height: 25px; font-size: 13px; padding: 0 6px;'></li>");
    var infoErrorA = $("<a href='javascript:' style='color: #cdcdcd;text-align: center; width: 100%; display: block;'>房源信息不符实</a>");
    infoErrorLi.append(infoErrorA);
    ul.append(falseLi,agencyLi,infoErrorLi);
    $("body").append(ul);

    $(".accusationList a").hover(function () {
        $(this).css({
            'color': 'white'
        })
    },function () {
        $(this).css({
            'color': '#cdcdcd'
        })
    });
}

//移除举报列表
function removeAccusationList() {
    if ($(".accusationList").length > 0) {
        $(".accusationList").remove();
    }
}

function response(data) {
    return $.parseJSON(data).data
}

//退出登录
function logout(success) {
    var token = getToken();
    document.cookie = "token="+token+";path=/;" + "expires=Thu, 26 Feb 1971 11:50:25 GMT";
    if (success) {
        success(true);
    }

}


function getToken() {

    var cookie = document.cookie;
    if (cookie=="") {
        return ""
    }
    var info = cookie.split(";");
    for (var i=0; i<info.length; i++) {
        if (info[i].indexOf("token") >= 0) {
            var token = info[i].split("=")[1];
            return token;
        }
    }
    return ""
}

//获取用户信息
function getUserInfo(success) {
    request(basicUrl + 'user/info',{
        token: getToken()
    },function (resp) {
        var user = resp;
        if (user.phone != null) {
            showLoginInfo(user.phone);
        } else if (user.wx != null) {
            showLoginInfo(user.wx);
        }
    })
}

//自定义提示框
function showModel(msg, completion,time) {

    var timeInterval = 800
    if (time) {
        timeInterval = time
    }
    var alertBg = $("<div></div>")
    alertBg.css({
        'width': '100%',
        'height': '100%',
        'position': 'fixed',
        'left': '0px',
        'top': '0px',
        'z-index': '99999999999'
    })
    $("body").append(alertBg)
    var alert = $("<div></div>")
    alert.text(msg)
    alert.css({
        'margin': '200px auto',
        'padding': '15px 15px',
        'backgroundColor': 'black',
        'opacity': '.7',
        'filter': 'alpha(opacity=70)',
        'border-radius': '3px',
        'color': 'white',
        'font-size': '15px',
        'max-width': '300px',
        'width': msg.length + 'em',
        'text-align': 'center',

    })
    alertBg.append(alert)
    setTimeout(function () {
        alertBg.remove()
        if (completion) {
            completion()
        }
    },timeInterval)

}

function customAlert(msg) {
    var alertBg = $("<div></div>")
    alertBg.css({
        'width': '100%',
        'height': '100%',
        'position': 'fixed',
        'left': '0px',
        'top': '0px',
        'z-index': '99999999999'
    })
    var alert = $("<div></div>")
    alert.text(msg)
    alert.css({
        'margin': '200px auto',
        'padding': '15px 15px',
        'backgroundColor': 'black',
        'opacity': '.7',
        'filter': 'alpha(opacity=70)',
        'border-radius': '3px',
        'color': 'white',
        'font-size': '15px',
        'max-width': '300px',
        'width': msg.length + 'em',
        'text-align': 'center',

    })
    alertBg.append(alert)
    return alertBg;
}

function accusate(houseId,reason) {

    request(basicUrl + "house/accusation",{
        house_id: houseId,
        reason: reason,
        token: getToken(),
        phone: '',
        desc: ''
    },function (resp) {
        showModel('举报成功')
    })
}

function request(url,params,respBlock) {
    $.post(url, params, function (response, status) {
        if (status != 'success') {
            showModel('操作失败,请稍后重试')
            return
        }
        var resp = $.parseJSON(response);
        if (resp.err_code == 10000) {
            showLoginPage()
            return;
        }
        if (resp.err_code != 0) {
            showModel(resp.err_msg)
            return
        }
        respBlock(resp.data)

    });
}

//处理地铁线路
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



