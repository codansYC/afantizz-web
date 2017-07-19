/**
 * Created by lekuai on 2017/6/21.
 */
$(function () {



    //页面逻辑处理
    handleEvents()


});

function handleEvents() {
    /*出租方式*/
    //默认选中第一个
    $('.rent-mode-list .check-ratio').eq(0).addClass('checked')
    $('.rent-mode-list li').click(function () {
        $('.rent-mode-list .check-ratio').removeClass('checked')
        $(this).children('.check-ratio').addClass('checked')
        //户型的主次卧的显隐控制 以及 厨房类型的切换
        $('.kitchen-list .check-ratio').removeClass('checked')
        if ($(this).index() == 0) { //合租
            $('#room-style').css('display','inline-block')
            $('#kitchen-common').addClass('checked')
        } else { //整租或公寓
            $('#room-style').css('display','none')
            $('#kitchen-private').addClass('checked')
        }
        //调整标题
        adjustTitle()
    })
    /*厨房选择*/
    $('#kitchen-common').addClass('checked')
    $('.kitchen-list li').click(function () {
        $('.kitchen-list .check-ratio').removeClass('checked')
        $(this).children('.check-ratio').addClass('checked')
    })
    /*房间设施选择*/
    $(".house-facilities .checkbox").click(function () {
        if ($(this).find("i").hasClass("check")) {
            $(this).find("i").removeClass("check");
        } else {
            $(this).find("i").addClass("check");
        }
    });

    $(".house-facilities .select_all").click(function () {
        var oSpan = $(this).find("span")[0];
        if (oSpan.innerHTML == "全选") {
            oSpan.innerHTML = "取消";
            $(".house-facilities .checkbox").find("i").addClass("check");
        } else {
            oSpan.innerHTML = "全选";
            $(".house-facilities .checkbox").find("i").removeClass("check");
        }
    });

    /*标题*/
    //监测区域、出租方式改变
    $('#district-select,#room-style').change(function () {
        adjustTitle()
    })
    //监测户型、地址改变
    $('#address-detail,#style-room,#style-hall').bind('input propertychange',function () {
        adjustTitle()
    })

    function adjustTitle() {
        var district = $('#district-select option:selected').text()
        var address = $('#address-detail').val()
        var room = $('#style-room').val()
        var hall = $('#style-hall').val()
        var roomType = $('#room-style option:selected').text()
        var rentModeIndex = $('.rent-mode-list .check-ratio.checked').parent('li').index()
        if (address == '' || address == null || room == null || room == '' || hall == null
            || hall == '') {
            $('#house-title-field').val('')
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

        $('#house-title-field').val(title)
    }

}

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
            var key = 'file'+i
            //准备多文件上传
            data.append(key,file)
        }
        //data.append('file', files[0])  //多图上传的问题暂未实现
        var imgs = new Array()
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
                for (var i = 0; i < files.length; i++) {
                    var img = previewImage()
                    imgs.push(img)
                }
            },
            success: function (response) {
                var resp = $.parseJSON(response);
                if (resp.err_code != 0) {
                    showModel(resp.err_msg)
                    for (var i = 0; i < imgs.length; i++) {
                        var img = imgs[i]
                        img.parents('li.uploadImgLi').remove()
                    }
                    return
                }
                var imageUrls = resp.data
                for (var i = 0; i < imageUrls.length; i++) {
                    var url = imageUrls[i]
                    var img = imgs[i]
                    img.attr('src',basicUrl+url.thumb_url)
                    img.css('background','none')
                    preUploadOriginImages.push(url.origin_url)
                    preUploadThumbImages.push(url.thumb_url)
                }
            },
            error: function (resp) {
                showModel('上传图片失败')
                for (var i = 0; i < imgs.length; i++) {
                    var img = imgs[i]
                    img.parents('li.uploadImgLi').remove()
                }
                return
            }
        });
    })
})
//选中图片时预览
function previewImage(tempSrc) {
    var imgContainer = $("#img-container");
    var img = $("<img class='uploadImg' alt=''/>")
    if (tempSrc) {
        img.attr('src',imageUrl + tempSrc)
    }
    var li = $("<li class='uploadImgLi'></li>");
    li.append(img)
    var del = $("<div class='img-del'></div>")
    var delA = $("<a><img src='/images/delete-normal.png'/></a>")
    del.append(delA)
    li.append(del)
    imgContainer.append(li);
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
            $('li.uploadImgLi img.uploadImg').each(function () {
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
                            this.subways = handleSubways(pois)
                            this.traffics = handleTraffic(pois)
                            searchSubwaysCallback(subways,traffics);
                        } else {
                            console.log("查询地铁线路失败")
                            searchSubwaysCallback(subways,traffics);
                        }
                    });
                });
            }else{
                console.log("获取经纬度失败")
                searchSubwaysCallback(subways,traffics);
            }
        });
    })

}

