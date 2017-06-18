/**
 * Created by lekuai on 16/12/21.
 */

$(function () {

    var isLogin = getToken() != "" && getToken() != null;
    //根据登录态显示header

    if (isLogin) {
        var logoutLi = $("<li><div class='header_menu_item'><a href='javascript:' id='resource-page-logout'>退出登录</a></div></li>");
        var memberLi = $("<li><div class='header_menu_item'><a href='/pc/member.html' id='to-memberCenter'>个人中心</a></div></li>");
        $("#header_menu_ul").prepend(logoutLi,memberLi);
        var loginLi = $("#release-page-login");
        loginLi.remove();
        $('#resource-page-logout').click(function () {
            logout(function (flag) {
                location.reload()
            })
        })

        //获取用户信息
        getUserInfo();
    }

    //如果是修改已发布的房源,填充原始内容
    restoreHouseIfModify();

    $(".publish-line.rent-mode .publish-content a").click(function () {
        $(".publish-content a").removeClass("selected");
        $(this).addClass("selected");

        if ($(this).text() == "合租") {
            $("#room-style").css("visibility","visible");
        } else {
            $("#room-style").css("visibility","hidden");
        }
    });

    $(".publish-line.rent-mode .publish-content a").hover(function () {
        if (!$(this).hasClass("selected")) {
            $(this).addClass("text_highlight");
        }
    },function () {
        $(this).removeClass("text_highlight");
    });


//    对css中class="checkbox"的div操作
    $(".publish-info .facility .checkbox").click(function () {
        if ($(this).find("i").hasClass("check")) {
            $(this).find("i").removeClass("check");
        } else {
            $(this).find("i").addClass("check");
        }
    });

    $(".publish-info .facility .select_all").click(function () {
        var oSpan = $(this).find("span")[0];
        if (oSpan.innerHTML == "全选") {
            oSpan.innerHTML = "取消";
            $(".publish-info .facility .checkbox").find("i").addClass("check");
        } else {
            oSpan.innerHTML = "全选";
            $(".publish-info .facility .checkbox").find("i").removeClass("check");
        }
    });

});

$(function () {

    $(".rent-price .publish-content select.pay-mode").change(function () {
        if ($(this).val() == "qita") {
            $(".other-mode-inputbg").css("display","block");
            $(".other-mode-inputbg .other-mode-input").attr("required","required");
        } else {
            $(".other-mode-inputbg").css("display","none");
            $(".other-mode-inputbg .other-mode-input").removeAttribute("required");
        }
    })
});

//保存准备上传的图片
var preUploadOriginImages = new Array();
var preUploadThumbImages = new Array();
/* --------------------------------------------*/
//上传图片
$(function () {
    //图片上传
    $("#file_input").change(function () {
        var files = $("#file_input")[0].files
        var data = new FormData();
        for (var i=0; i<files.length; i++) {
            var file = files[i]
            //准备多文件上传
        }
        data.append('file', files[0])  //多图上传的问题暂未实现
        var img
        $.ajax({
            url: basicUrl + 'upload/upload',
            type: 'POST',
            data: data,
            cache: false,
            // 告诉jQuery不要去处理发送的数据
            processData: false,
            // 告诉jQuery不要去设置Content-Type请求头
            contentType: false,
            beforeSend: function () {
                console.log("正在进行，请稍候");
                img = previewImage()
            },
            success: function (response) {

                var resp = $.parseJSON(response);
                if (resp.err_code != 0) {
                    showModel(resp.err_msg)
                    img.parents('li.uploadImgLi').remove()
                    return
                }
                var image = resp.data;
                img.attr('src',basicUrl+image.thumb_url)
                img.css('background','none')
                img.click(function () {
                    // lookBigImg(basicUrl+image.origin_url)
                })
                // previewImage(basicUrl+data)
                //保存上传成功的图片
                preUploadOriginImages.splice(0,0,image.origin_url)
                preUploadThumbImages.splice(0,0,image.thumb_url)
            },
            error: function (resp) {
                showModel('上传图片失败')
                img.parents('li.uploadImgLi').remove()
            }
        });
    })
})
//选中图片时预览
function previewImage(tempSrc) {
    var imgContainer = $("#img-container");
    var img = $("<img class='uploadImg' alt=''/>")
    var li = $("<li></li>");
    li.append(img)
    var del = $("<div class='img-del'></div>")
    var delA = $("<a><img src='/images/delete-normal.png'/></a>")
    del.append(delA)
    li.append(del)
    imgContainer.prepend(li);
    if (!imgContainer.hasClass("has-img")) {
        imgContainer.addClass("has-img")
    }
    li.hover(function () {
        $(this).children('.img-del').animate({
            opacity:'0.5'
        },200);
    },function () {
        $(this).children('.img-del').animate({
            opacity:'0.0'
        },200);
    })

    delA.click(function () {
        //如果此时上传的图片已经上传成功,则要考虑从数组中删除图片。
        //从类名为uploadImgLi中过滤掉还没上传成功的元素
        if (img.attr('src') && img.attr('src') != '') {
            var uploadDoneIndexArr = new Array()
            $('li.uploadImgLi img').each(function () {
                if ($(this).attr('src') && $(this).attr('src') != '') {
                    var i = $(this).parents('li.uploadImgLi').index();
                    uploadDoneIndexArr.push(i)
                }
            })
            for (var index = 0; index < uploadDoneIndexArr.length; index++) {
                if (uploadDoneIndexArr[index] == li.index()) {
                    preUploadOriginImages.splice(index,1);
                    preUploadThumbImages.splice(index,1);
                    break
                }
            }

        }

        li.remove();
        if (imgContainer.children("li").length == 0) {
            imgContainer.removeClass("has-img")
        }
    })
    if (tempSrc) {
        img.attr('src',basicUrl+tempSrc)
        img.css('background','none')
    }
    return img
}

