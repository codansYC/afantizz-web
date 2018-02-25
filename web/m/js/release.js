/**
 * Created by lekuai on 17/4/1.
 */
var url_token = null
var isModify = false
$(function () {

    //先判断是否有房源id传过来,如果有,即为编辑,否则为新发布
    initViews()
    initEvents()
    initData()
    addMoveEventForImgUl()
    restoreHouseIfModify();

    function initViews() {

    }

    function initEvents() {
        $(".facility .checkBox").click(function () {
            if ($(this).find("i").hasClass("check")) {
                $(this).find("i").removeClass("check");
            } else {
                $(this).find("i").addClass("check");
            }
        });

        //
        $("#rentMode").change(function () {
            var rentMode = $(this).children('option:selected').val()
            $('#kitchen-type option').removeProp('selected')
            if (rentMode == '1') {
                $(".jointRentStyle li:last-child,.jointRentStyle .lineInner").css('display','block')
                $('#kitchen-type option').eq(0).prop('selected','selected');
            } else {
                $(".jointRentStyle li:last-child,.jointRentStyle .lineInner").css('display','none')
                $('#kitchen-type option').eq(1).prop('selected','selected');
            }
            adjustTitle()
        })

        /*标题*/
        //监测区域、出租方式改变
        $('#district,#jointRentStyle').change(function () {
            adjustTitle()
        })
        //监测户型、地址改变
        $('#detailAddress,.hall,.room').bind('input propertychange',function () {
            adjustTitle()
        })
    }

    function initData() {
        url_token = getParams('token')
    }

})

/*调整标题*/
function adjustTitle() {
    var district = $('#district option:selected').text()
    var address = $('#detailAddress').val()
    var room = $('.room').val()
    var hall = $('.hall').val()
    var roomType = $('#jointRentStyle option:selected').text()
    var rentModeIndex = $('#rentMode option:selected').index()
    if (address == '' || address == null || room == null || room == '' || hall == null
        || hall == '') {
        $('.titleArea').val('')
        return
    }
    var title = ''
    switch (rentModeIndex) {
        case 0:
            title = '转租'+district+address+room+'室'+hall+'厅'+roomType
            break
        case 1:
            title = '转租'+district+address+room+'室'+hall+'厅'
            break
        case 2:
            title = '转租'+district+address+'公寓'
            break
        default:
            break
    }

    $('.titleArea').val(title)
}


/* =========================================================*/
//先判断是否有房源id传过来,如果有,即为编辑,否则为新发布
function restoreHouseIfModify() {
    //房源id
    var houseId = getParams("house_id");
    if (houseId === null || houseId.length == 0) {
        isModify = false
        return
    }
    isModify = true
    //根据houseId获取房源详情
    requestHouseDetail(houseId);
}
function requestHouseDetail(houseId) {
    var token = url_token
    if (token === null || token.length == 0) {
        token = getToken()
    }
    var params = {
        house_id: houseId,
        token: token
    }
    request('house/restore',params,function (resp) {
        var house = resp;
        loadHouseInfo(house);
    })
}
function loadHouseInfo(house) {

    //图片
    var images = house.images
    var originImages = new Array()
    var thumbImages = new Array()
    for (var i = 0; i < images.length; i++) {
        var image = images[i];
        originImages.push(image.url)
        thumbImages.push(image.thumb_url)
    }

    for (var i=0; i<thumbImages.length; i++) {
        var img = thumbImages[i]
        previewImage(img)
    }
    preUploadImages = originImages.reverse()
    //小区
    $(".village input").val(house.village)
    //区域
    $("#district option:selected").removeProp('selected')
    $("#district option").each(function () {
        if ($(this).val() == house.district_code) {
            $(this).prop('selected','selected');
        }
    })
    //地址
    $("#detailAddress").val(house.address);
    //出租方式
    $("#rentMode option:selected").removeProp('selected')
    $("#rentMode option").each(function () {
        if ($(this).val() == house.rent_type) {
            $(this).prop('selected','selected');
        }
    })
    //户型
    $(".styleDesc .room").val(house.room_num)
    $(".styleDesc .hall").val(house.hall_num)
    $(".styleDesc .toilet").val(house.toilet_num)
    $('#kitchen-type option').removeAttr('selected')
    $('#kitchen-type option').each(function () {
        if ($(this).val() == house.kitchen_type) {
            $(this).prop('selected','selected');
        }
    })
    if (house.rent_type == 1) {
        $(".jointRentStyle li:last-child,.jointRentStyle .lineInner").css('display','block')
    } else {
        $(".jointRentStyle li:last-child,.jointRentStyle .lineInner").css('display','none')
    }
    //面积
    $("#areaInput").val(house.area);
    //楼层
    var floor = $(".floor").val(house.floor);
    //最高楼层
    var max_floor = $(".max_floor").val(house.max_floor);
    //朝向
    $("#orientation option:selected").removeProp('selected')
    $("#orientation option").each(function () {
        if ($(this).val() == house.orientation) {
            $(this).prop('selected','selected')
        }
    })
    //租金
    $("#priceInput").val(house.price)
    //支付方式
    $("#pay-mode option").removeProp('selected')
    $("#pay-mode option").each(function () {
        if ($(this).text() == house.pay_mode) {
            $(this).prop('selected','selected')
        }
    })
    //可入住日期
    $(".usableDate").val(house.usable_time.split(' ')[0]);
    //到期日期
    $(".deadline").val(house.deadline_time.split(' ')[0]);
    //设施
    var facilities = house.installation
    $(".facility .checkBox i").each(function () {
        if (facilities.indexOf($(this).next("label").data('fid'))>-1) {
            $(this).addClass('check')
        }
    })
    //标题
    $(".titleArea").val(house.title)
    //转租优惠
    $(".benefit textarea").val(house.benefit);
    //房源描述
    $(".extra-desc textarea").val(house.house_desc);
    //联系人
    $(".contact").val(house.contact);
    //电话
    $(".phone").val(house.phone);
    //微信号
    $(".wx").val(house.wx);
}

