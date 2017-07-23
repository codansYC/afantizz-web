/**
 * Created by lekuai on 17/4/3.
 */
var house

var isCollection = false // true->已收藏; false->未收藏
var imgW = 0
var imgH = 0
var carousel
var imgList
var currentImgIndex = 0
var startX = 0
var startY = 0
var startT = new Date().getTime()  //记录手指按下的开始时间
var lastOffsetx = 0
var isMove = false
var imageCount = 3
$(function () {

    setCarousel()
    requestHouseInfo()

})

function setCarousel() {
    var carousel = $('#carousel')
    imgW = carousel.width()
    imgH = imgW * 3.0 / 4.0
    carousel.height(imgH);
    $('.imgList img').width(imgW)
    imgList = $('.imgList')

    //添加滑动事件

    $('#carousel, .bigCarousel').bind('touchstart',function (e) {
        e.stopPropagation()
        var touch = e.touches[0];
        console.log('touchstart')
        startX = touch.clientX;   //保存手指按下时的位置
        startY = touch.clientY;
        startT = new Date().getTime()  //记录手指按下的开始时间
    })
    $('#carousel, .bigCarousel').bind('touchmove',function (e) {
        e.stopPropagation()
        var touch = e.touches[0];
        console.log('touchmove')
        var deltaX = touch.clientX - startX;  //计算手指在X方向滑动的距离
        var deltaY = touch.clientY - startY;  //计算手指在Y方向滑动的距离

        //如果X方向上的位移大于Y方向，则认为是左右滑动
        if (Math.abs(deltaX) > Math.abs(deltaY)){
            var moveX = deltaX - lastOffsetx
            lastOffsetx = deltaX
            //同时移动当前元素及其左右元素
            moveImgList(moveX);

            isMove = true;
        }
    })
    $('#carousel, .bigCarousel').bind('touchend',function (e) {
        e.stopPropagation()
        lastOffsetx = 0
        if (isMove) { //发生了左右滑动
            //计算手指在屏幕上停留的时间
            var deltaT = new Date().getTime() - startT;
            //滑动之前的偏移量
            var originOffsetx = -imgW * currentImgIndex
            var currentLeft = imgList.position().left
            //如果停留时间小于300ms,则认为是快速滑动，无论滑动距离是多少，都停留到下一页
            if (currentLeft >= 0) {
                //已经向右滚动到头了
                currentImgIndex = 0
                //动画滚到currentImgIndex
            } else if (currentLeft <= -(imageCount - 1) * imgW) {
                //已经向左滚到头了
                currentImgIndex = imageCount - 1
            } else {

                if (currentLeft > originOffsetx) {
                    //右滑
                    if (currentLeft - originOffsetx > 0.5 * imgW || deltaT < 300) {
                        currentImgIndex--
                    }
                } else if (currentLeft < originOffsetx) {
                    //左滑
                    if (originOffsetx - currentLeft > 0.5 * imgW || deltaT < 300) {
                        currentImgIndex++
                    }
                }
            }
            moveTo(currentImgIndex);
            isMove = false
        }
    })

    $('.back a').click(function (e) {
        e.stopPropagation()
        history.back()
    })

}

function moveImgList(offsetx) {
    console.log(offsetx)
    var currentLeft = imgList.position().left;
    if (currentLeft >= 40 || currentLeft <= -imgW*(imageCount-1)-40) {
        return
    }
    var newLeft = currentLeft + offsetx
    imgList.css('left',newLeft+'px')
    $('.bigImgList').css('left',newLeft+'px')
}

function moveTo(index) {

    if (currentImgIndex < 0) {
        currentImgIndex = 0
    } else if (currentImgIndex >= imageCount) {
        currentImgIndex = imageCount-1
    }
    index = currentImgIndex
    var left = -index * imgW
    imgList.animate({
        'left': left+'px'
    },200)
    $('.bigImgList').animate({
        'left': left+'px'
    },200)
    $('.numIndicator .currentIndex').text(currentImgIndex+1)
}

//请求房源详情
function requestHouseInfo() {
    var houseId = parseInt(getParams("house_id"));
    var params = {
        token: getToken(),
        house_id: houseId
    }
    request(basicUrl+'house/detail',params,function (resp) {
        house = resp;
        showHouseInfo();
    })
}

//原图
var originImages = new Array();
//缩略图
var thumbImages = new Array();