//验证码处理
$(function () {
    var phoneTf = $("#release-phone-tf")
    var getCodeBtn = $("#send-code-btn")
    var codeTf = $("#release-code-tf")
    getCodeBtn.attr("disabled","disabled")
    phoneTf.bind('input valueChange', function() {
        if (isCounting) {
            return
        }
        if (phoneIsValid()) {
            getCodeBtn.removeAttr("disabled")
            if (!getCodeBtn.hasClass("clickEnable")) {
                getCodeBtn.addClass("clickEnable")
            }
        } else {
            getCodeBtn.attr("disabled","disabled")
            getCodeBtn.removeClass("clickEnable")
        }
    })


    getCodeBtn.click(function () {
        isCounting = true
        count = 60
        getCodeBtn.val(count+"s后重新发送")
        getCodeBtn.css("font-size","12px")
        getCodeBtn.attr("disabled","disabled")
        getCodeBtn.removeClass("clickEnable")
        /*测试代码*/
        codeTf.val("0000")
        timer = setInterval(function () {
            count--
            if (count == 0) {
                clearInterval(timer)
                isCounting = false
                getCodeBtn.css("font-size","15px")
                getCodeBtn.val("获取验证码")
                if (phoneIsValid()) {
                    getCodeBtn.removeAttr("disabled")
                    if (!getCodeBtn.hasClass("clickEnable")) {
                        getCodeBtn.addClass("clickEnable")
                    }
                } else {

                }
                return
            }
            getCodeBtn.val(count+"s后重新发送")
        },1000)
    })

    //倒计时60s
    var count = 60
    var timer
    var isCounting = false
    //验证手机号是否输入正确
    var phoneIsValid = function () {
        var text = $("#release-phone-tf").val()
        return $().phoneIsValid(text)
    }
    //验证验证码格式是否正确
    var codeIsValid = function () {
        var text = $("#release-code-tf").val()
        return $().codeIsValid(text)
    }
});
var geocoder
var placeSearch
function searchSubway(address) {

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
                coor = [loc.getLng(), loc.getLat()];
                houseCoor = coor
                AMap.service('AMap.PlaceSearch',function() {//回调函数
                    //分类查询
                    placeSearch = new AMap.PlaceSearch({
                        city: cityCode //城市
                    });
                    placeSearch.setType("交通设施服务")
                    placeSearch.searchNearBy("地铁", houseCoor, distance, function (status, result, poiList) {
                        if (status === 'complete' && result.info === 'OK') {
                            subways = result.poiList.pois[0].address;
                            searchSubwaysCallback(subways);
                            var allSubway = subways.split(";");
                        } else {
                            console.log("查询地铁线路失败")
                            searchSubwaysCallback(subways);
                        }
                    });
                });
            }else{
                console.log("获取经纬度失败")
                searchSubwaysCallback(subways);
            }
        });
    })

}

/* -------------------------------------------- */
var subways = ""
var searchSubwaysCallback = function (subways) {
    sureRelease();
}

//发布操作