/* -------------------------------------------- */
var subways = ""
var traffics = ""
var searchSubwaysCallback = function (subways,traffics) {
    alert(traffics)
    sureRelease();
}

//发布操作

$(function () {

    $("#release").click(function () {

        var address = $("#district-select option:selected").text() + $('#address-detail').val()
        searchSubway(address); //找到地铁线路后,发起发布房源的请求
    })
})

function sureRelease() {

    //出租方式
    var rentMode = $('.rent-mode-list .check-ratio.checked').parent('li').children('label').text()
    //区域
    var district = $("#district-select option:selected").text();
    //地址
    var address = $('#address-detail').val()
    //小区名字
    var village = $("#village-field").val();
    //户型
    var style = $("#style-room").val() + "室" + $("#style-hall").val() + "厅" + $("#style-toilet").val() + "卫";
    if (rentMode == "合租") {
        style += $("#room-style option:selected").text();
    }
    //厨房类型 1: 公共厨房; 2: 独立厨房; 3 无厨房
    var kitchenType = $('.kitchen-list .check-ratio.checked').parent('li').index() + 1
    //楼层
    var floor = $(".current_floor").val();
    //最高楼层
    var max_floor = $(".max_floor").val();
    //朝向
    var orientation = $("#orientation option:selected").text();
    //面积
    var area = $("#area-field").val();
    if (area == null || area == '') {
        area = 0
    }
    //租金
    var price = $("#price-field").val();
    //支付方式
    var payMode = $("#pay-mode option:selected").text();
    //发布时间
    var releaseDate = $("#release-date").val()
    //可入住日期
    var usableDate = $("#usable-date").val();
    if (usableDate == null || usableDate == '') {
        if (releaseDate == null || releaseDate == '') {
            showModel('请输入发布时间')
            return
        }
        usableDate = releaseDate.split(' ')[0]
    }
    //到期日期
    var deadline = $("#deadline-date").val();
    //设施
    var facilityArr = new Array()
    $(".house-facilities .checkbox i.check").each(function () {
        facilityArr.push($(this).next("label").text())
    })
    var facilities = facilityArr.join(';')
    //标题
    var title = $('#house-title-field').val()
    //转租优惠
    var benefit = $("#benefit-field").val();
    //房源描述
    var houseDesc = $("#desc-field").val();
    //图片
    var images = preUploadOriginImages.join(";");
    //缩略图
    var thumbImages = preUploadThumbImages.join(";");
    //联系人
    var contact = $("#owner-field").val();
    //电话
    var phone = $("#phone-field").val();
    //微信号
    var wx = $("#wx-field").val();
    //QQ号
    var qq = $("#qq-field").val();
    //地铁线路
    var subway = subways;
    //交通s
    var traffic = traffics;
    //房源id
    var houseId = '';
    //所有参数
    var params = {
        token: getToken(),
        house_id: houseId,
        rent_mode: rentMode,
        district: district,
        address: address,
        village: village,
        style: style,
        kitchen_type: kitchenType,
        floor: floor,
        max_floor: max_floor,
        orientation: orientation,
        area: area,
        price: price,
        pay_mode: payMode,
        usable_date: usableDate,
        deadline_date: deadline,
        facilities: facilities,
        title: title,
        benefit: benefit,
        house_desc: houseDesc,
        images:images,
        thumb_images: thumbImages,
        contact: contact,
        phone: phone,
        wx: wx,
        qq: qq,
        subways:subway,
        traffic: traffic,
        release_date: releaseDate
    }
    var url = getParams("house_id") == null ? basicUrl + "admin/release" : basicUrl + "admin/release";
    request(url, params, function (resp) {
        showModel('发布成功',function () {
            location.reload()
        },1000)
    })

}