//显示房源信息
function showHouseInfo() {

    //处理图片
    var images = house.images
    for (var i = 0; i < images.length; i++) {
        var image = images[i];
        originImages[i] = image.origin_url
        thumbImages[i] = image.thumb_url;
    }

    //幻灯片
    handleSmallImageCarousel()
    handleBigImageCarousel()

    //房间简介
    var title = house.title
    $('.titleInfo .house-title').text(title)
    $('.titleInfo .address .district').text(house.district + " -")
    $('.titleInfo .address .detail').text(house.address)
    $('.releaseDate .date').text(house.release_date)
    /*标签*/
    var tags = $('.tags')
    //出租方式
    var rentMode = $("<span class='rent-mode'></span>")
    rentMode.text(house.rent_mode)
    tags.append(rentMode)
    //房间结构(几室几厅)
    if (house.style != null || house.style != '') {
        var mainStyle = house.style.split('厅')[0] + '厅'
        var oStyle = $("<span class='mainStyle'></span>");
        oStyle.text(mainStyle)
        tags.append(oStyle)
    }

    //主卧或次卧
    if (house.rent_mode == '合租') {
        var secondStyle = house.style.slice(-2)
        var oStyle = $("<span class='secondStyle'></span>");
        oStyle.text(secondStyle)
        tags.append(oStyle)
    }
    //独立卫生间
    if (house.facilities.indexOf('独立卫生间') > -1) {
        var oToilet = $("<span class='toilet'></span>");
        oToilet.text('独卫')
        tags.append(oToilet)
    }
    //转租优惠
    if (house.benefit != "" && house.benefit != null) {
        var benefit = $("<span class='benefit'></span>")
        benefit.text('转租优惠')
        tags.append(benefit)
    }

    //是否收藏
    if (house.isCollection) {
        $('.collection .glyphicon').addClass('glyphicon-star')
        $('.collection span:last-child').text('已收藏')
    } else {
        $('.collection .glyphicon').addClass('glyphicon-star-empty')
        $('.collection span:last-child').text('收藏')
    }

    // 房间概况
    var generalList = new Array()
    var oPrice = $("<div class='col-xs-6 price'>" +
        "<span class='key'>租金:</span>" +
        "<span class='value'></span>" +
        "</div>")
    generalList.push(oPrice);

    var oPayMode = $("<div class='col-xs-6 pay-mode'>" +
        "<span class='key'>付款:</span>" +
        "<span class='value'></span>" +
        "</div>")
    generalList.push(oPayMode);

    if (house.village != null && house.village != '') {
        var oVillage = $("<div class='col-xs-6 village'>" +
            "<span class='key'>小区:</span>" +
            "<span class='value'></span>" +
            "</div>")
        generalList.push(oVillage);
    }

    if (house.floor != null && house.floor != '') {
        var oFloor = $("<div class='col-xs-6 floor'>" +
            "<span class='key'>楼层:</span>" +
            "<span class='value'></span>" +
            "</div>")
        generalList.push(oFloor);
    }
    var oOrientation = $("<div class='col-xs-6 orientation'>" +
        "<span class='key'>朝向:</span>" +
        "<span class='value'></span>" +
        "</div>")
    generalList.push(oOrientation);

    if (house.area > 0) {
        var oArea = $("<div class='col-xs-6 area'>" +
            "<span class='key'>面积:</span>" +
            "<span class='value'></span>" +
            "</div>")
        generalList.push(oArea);
    }

    var oUsableDate = $("<div class='col-xs-6 usableDate'>" +
        "<span class='key'>入住:</span>" +
        "<span class='value'></span>" +
        "</div>")
    generalList.push(oUsableDate);

    if (house.deadline_date != null && house.deadline_date != '') {
        var oDeadline = $("<div class='col-xs-6 deadline'>" +
            "<span class='key'>到期:</span>" +
            "<span class='value'></span>" +
            "</div>")
        generalList.push(oDeadline);
    }

    var general = $(".general");

    for (var i = 0; i < Math.ceil(generalList.length/2); i++) {
        var oRow = $("<div class='row'></div>")
        general.append(oRow)
        oRow.append(generalList[i*2])
        if (i*2+1 < generalList.length) {
            oRow.append(generalList[i*2+1])
        }
    }

    var price = house.price+"元/月"
    if (house.price == '' || house.price == null) {
        price = '面议';
    }
    $('.general .price .value').text(price)
    $('.general .pay-mode .value').text(house.pay_mode)
    $('.general .village .value').text(house.village)
    var floorDesc = house.floor
    if (house.max_floor == null || house.max_floor == '') {
        floorDesc = house.floor + '楼';
    } else {
        floorDesc = house.floor+'/'+house.max_floor
    }
    $('.general .floor .value').text(floorDesc)
    $('.general .orientation .value').text(house.orientation)
    $('.general .area .value').text(house.area+'㎡')
    $('.general .usableDate .value').text(house.usable_date)
    $('.general .deadline .value').text(house.deadline_date)

    //联系人
    $('.contact-accusation .name').text(house.contact)
    if (house.contact == null || house.contact == '') {
        $('.contact-accusation .name').css('display','none')
    }
    //手机号
    $('.contact-accusation .phoneNo').text(house.phone)
    $('.contact-accusation a.call').attr('href','tel://'+house.phone)
    $('.contact-accusation a.sms').attr('href','sms://'+house.phone)

    var showContactModes = new Array();
    if ((house.contact != null && house.contact != '') || (house.phone != null && house.phone != '')) {
        $('.phone').css('display','block')
        showContactModes.push($('.phone'))
    }
    //微信号
    if (house.wx != null && house.wx != '') {
        $('.weixin').css('display','block')
        $('.weixinNo').text(house.wx)
        showContactModes.push($('.weixin'))
    }
    //QQ号
    if (house.qq != null && house.qq != '') {
        $('.qq').css('display','block')
        $('.qqNo').text(house.qq)
        showContactModes.push($('.qq'))
    }

    if (showContactModes.length == 1) {
        var mode = showContactModes[0]
        mode.css('line-height','40px')
    }

    //房间配套
    var facilities = house.facilities.split(';')
    var facilityLis = $('.facilities>ul>li')
    facilityLis.each(function () {
        var name = $(this).children('p').text();
        if (facilities.indexOf(name) >= 0) {
            $(this).css('display','block')
        } else {
            $(this).css('display','none')
        }
    })

    //转租优惠
    if (house.benefit == null || house.benefit == '') {
        $('.benefit').css('display','none')
    } else {
        $('.benefit p').text(house.benefit)
    }

    //房间描述
    if (house.house_desc == null || house.house_desc == '') {
        $('.desc').css('display','none')
    } else {
        $('.desc p').text(house.house_desc)
    }

    //附近设施
    searchTCS(house.address, function (traffic,catering,shopping) {
        if (traffic == '') {
            $('.traffic').css('display','none')
        } else {
            $('.traffic').css('display','block')
            if (house.traffic == null || house.traffic == '') {
                $('.traffic').text('交通: ' + traffic)
            } else {
                $('.traffic').text('交通: ' + house.traffic)
            }
        }
        if (catering == '') {
            $('.catering').css('display','none')
        } else {
            $('.catering').css('display','block')
            $('.catering').text('餐饮: ' + catering)
        }
        if (shopping == '') {
            $('.shopping').css('display','none')
        } else {
            $('.shopping').css('display','block')
            $('.shopping').text('超市: ' + shopping)
        }
    })


    //记录收藏状态
    isCollection = house.isCollection

}