$(function () {

    $("#release").click(function () {

        //如果未登录,先登录
        if (getToken() == "") {
            showLoginPage();
            return;
        }
        var address = $("#district-select option:selected").text() + $(".address input").val();
        searchSubway(address); //找到地铁线路后,发起发布房源的请求
    })
})

function sureRelease() {
    //出租方式
    var rentMode = ''
    $(".rent-mode .publish-content a").each(function (i) {
        if ($(this).hasClass("selected")) {
            rentMode = $(this).text();
        }
    });

    //小区名字
    var village = $(".community .publish-content input").val();
    //区域
    var district = $("#district-select option:selected").text();
    //地址
    var address = $(".address input").val();
    //户型
    var style = $("#style-room").val() + "室" + $("#style-hall").val() + "厅" + $("#style-kitchen").val() + "厨" + $("#style-toilet").val() + "卫";
    if (rentMode == "合租") {
        style += $("#room-style option:selected").text();
    }
    //面积
    var area = $(".area input").val();
    //可入住日期
    var usableDate = $("#usable-date").val();
    //到期日期
    var deadline = $("#deadline-date").val();
    //朝向
    var orientation = $("#orientation option:selected").text();
    //楼层
    var floor = $(".current_floor").val();
    //最高楼层
    var max_floor = $(".max_floor").val();
    //设施
    var facilities = ""
    $(".facility .checkbox i.check").each(function () {
        facilities += $(this).next("label").text() + ";"
    })
    //租金
    var price = $(".rent-price input").val();
    //支付方式
    var selectPayMode = $("#pay-mode option:selected").text();
    var payMode = selectPayMode != "其他" ? selectPayMode : $(".other-mode-input").val();
    //转租优惠
    var benefit = $(".benefit textarea").val();
    //房源描述
    var houseDesc = $(".extra-desc textarea").val();
    //图片
    // if (preUploadImages.length == 0) {
    //     alert("请上传房间图片");
    //     return;
    // }
    //图片
    var images = preUploadOriginImages.reverse().join(";");
    //缩略图
    var thumbImages = preUploadThumbImages.reverse().join(";");
    //联系人
    var contact = $(".contact input").val();
    //电话
    var phone = $("#release-phone-tf").val();
    //微信号
    var wx = $(".wx input").val();
    //地铁线路
    var subway = subways;
    //房源id
    var houseId = parseInt(getParams("house_id"));
    if (houseId == 'undefined') {
        houseId = ""
    }
    //所有参数
    var params = {
        token: getToken(),
        house_id: houseId,
        rent_mode: rentMode,
        village: village,
        district: district,
        address: address,
        style: style,
        area: area,
        usable_date: usableDate,
        deadline_date: deadline,
        orientation: orientation,
        floor: floor,
        max_floor: max_floor,
        facilities: facilities,
        price: price,
        pay_mode: payMode,
        benefit: benefit,
        house_desc: houseDesc,
        contact: contact,
        phone: phone,
        wx: wx,
        subways:subway,
        images:images,
        thumb_images: thumbImages
    }
    var url = houseId == "" ? "house/release" : basicUrl + "house/modify";
    request(url, params, function (resp) {
        showModel('发布成功',function () {
            location.href = '/pc/release.html'
        },1000)
    })

}

/* --------------------------------------------*/
//发布房源
function releaseHouse() {

}

//修改房源
function modifyHouse() {

}