$(function () {
    //图片上传
    $("#file_input").change(function () {

        var file = $("#file_input")[0].files[0]
        var data = new FormData();
        data.append('file', file)
        var img
        $.ajax({
            url: imageUrl + 'upload/image',
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
                var imageUrl = resp.data.url;
                img.attr('src',imageUrl)
                img.click(function () {
                    // lookBigImg(basicUrl+image.origin_url)
                })
                // previewImage(basicUrl+data)
                //保存上传成功的图片
                preUploadImages.splice(0,0,imageUrl)
            },
            error: function (resp) {
                console.log(resp)
                showModel('上传图片失败',function () {
                    img.parents('li.uploadImgLi').remove()
                })

            }
        });
    })
})

/*==========================================================*/
/*上传图片*/

//保存准备上传的原图
var preUploadImages = new Array();
//保存准备上传的缩略图
//选中图片时预览
function previewImage(file) {
    var imgUl = $("#img-container");
    var cameraLi = $("li.camera")
    var img = $("<img alt=''/>")
    if (file) {
        img.attr('src',file)
        img.click(function () {
            // lookBigImg(basicUrl+file)
        })
    }
    var li = $("<li class='uploadImgLi'></li>");
    cameraLi.after(li)
    li.append(img)
    var closeBtn = $("<button type='button' class='close' aria-label='Close'>" +
        "<span aria-hidden='true'>&times;</span>" +
        "</button>")
    li.append(closeBtn)
    closeBtn.click(function () {
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
                    preUploadImages.splice(index,1);
                    break
                }
            }

        }
        li.remove();
        updateImgUlWidth()
    })



    updateImgUlWidth()


    return img
}

//设置上传图片的ul的宽度
function updateImgUlWidth() {
    var ul = $('#img-container')
    var imgsCount = $('#img-container>li').length
    var imgW = $('#img-container>li').outerWidth()
    ul.width(imgsCount*(imgW+5))
}

//给上传图片的ul添加滑动事件
var startX = 0
var startY = 0
function addMoveEventForImgUl() {

    var ul = $('#img-container')
    ul.bind('touchstart',function (e) {
        e.stopPropagation()
        var touch = e.touches[0];
        startX = touch.clientX;   //保存手指按下时的位置
        startY = touch.clientY;
    })
    ul.bind('touchmove',function (e) {
        e.stopPropagation()
        if (ul.width() <= $('.imgBg').width()) {
            return
        }
        var lastLeft = ul.position().left

        var maxOffset = ul.width()-$('.imgBg').width()-15
        var touch = e.touches[0];
        var deltaX = touch.clientX - startX;  //计算手指在X方向滑动的距离
        var deltaY = touch.clientY - startY;  //计算手指在Y方向滑动的距离
        if (lastLeft < -maxOffset && deltaX <= 0) {
            return
        }
        if (lastLeft > 15 && deltaX > 0) {
            return
        }
        startX = touch.clientX
        startY = touch.clientY
        //如果X方向上的位移大于Y方向，则认为是左右滑动
        if (Math.abs(deltaX) > Math.abs(deltaY)){
            currentLeft = lastLeft + deltaX
            ul.css('left',currentLeft+'px')

        }
    })
    ul.bind('touchend',function (e) {
        e.stopPropagation()
        var maxOffset = ul.width()-$('.imgBg').width()-15
        if (ul.position().left > 15) {
            ul.css('left','15px')
        } else if (ul.position().left < -maxOffset) {
            ul.css('left',-maxOffset+'px')
        }
    })

}