//收藏
function collectionRequest() {
    //先判断是否登录
    if (getToken() == null || getToken() == '') {
        location.href = 'login.html'
        return
    }
    var houseId = parseInt(getParams("house_id"));
    var params = {
        token: getToken(),
        house_id: houseId
    }
    var url = isCollection ? basicUrl+'house/cancel-collection' : basicUrl+'house/collection'
    request(url,params,function (resp) {
        if (isCollection) {
            showModel('取消收藏成功')
            $('.collection .glyphicon').removeClass('glyphicon-star')
            $('.collection .glyphicon').addClass('glyphicon-star-empty')
            $('.collection span:last-child').text('收藏')
        } else {
            showModel('收藏成功')
            $('.collection .glyphicon').removeClass('glyphicon-star-empty')
            $('.collection .glyphicon').addClass('glyphicon-star')
            $('.collection span:last-child').text('已收藏')
        }
        isCollection = !isCollection
    })

}

//举报
function accusate() {
    location.href = "/m/complain.html?house_id="+house.house_id
}

//处理小图幻灯片
function handleSmallImageCarousel() {
    //幻灯片
    var images = thumbImages
    imgList.children().remove()
    imageCount = images.length
    imgList.width(imgW*imageCount)
    var startIndex = imageCount == 0 ? 0 : 1
    $('.numIndicator .currentIndex').text(startIndex)
    $('.numIndicator .totalNum').text(imageCount)
    for (var i=0; i<images.length; i++) {
        var img = images[i]
        var li = $("<li class='pull-left'></li>")
        imgList.append(li)
        var oImg = $("<img alt=''>")
        oImg.attr('src',imageUrl+img)
        li.append(oImg)
        oImg.click(function () {
            var bigCarousel = $('.bigCarousel')
            var carouselH = bigCarousel.height()
            var h = $('.bigCarousel img').height()
            $('.bigCarousel img').css('margin-top',(carouselH-h)/2+'px')
            bigCarousel.removeClass('hidden');
        })
        oImg.width(imgW)
        oImg.height(imgH)
    }

}

//处理大图幻灯片
function handleBigImageCarousel() {
    //幻灯片
    var bigCarousel = $('.bigCarousel')
    var images = originImages
    var bigImgList = $('.bigImgList')
    bigImgList.children().remove()
    bigImgList.width(imgW * imageCount)
    var startIndex = images.length == 0 ? 0 : 1;
    $('.numIndicator .currentIndex').text(startIndex)
    $('.numIndicator .totalNum').text(imageCount)
    for (var i = 0; i < images.length; i++) {
        var img = images[i]
        var li = $("<li class='pull-left'></li>")
        bigImgList.append(li)
        var oImg = $("<img alt=''>")
        oImg.attr('src', imageUrl + img)
        li.append(oImg)
        oImg.click(function () {
            bigCarousel.addClass('hidden')
        })
        oImg.width(imgW)
    }
}