/* -------------------------------------------- */
//登录页
function showLoginPage() {
    var loginContainer = $("<div></div>")
    loginContainer.addClass("login-container")
    loginContainer.attr("id", "login-container")
    var overlayBg = $("<div></div>")
    overlayBg.addClass("overlay_bg")
    overlayBg.attr("id", "loginOverlay")
    var dialog = $("<div></div>")
    dialog.addClass("panel_login")
    dialog.attr("id", "dialog")
    loginContainer.append(overlayBg)
    loginContainer.append(dialog)
    var close = $("<i></i>")
    close.addClass("close")
    dialog.append(close)
    var closeImg = $("<img/>")
    closeImg.attr({
        "src": "../images/close.png"
    })
    close.append(closeImg)
    var panelInfo = $("<div></div>")
    panelInfo.addClass("panel_info")
    dialog.append(panelInfo)
    var ul = $("<ul></ul>")
    panelInfo.append(ul)
    var li1 = $("<li></li>")
    li1.addClass("panel_phone")
    ul.append(li1)
    var phoneTf = $("<input/>")
    phoneTf.addClass("login_info")
    phoneTf.attr({
        "id": "login_phone_tf",
        "type": "text",
        "required": "required",
        "placeholder": "输入手机号",
        "name": "phoneTf"
    })
    li1.append(phoneTf)
    var getCodeBtn = $("<input/>")
    getCodeBtn.attr({
        "id": "login_getCode_btn",
        "type": "button",
        "value": "获取验证码",
        "disabled": "disabled"
    })
    li1.append(getCodeBtn)
    var li2 = $("<li></li>")
    li2.addClass("panel_code")
    ul.append(li2)
    var codeTf = $("<input/>")
    codeTf.addClass("login_info")
    codeTf.attr({
        "id": "login_code_tf",
        "type": "text",
        "placeholder": "输入验证码",
    })
    li2.append(codeTf)
    var li3 = $("<li></li>")
    li3.addClass("panel_action")
    ul.append(li3)
    var loginBtn = $("<input class='login'/>")
    loginBtn.attr({
        "id": "login_btn",
        "type": "button",
        "value": "登录"
    })

    li3.append(loginBtn)
    var li4 = $("<li></li>")
    li4.addClass("panel_otherLogin")
    ul.append(li4)
    var otherLoginTitle = $("<div>------- 第三方登录 -------</div>")
    otherLoginTitle.addClass("otherLoginTitle")
    li4.append(otherLoginTitle)
    var wxLogin = $("<div></div>")
    wxLogin.addClass("wxLogin")
    li4.append(wxLogin)
    var wxLoginA = $("<a href='/pc/weixinLogin.html'><i><img src='/images/weixin.png' alt=''></i></a>")
    wxLogin.append(wxLoginA)
    $("body").append(loginContainer)

    phoneTf.bind('input valueChange', function () {
        if (isCounting) {
            return
        }
        if (phoneIsValid()) {
            getCodeBtn.addClass("phoneValid")
            getCodeBtn.removeAttr("disabled")
        } else {
            getCodeBtn.removeClass("phoneValid")
            getCodeBtn.attr("disabled", "disabled")
        }
    })


    getCodeBtn.click(function () {
        request(basicUrl+'login/captcha',{
            phone: $("#login_phone_tf").val()
        },function (resp) {
            showModel("获取验证码成功")
        })
        isCounting = true
        count = 60
        getCodeBtn.val(count + "s后重新发送")
        getCodeBtn.css("font-size", "12px")
        getCodeBtn.attr("disabled", "disabled")
        /*测试代码*/
        codeTf.val("000000")
        timer = setInterval(function () {
            count--
            if (count == 0) {
                clearInterval(timer)
                isCounting = false
                getCodeBtn.css("font-size", "15px")
                getCodeBtn.val("获取验证码")
                if (phoneIsValid()) {
                    getCodeBtn.removeAttr("disabled")
                } else {
                    getCodeBtn.removeClass("phoneValid")
                }
                return
            }
            getCodeBtn.val(count + "s后重新发送")
        }, 1000)
    })

    loginBtn.click(function () {
        if (phoneIsValid() && codeIsValid()) {
            loginRequest();
        } else {
            showModel("手机号或者验证码不正确")
        }
    })

    //渐变展示
    loginContainer.css("display", "none");
    loginContainer.fadeIn(200);

    //点击关闭按钮渐变消失
    close.click(function () {
        loginContainer.fadeTo(200, 0, function () {
            loginContainer.remove()
        })
    })

    //倒计时60s
    var count = 60
    var timer
    var isCounting = false
//验证手机号是否输入正确
    var phoneIsValid = function () {
        var text = $("#login_phone_tf").val()
        return $().phoneIsValid(text)
    }
//验证验证码格式是否正确
    var codeIsValid = function () {
        var text = $("#login_code_tf").val()
        return $().codeIsValid(text)
    }
}


function loginRequest() {

    request(basicUrl + "login/login",{
        phone: $("#login_phone_tf").val(),
        captcha: $("#login_code_tf").val()
    },function (resp) {
        var token = resp.token;
        document.cookie = "token=" + token;
        var loginContainer = $("#login-container");
        loginContainer.fadeTo(200, 0, function () {
            loginContainer.remove()
        })
        var logoutLi = $("<li><div class='header_menu_item'><a href='javascript:' id='resource-page-logout' onclick='logout()'>退出登录</a></div></li>");
        var memberLi = $("<li><div class='header_menu_item'><a href='/pc/member.html' id='to-memberCenter'>个人中心</a></div></li>");
        $("#header_menu_ul").prepend(logoutLi,memberLi);
        var loginLi = $("#release-page-login");
        loginLi.remove();
        logoutLi.click(function () {
            logout(function (flag) {
                location.reload();
            })
        })

        //获取用户信息
        getUserInfo();
    })
}