/*==================================================*/
//发布操作

//发布房源
function sureRelease() {
    //检查移动端是否有与js交互相关的对象传过来

    if (typeof(JSInteraction) != "undefined" && JSInteraction != null) {
        JSInteraction.showLoadingWhileReleasing()
    }
    var address = $("#detailAddress").val();
    if (address == '') {
        showModel('请输入详细地址')
        if (typeof(JSInteraction) != "undefined" && JSInteraction != null) {
            JSInteraction.removeLoadingReleaseDone()
        }
        return
    }
    searchSubway(address,function (subways,traffics) {
        release(subways,traffics)
    })
}
function release(subways,traffics) {

    //地址
    var address = $("#detailAddress").val();
    //出租方式
    var rentType = $("#rentMode option:selected").val();
    //小区名字
    var village = $(".village input").val();
    //区域
    var district = $("#district option:selected").val();
    //户型
    var roomNum = $(".styleDesc .room").val()
    var hallNum = $(".styleDesc .hall").val()
    var toiletNum = $(".styleDesc .toilet").val()
    var roomType = $("#jointRentStyle option:selected").val()
    //厨房
    var kitchenType = $('#kitchen-type option:selected').val()
    //面积
    var area = $("#areaInput").val();
    //可入住日期
    var usableDate = $(".usableDate").val();
    //到期日期
    var deadline = $(".deadline").val();
    //朝向
    var orientation = $("#orientation option:selected").val();
    //楼层
    var floor = $(".floor").val();
    //最高楼层
    var max_floor = $(".max_floor").val();
    //设施
    var facilities = new Array();
    $(".facility .checkBox i.check").each(function () {
        facilities.push($(this).next("label").data('fid'))
    })
    var facilitiesStr = facilities.join(',')
    //租金
    var price = $("#priceInput").val();
    //支付方式
    var payMode = $("#pay-mode option:selected").text();
    //发布标题
    var title = $('.titleArea').val()
    //转租优惠
    var benefit = $(".benefit textarea").val();
    //房源描述
    var houseDesc = $(".extra-desc textarea").val();
    //图片
    var images = preUploadImages.join(',')
    //联系人
    var contact = $(".contact").val();
    //电话
    var phone = $(".phone").val();
    //微信号
    var wx = $(".wx").val();
    //QQ号
    var qq = $(".qq").val();
    //地铁线路
    var subway = subways;
    //附近交通
    var traffic = traffics
    //房源id
    var houseId = getParams("house_id");
    // token
    var token = url_token
    if (url_token == null || url_token == "") {
        token = getToken()
    }
    //所有参数
    var params = {
            token: token,
            house_id: houseId,
            rent_type: rentType,
            village: village,
            district_code: district,
            address: address,
            room_num: roomNum,
            hall_num: hallNum,
            toilet_num: toiletNum,
            kitchen_type: kitchenType,
            room_type: roomType,
            area: area,
            usable_date: usableDate,
            deadline_date: deadline,
            orientation: orientation,
            floor: floor,
            max_floor: max_floor,
            installation: facilitiesStr,
            price: price,
            pay_mode: payMode,
            title: title,
            benefit: benefit,
            house_desc: houseDesc,
            contact: contact,
            phone: phone,
            wx: wx,
            qq: qq,
            subways:subway,
            traffic: traffic,
            images:images,
            platform: 'js'
        }
    var url = isModify ? basicUrl + "house/modify" : basicUrl + "house/release" ;
    $.post(url, params, function (response, status) {
        if (typeof(JSInteraction) != "undefined" && JSInteraction != null) {
            JSInteraction.removeLoadingReleaseDone()
        }
        if (status != 'success') {
            showModel('操作失败,请稍后重试')
            return
        }
        var resp = $.parseJSON(response);
        if (resp.err_code != 0) {
            showModel(resp.err_msg)
            return
        }
        showModel('发布成功',function () {
            location.reload()
            var params = (decodeURIComponent(location.href).split("?")[1]).split("&")
            var destUrl = getMainPath()
            for (var i = 0; i < params.length; i++) {
                var param = params[i]
                if (param.indexOf("house_id") < 0) {
                    if (destUrl.indexOf("?") < 0) {
                        destUrl += ("?" + param)
                    } else {
                        destUrl += ("&" + param)
                    }
                }
            }
            location.href = destUrl
        },1000)
    });
}