/* -------------------------------------------- */
/*
* 修改房源的处理
* */
function restoreHouseIfModify() {
    //房源id
    var houseId = parseInt(getParams("house_id"));
    if (isNaN(houseId) || houseId == 'undefined') {
        return
    }
    //根据houseId获取房源详情
    requestHouseDetail(houseId);
}
function requestHouseDetail(houseId) {
    $.post(basicUrl + "house/detail",
        {
            house_id: houseId
        },
        function (data, status) {
            if (status == 'success') {
                var houseDetail = $.parseJSON(data).data;
                loadHouseDetailInfo(houseDetail);
            } else {
                console.log("请求房源详情失败");
            }
        });
}
function loadHouseDetailInfo(house) {

    //出租方式
    $(".rent-mode .publish-content a").each(function (i) {
        if ($(this).text() == house.rent_mode) {
            $(".rent-mode .publish-content a").removeClass('selected')
            $(this).addClass('selected')
        }
    });

    //小区名字
    // var village = $(".community .publish-content input").val();
    //区域
    $("#district-select option").each(function () {
        if ($(this).text() == house.district) {
            $(this).attr('selected','selected')
        }
    })
    //地址
    $(".address input").val(house.address);
    //户型
    var roomSplit = house.style.split('室')
    $("#style-room").val(roomSplit[0])
    var hallSplit = roomSplit[1].split('厅')
    $("#style-hall").val(hallSplit[0])
    var kitchenSplit = hallSplit[1].split('厨')
    $("#style-kitchen").val(kitchenSplit[0])
    var toiletSplit = kitchenSplit[1].split('卫')
    $("#style-toilet").val(toiletSplit[0])
    if (house.rent_mode == "合租") {
        $("#room-style option").each(function () {
            if ($(this).text() == toiletSplit[1]) {
                $(this).attr('selected','selected')
            }
        })
        $("#room-style").css("visibility","visible");

    } else {
        $("#room-style").css("visibility","hidden");
    }
    //面积
    $(".area input").val(house.area);
    //可入住日期
    $("#usable-date").val(house.usable_date);
    //到期日期
    $("#deadline-date").val(house.deadline_date);
    //朝向
    $("#orientation option").each(function () {
        if ($(this).text() == house.orientation) {
            $(this).attr('selected','selected')
        }
    })
    //楼层
    $(".current_floor").val(house.floor);
    //最高楼层
    $(".max_floor").val(house.max_floor);
    //设施
    var facilities = house.facilities.split(';')
    $(".facility .checkbox i").each(function () {
        if (facilities.indexOf($(this).next("label").text())>-1) {
            $(this).addClass('check')
        }
    })
    //租金
    $(".rent-price input").val(house.price);
    //支付方式
    var otherPayMode = true
    var otherPayModeOption
    $("#pay-mode option").each(function () {
        if ($(this).text() == house.pay_mode) {
            otherPayMode = false
            $(this).attr('selected','selected');
        }
        if ($(this).text() == "其他") {
            otherPayModeOption = $(this);
        }
    })
    if (otherPayMode) {
        otherPayModeOption.attr('selected','selected');
        $(".other-mode-input").val(house.pay_mode)
    }
    //转租优惠
    $(".benefit textarea").val(house.benefit);
    //房源描述
    $(".extra-desc textarea").val(house.house_desc);

    //图片
    var images = house.images
    var originImages = new Array()
    var thumbImages = new Array()
    for (var i = 0; i < images.length; i++) {
        var image = images[i];
        originImages.push(image.origin_url)
        thumbImages.push(image.thumb_url)
    }

    for (var i=0; i<thumbImages.length; i++) {
        var img = thumbImages[i]
        previewImage(basicUrl + img)
    }
    preUploadOriginImages = originImages.reverse()
    preUploadThumbImages = thumbImages.reverse()

    //联系人
    $(".contact input").val(house.contact);
    //电话
    $("#release-phone-tf").val(house.phone);
    var getCodeBtn = $("#send-code-btn")
    getCodeBtn.removeAttr("disabled")
    if (!getCodeBtn.hasClass("clickEnable")) {
        getCodeBtn.addClass("clickEnable")
    }
    //微信号
    $(".wx input").val(house.wx);
}






